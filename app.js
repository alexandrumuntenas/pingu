/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 2109               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const Sentry = require('@sentry/node')
const mysql = require('mysql2')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING] })

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
const messageCreate = require('./events/messageCreate')
client.log.success('Eventos Cargados')

client.log.info('Cargando Módulos')
const checkFolder = require('./modules/checkFolders')
client.log.success('Módulos Cargados')

client.log.info('Cargando Servicios Third-Party')
const topggSDK = require('./modules/third-party/topggSDK')
const commandHandler = require('./modules/commandHandler')
client.log.success('Servicios Third-Party Cargados')

// Bot
if (process.env.ENTORNO === 'public') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production'
  })
  topggSDK(client)
  client.login(process.env.PUBLIC_TOKEN)
} else {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'development'
  })
  client.login(process.env.INSIDER_TOKEN)
}

client.Sentry = Sentry

client.commands = commandHandler.loadCommands(client)

client.on('ready', () => {
  checkFolder()
  client.log.info(`Conectado como ${client.user.tag}!`)
  client.user.setPresence({
    status: 'idle'
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'idle'
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

client.on('messageCreate', (message) => {
  messageCreate(client, message)
})
