/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2109               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Collection, Intents } = require('discord.js')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const mysql = require('mysql2')
const fs = require('fs')
const express = require('express')

const talkedRecently = new Set()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES] })

console.log('[··] Cargando Eventos')
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const guildMemberAdd = require('./events/guildMemberAdd')
const guildMemberRemove = require('./events/guildMemberRemove')
console.log('[OK] Eventos Cargados')

console.log('[··] Cargando Módulos')
const levelingRankUp = require('./modules/levelingRankUp')
const noMoreInvites = require('./modules/noMoreInvites')
const checkFolder = require('./modules/checkFolders')
console.log('[OK] Módulos Cargados')

console.log('[··] Cargando Servicios Third-Party')
const topggSDK = require('./modules/third-party/topggSDK')
console.log('[OK] Servicios Third-Party Cargados')

// Bot
if (process.env.ENTORNO === 'public') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production'
  })

  topggSDK(client)
  client.login(process.env.PUBLIC_TOKEN)
  const app = express()
  app.get('/', (req, res) => {
    res.send('Pingu is online!')
  })
  app.listen(25699, () => {
    console.log('[OK] Running web-server')
  })
} else {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'development'
  })
  client.login(process.env.INSIDER_TOKEN)
}

client.Sentry = Sentry

// Cargar comandos
console.log('--Cargando comandos--')

client.commands = new Collection()

loadCommands(client.commands, './tools')

/**
 * Load Pingu Commands
 * @param {collection} collection Discord Collection for Commands
 * @param {directory} directory The Directory Where Commands are stored
 */
function loadCommands (collection, directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const path = `${directory}/${file}`

    if (file.endsWith('.js')) {
      const command = require(path)
      console.log(`[··] Cargando ${command.name}`)
      collection.set(command.name, command)
      console.log(`[OK] Cargado ${command.name}`)
    } else if (fs.lstatSync(path).isDirectory()) {
      loadCommands(collection, path)
    }
  }
};

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

client.on('ready', () => {
  checkFolder()
  console.log('[OK] Bot inicializado...')
  console.log(`[IF] Logged in as ${client.user.tag}!`)
  client.user.setPresence({
    status: 'idle',
    activities: [{
      name: 'Discord',
      type: 'WATCHING'
    }]
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'idle',
      activities: [{
        name: 'Discord',
        type: 'WATCHING'
      }]
    })
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

client.on('messageCreate', (message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [message.guild.id], (err, result, rows) => {
    if (err) throw console.log(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      if (message.content.startsWith(result[0].guild_prefix) && message.content !== result[0].guild_prefix) {
        message.args = message.content.slice(result[0].guild_prefix.length).trim().split(/ +/)
      }
      const contenido = message.content.toLowerCase()
      if (message.content.startsWith(result[0].guild_prefix) && message.args) {
        const command = message.args[0]
        message.args.shift()
        if (client.commands.has(command)) {
          const mCeIC = Sentry.startTransaction({
            op: 'messageCreate/executeInternalCommand',
            name: `Execute Internal Command (${command})`
          })
          try {
            client.commands.get(command).execute(client, result[0].guild_language || 'en', message, result)
          } catch (err) {
            Sentry.captureException(err)
            console.log(err)
            message.reply('Se ha producido un error cuando ha intentado ejecutar este comando...')
          } finally {
            mCeIC.finish()
          }
        } else {
          const mCeEC = Sentry.startTransaction({
            op: 'messageCreate/executeExternalCommand',
            name: 'Execute External Command'
          })
          client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [message.guild.id], (err, result) => {
            if (err) Sentry.captureException(err)
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `cmd` = ?', [message.guild.id, command], (err, result) => {
                if (err) Sentry.captureException(err)
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  message.channel.send('<:comandoscustom:858671400424046602>' + result[0].returns).catch((err) => Sentry.captureException(err)).finally(mCeEC.finish())
                }
              })
            }
          })
        };
      }

      if (result[0].moderator_noMoreInvites_enabled !== 0) {
        noMoreInvites(message, result, client)
      }
      if (result[0].leveling_enabled !== 0) {
        const mClRU = Sentry.startTransaction({
          op: 'messageCreate/levelingRankUp',
          name: 'Leveling Rank Up'
        })
        try {
          if (!contenido.startsWith(result[0].guild_prefix)) {
            if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
              talkedRecently.add(`${message.author.id}_${message.guild.id}`)
              setTimeout(() => {
                talkedRecently.delete(`${message.author.id}_${message.guild.id}`)
              }, 60000)
              levelingRankUp(client, message, result)
            }
          }
        } catch (err) {
          Sentry.captureException(err)
        } finally {
          mClRU.finish()
        }
      }

      const mCgAR = Sentry.startTransaction({
        op: 'messageCreate/guildAutoResponder',
        name: 'Auto Responder'
      })
      client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ?', [message.guild.id], (err, result) => {
        if (err) Sentry.captureException(err)
        if (result) {
          try {
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `action` = ?', [message.guild.id, contenido], (err, result) => {
                if (err) Sentry.captureException(err)
                if (result) {
                  if (Object.prototype.hasOwnProperty.call(result, 0)) {
                    message.channel.send('<:respuestacustom:858671300024074240> ' + result[0].returns)
                  }
                }
              })
            }
          } catch (err) {
            Sentry.captureException(err)
          } finally {
            mCgAR.finish()
          }
        }
      })
    } else {
      guildCreate(message.guild)
    }
  }
  )
})
