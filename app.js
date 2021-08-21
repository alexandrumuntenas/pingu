/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2108               *
 * Actualización: 2108.031233  *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const makeId = require('./gen/makeId')
const { Client, Collection } = require('discord.js')
const topgg = require('topgg-autoposter')
const mysql = require('mysql2')
const fs = require('fs')
const log = require('simple-node-logger').createRollingFileLogger({
  logDirectory: './logs',
  fileNamePattern: `<date>_${makeId(5)}.log`,
  dateFormat: 'YYYY.MM.DD'
})

// Redireccionar console.log a @package/simple-node-logger
console.log = function (d) {
  process.stdout.write(`${d}\n`)
  log.info(d)
}

process.on('uncaughtException', function (err) {
  log.warn((err && err.stack) ? err.stack : err)
})

const talkedRecently = new Set()
const client = new Client()

console.log('[··] Cargando Eventos')
const guildcreate = require('./events/guildCreate')
const guilddelete = require('./events/guildDelete')
const guildmemberadd = require('./events/guildMemberAdd')
const guildmemberremove = require('./events/guildMemberRemove')
console.log('[OK] Eventos Cargados')

console.log('[··] Cargando Servicios')
const levelingRankUp = require('./modules/levelingRankUp')
const noMoreInvites = require('./modules/noMoreInvites')
const freshping = require('./services/freshping')
console.log('[OK] Servicios Cargados')

// Bot
if (process.env.ENTORNO !== 'desarrollo') {
  // eslint-disable-next-line new-cap
  const ap = topgg.AutoPoster(process.env.TOPGG, client)
  console.log('[··] Publicando Estadísticas a Top.GG')
  ap.on('posted', () => {
    console.log('[OK] Estadísticas publicadas en Top.GG')
  })
  client.login(process.env.PUBLIC_TOKEN)
  freshping(25699, client)
} else {
  freshping(8000, client)
  client.login(process.env.INSIDER_TOKEN)
}

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

const con = mysql.createConnection({
  host: '104.128.239.45',
  user: 'u43502_Ipea7UopvX',
  password: 'T0^Y9yXARCuAa1.LfAzmWRRt',
  database: 's43502_pingu',
  charset: 'utf8_unicode_ci'
})

con.connect(function (err) {
  console.log('[··] Conectando a MariaDB')
  if (err) {
    log.warn(err)
  } else {
    console.log('[OK] Conexión establecida con MariaDB')
  }
})

con.config.namedPlaceholders = true

client.on('ready', () => {
  console.log('[OK] Bot inicializado...')
  console.log(`[IF] Logged in as ${client.user.tag}!`)
  client.user.setPresence({
    status: 'idle',
    activity: {
      name: 'Discord',
      type: 'WATCHING'
    }
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'idle',
      activity: {
        name: 'Discord',
        type: 'WATCHING'
      }
    })
  }, 3600000)
})

client.on('guildCreate', (guild) => {
  guildcreate(con, guild)
})

client.on('guildDelete', (guild) => {
  guilddelete(con, guild)
})

client.on('guildMemberAdd', (member) => {
  guildmemberadd(client, con, member)
})

client.on('guildMemberRemove', (member) => {
  guildmemberremove(client, con, member)
})

client.on('message', (message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  con.query('SELECT * FROM `guild_data` WHERE guild = ?', [message.guild.id], (err, result, rows) => {
    if (err) throw console.log(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      let args = []
      if (message.content.startsWith(result[0].guild_prefix) && message.content !== result[0].guild_prefix) {
        args = message.content.slice(result[0].guild_prefix.length).trim().split(/ +/)
      }
      const contenido = message.content.toLowerCase()
      if (message.content.startsWith(result[0].guild_prefix)) {
        if (args) {
          if (client.commands.has(args[0])) {
            try {
              client.commands.get(args[0]).execute(args, client, con, contenido, message, result)
            } catch (err) {
              log.warn(err)
              message.reply(' se ha producido un error cuando ha intentado ejecutar este comando...')
            }
          } else {
            con.query('SELECT * FROM `guild_commands` WHERE `guild` = ?', [message.guild.id], (err, result) => {
              if (err) console.log(err)
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                const buscarcomando = 'SELECT * FROM `guild_commands` WHERE `guild` = \'' + message.guild.id + '\' AND `cmd` = \'' + args[0] + '\''
                con.query(buscarcomando, (err, result) => {
                  if (err) console.log(err)
                  if (Object.prototype.hasOwnProperty.call(result, 0)) {
                    message.channel.send('<:comandoscustom:858671400424046602>' + result[0].returns)
                  }
                })
              }
            })
          };
        }
      }

      if (result[0].aspam_activado !== 0) {
        noMoreInvites(message)
      }
      // Leveling
      if (!contenido.startsWith(result[0].guild_prefix)) {
        if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
          if (result[0].leveling_enabled !== '0') {
            talkedRecently.add(`${message.author.id}_${message.guild.id}`)
            setTimeout(() => {
              talkedRecently.delete(`${message.author.id}_${message.guild.id}`)
            }, 60000)
            levelingRankUp(result, client, con, message, global)
          }
        }
      }

      // Respuestas personalizadas
      con.query('SELECT * FROM `guild_responses` WHERE `guild` = ?', [message.guild.id], (err, result) => {
        if (err) console.log(err)
        if (result) {
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const buscarrespuesta = 'SELECT * FROM `guild_responses` WHERE `guild` = \'' + message.guild.id + '\' AND `action` = \'' + contenido + '\''
            con.query(buscarrespuesta, (err, result) => {
              if (err) console.log(err)
              if (result) {
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  message.channel.send('<:respuestacustom:858671300024074240> ' + result[0].returns)
                }
              }
            })
          }
        }
      })
    } else {
      guildcreate(con, message.guild)
    }
  }
  )
})
