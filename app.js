/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2108               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const makeId = require('./gen/makeId')
const { Client, Collection } = require('discord.js')
const mysql = require('mysql2')
const fs = require('fs')
const express = require('express')
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
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const guildMemberAdd = require('./events/guildMemberAdd')
const guildMemberRemove = require('./events/guildMemberRemove')
const checkFolder = require('./events/checkFolders')
console.log('[OK] Eventos Cargados')

console.log('[··] Cargando Módulos')
const levelingRankUp = require('./modules/levelingRankUp')
const noMoreInvites = require('./modules/noMoreInvites')
console.log('[OK] Módulos Cargados')

console.log('[··] Cargando Servicios Third-Party')
const topggSDK = require('./modules/third-party/topggSDK')
console.log('[OK] Servicios Third-Party Cargados')

// Bot
if (process.env.ENTORNO !== 'desarrollo') {
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

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8_unicode_ci',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0
})

con.config.namedPlaceholders = true

client.on('ready', () => {
  checkFolder()
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
  guildCreate(con, guild)
})

client.on('guildDelete', (guild) => {
  guildDelete(con, guild)
})

client.on('guildMemberAdd', (member) => {
  guildMemberAdd(client, con, member)
})

client.on('guildMemberRemove', (member) => {
  guildMemberRemove(client, con, member)
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
      const command = args[0]
      args.shift()
      const contenido = message.content.toLowerCase()
      if (message.content.startsWith(result[0].guild_prefix)) {
        if (args) {
          if (client.commands.has(command)) {
            try {
              client.commands.get(command).execute(args, client, con, contenido, message, result)
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
          if (result[0].leveling_enabled !== 0) {
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
      guildCreate(con, message.guild)
    }
  }
  )
})
