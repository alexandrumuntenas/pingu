/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2109               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const mysql = require('mysql2')

const talkedRecently = new Set()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES] })

client.log = require('./modules/customLogger')

client.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8_unicode_ci',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0
})

client.pool.config.namedPlaceholders = true

client.log.info('Cargando Eventos')
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const guildMemberAdd = require('./events/guildMemberAdd')
const guildMemberRemove = require('./events/guildMemberRemove')
client.log.success('Eventos Cargados')

client.log.info('Cargando Módulos')
const levelingRankUp = require('./modules/levelingRankUp')
const noMoreInvites = require('./modules/noMoreInvites')
const checkFolder = require('./modules/checkFolders')
client.log.success('Módulos Cargados')

client.log.info('Cargando Servicios Third-Party')
const topggSDK = require('./modules/third-party/topggSDK')
const commandHandler = require('./modules/commandHandler')
const interactionCreate = require('./events/interactionCreate')
client.log.success('Servicios Third-Party Cargados')

// Bot
if (process.env.ENTORNO === 'public') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production',
    integrations: [
      new Tracing.Integrations.Mysql()
    ]
  })
  topggSDK(client)
  client.login(process.env.PUBLIC_TOKEN)
} else {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'development',
    integrations: [
      new Tracing.Integrations.Mysql()
    ]
  })
  client.login(process.env.INSIDER_TOKEN)
}

client.Sentry = Sentry

client.commands = commandHandler.loadCommands(client)

client.on('ready', () => {
  checkFolder()
  client.log.info(`Conectado como ${client.user.tag}!`)
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'Discord',
      type: 'WATCHING'
    }]
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: 'Discord',
        type: 'WATCHING'
      }]
    })
    client.log.info('Presencia refrescada')
  }, 3600000)
})

client.on('guildCreate', (guild) => {
  guildCreate(client, guild)
})

client.on('guildDelete', (guild) => {
  guildDelete(client, guild)
})

client.on('guildMemberAdd', (member) => {
  guildMemberAdd(client, member)
})

client.on('guildMemberRemove', (member) => {
  guildMemberRemove(client, member)
})

client.on('interactionCreate', async interaction => {
  interactionCreate(client, interaction)
})

client.on('messageCreate', (message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [message.guild.id], (err, result, rows) => {
    if (err) throw client.log.error(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      message.database = result[0]
      if (message.content.startsWith(message.database.guild_prefix) && message.content !== message.database.guild_prefix) {
        message.args = message.content.slice(message.database.guild_prefix.length).trim().split(/ +/)
      }
      const contenido = message.content.toLowerCase()
      if (message.content.startsWith(message.database.guild_prefix) && message.args) {
        const command = message.args[0]
        message.args.shift()
        if (client.commands.has(command)) {
          const mCeIC = Sentry.startTransaction({
            op: 'messageCreate/executeInternalCommand',
            name: `Execute Internal Command (${command})`
          })
          try {
            client.commands.get(command).execute(client, message.database.guild_language || 'en', message)
          } catch (err) {
            Sentry.captureException(err)
            client.log.error(err)
            message.channel.send('Se ha producido un error cuando ha intentado ejecutar este comando...')
          } finally {
            mCeIC.finish()
          }
        } else {
          const mCeEC = Sentry.startTransaction({
            op: 'messageCreate/executeExternalCommand',
            name: 'Execute External Command'
          })
          client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [message.guild.id], (err, result) => {
            if (err) {
              Sentry.captureException(err)
              client.log.error(err)
            }
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `cmd` = ?', [message.guild.id, command], (err, result) => {
                if (err) {
                  Sentry.captureException(err)
                  client.log.error(err)
                }
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  message.channel.send('<:comandoscustom:858671400424046602>' + result[0].returns).catch((err) => {
                    client.log.error(err)
                    Sentry.captureException(err)
                  }).finally(mCeEC.finish())
                }
              })
            }
          })
        };
      }

      if (message.database.moderator_noMoreInvites_enabled !== 0) {
        noMoreInvites(client, message, result)
      }
      if (message.database.leveling_enabled !== 0) {
        const mClRU = Sentry.startTransaction({
          op: 'messageCreate/levelingRankUp',
          name: 'Leveling Rank Up'
        })
        try {
          if (!contenido.startsWith(message.database.guild_prefix)) {
            if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
              talkedRecently.add(`${message.author.id}_${message.guild.id}`)
              setTimeout(() => {
                talkedRecently.delete(`${message.author.id}_${message.guild.id}`)
              }, 60000)
              levelingRankUp(client, message)
            }
          }
        } catch (err) {
          Sentry.captureException(err)
          client.log.error(err)
        } finally {
          mClRU.finish()
        }
      }

      const mCgAR = Sentry.startTransaction({
        op: 'messageCreate/guildAutoResponder',
        name: 'Auto Responder'
      })
      client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ?', [message.guild.id], (err, result) => {
        if (err) {
          Sentry.captureException(err)
          client.log.error(err)
        }
        if (result) {
          try {
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `action` = ?', [message.guild.id, contenido], (err, result) => {
                if (err) {
                  Sentry.captureException(err)
                  client.log.error(err)
                }
                if (result) {
                  if (Object.prototype.hasOwnProperty.call(result, 0)) {
                    message.channel.send('<:respuestacustom:858671300024074240> ' + result[0].returns)
                  }
                }
              })
            }
          } catch (err) {
            Sentry.captureException(err)
            client.log.error(err)
          } finally {
            mCgAR.finish()
          }
        }
      })
    } else {
      guildCreate(client, message.guild)
    }
  }
  )
})
