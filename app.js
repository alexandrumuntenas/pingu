/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 22T1               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const Sentry = require('@sentry/node')
const mysql = require('mysql2')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING] })

client.log = require('./functions/customLogger')

client.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8mb4_unicode_ci',
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
const interactionCreate = require('./events/interactionCreate')
client.log.success('Eventos Cargados')

client.log.info('Cargando Módulos')
client.log.success('Módulos Cargados')

client.log.info('Cargando Servicios Third-Party')
const commands = require('./functions/commands')
const ready = require('./events/ready')
const thirdparty = require('./modules/thirdparty')
client.log.success('Servicios Third-Party Cargados')

thirdparty(client)

// Bot
if (process.env.ENTORNO === 'public') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production'
  })
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

client.logError = (err) => {
  client.Sentry.captureException(err)
  client.log.error(err)
}

client.commands = commands.loadCommands(client)
client.interactions = commands.loadInteractions(client)

client.on('ready', () => {
  ready(client).catch(err => {
    client.log.fatal(err)
  })
})

client.on('guildCreate', (guild) => {
  guildCreate(client, guild).catch(err => {
    client.log.fatal(err)
    client.Sentry.captureException(err)
  })
})

client.on('guildDelete', (guild) => {
  guildDelete(client, guild).catch(err => {
    client.log.fatal(err)
    client.Sentry.captureException(err)
  })
})

client.on('guildMemberAdd', (member) => {
  guildMemberAdd(client, member).catch(err => {
    client.log.fatal(err)
    client.Sentry.captureException(err)
  })
})

client.on('guildMemberRemove', (member) => {
  guildMemberRemove(client, member).catch(err => {
    client.log.fatal(err)
    client.Sentry.captureException(err)
  })
})

client.on('messageCreate', (message) => {
  messageCreate(client, message).catch(err => {
    client.log.fatal(err)
    client.Sentry.captureException(err)
  })
})

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    interactionCreate.isCommand(client, interaction).catch(err => {
      client.log.fatal(err)
      client.Sentry.captureException(err)
    })
  }
})
