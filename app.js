/* * * * * * * * * * * * * * * *
 * Pingu                       *
 * Versión: 22T2               *
 * * * * * * * * * * * * * * * */
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const Sentry = require('@sentry/node')
const mysql = require('mysql2')
const fs = require('fs')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING], partials: ['REACTION', 'MESSAGE', 'USER'] })

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

client.log.info('Cargando Servicios Third-Party')
const commands = require('./functions/commands')
const thirdparty = require('./modules/thirdparty')
client.log.success('Servicios Third-Party Cargados')

if (process.env.ENTORNO === 'public') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production'
  })
  thirdparty(client)
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

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
  const event = require(`./events/${file}`)
  client.log.success(`Evento ${file} cargado`)
  client.on(event.name, (...args) => event.execute(client, ...args))
}
