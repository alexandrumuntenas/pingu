
require('dotenv').config()

const express = require('express')
const consolex = require('../functions/consolex')

const { GatewayIntentBits } = require('discord-api-types/v10')
const discordjs = require('discord.js')

const app = express()
const port = process.env.WEBEDITOR_PORT

const Database = require('mysql2').createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})

Database.config.namedPlaceholders = true

const discordjsClient = new discordjs.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping], partials: ['REACTION', 'MESSAGE', 'USER'], ws: { properties: { $browser: 'Discord iOS' } } })

if (process.env.ENTORNO === 'publico') {
  discordjsClient.login(process.env.PUBLIC_TOKEN)
} else {
  discordjsClient.login(process.env.INSIDER_TOKEN)
}

app.set('view engine', 'ejs')

app.get('/editor/:sedit', (req, res) => {
  Database.query('SELECT * FROM webeditorSessions WHERE sedit = ? LIMIT 1', [req.params.sedit], (editorSessionsLookupError, sessions) => {
    if (editorSessionsLookupError) consolex.gestionarError(editorSessionsLookupError)
    if (sessions && Object.prototype.hasOwnProperty.call(sessions, 0)) {
      obtenerConfiguracionDelServidor({ id: sessions[0].guild }, config => {
        if (config) return res.render('editor', { session: sessions[0], config, guild: discordjsClient.guilds.resolve(sessions[0].guild) })
        else return res.render('editor', { session: sessions[0], guild: null })
      })
    } else {
      res.render('editor', { session: null, guild: null })
    }
  })
})

const randomstring = require('randomstring')
const { obtenerConfiguracionDelServidor } = require('../functions/guildManager')

app.post('/editor/:sedit', (req, res) => {
  Database.query('SELECT * FROM webeditorSessions WHERE sedit = ?', [req.params.sedit], (editorSessionsLookupError, sessions) => {
    if (editorSessionsLookupError) consolex.gestionarError(editorSessionsLookupError)
    if (sessions && Object.prototype.hasOwnProperty.call(sessions, 0)) {
      const codigoactivacion = randomstring.generate({ length: 12, charset: 'alphabetic' })
      Database.query('INSERT INTO webeditorChanges (codigoactivacion, guild, newconfiguration) VALUES (?, ?, ?)', [codigoactivacion, sessions[0].guild, JSON.stringify(req.body)], (editorChangesInsertError, rows) => {
        if (editorChangesInsertError) consolex.gestionarError(editorChangesInsertError)
        res.status(200).send({ codigoactivacion })
      })
    } else {
      res.status(500).send('error')
    }
  })
})

app.listen(port, () => {
  console.log(`Pingu's Web Editor is listening on port ${port}`)
})
