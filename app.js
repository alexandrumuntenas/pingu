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

client.console = require('./modules/console')

client.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})

client.pool.config.namedPlaceholders = true

client.console.info('Cargando Servicios Third-Party')
const commands = require('./functions/commands')
const thirdparty = require('./modules/thirdparty')
client.console.success('Servicios Third-Party Cargados')

if (process.env.ENTORNO === 'public') {
  client.console.warn('Iniciando sesión como el bot público.')
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'production'
  })
  thirdparty(client)
  client.login(process.env.PUBLIC_TOKEN)
} else {
  client.console.warn('Iniciando sesión como el bot de desarrollo.')
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'development'
  })
  client.login(process.env.INSIDER_TOKEN)
}

client.console.sentry = Sentry

client.logError = (err) => {
  client.console.sentry.captureException(err)
  client.console.error(err)
}

client.commands = commands.loadCommands(client)

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
  const event = require(`./events/${file}`)
  client.console.success(`Evento ${file} cargado`)
  client.on(event.name, (...args) => event.execute(client, ...args))
}
