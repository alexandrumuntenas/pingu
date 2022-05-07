
const express = require('express')
const consolex = require('../functions/consolex')
const app = express()
const port = 80

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

app.set('view engine', 'ejs')

app.get('/editor/:sedit', (req, res) => {
  Database.query('SELECT * FROM webeditorSessions WHERE sedit = ? LIMIT 1', [req.params.sedit], (editorSessionsLookupError, sessions) => {
    if (editorSessionsLookupError) consolex.gestionarError(editorSessionsLookupError)
    if (sessions && Object.prototype.hasOwnProperty.call(sessions, 0)) {
      Database.query('SELECT * FROM guildData WHERE guild = ? LIMIT 1', [sessions[0].guild], (guildDatalookupError, guilds) => {
        if (guildDatalookupError) consolex.gestionarError(guildDatalookupError)
        if (guilds && Object.prototype.hasOwnProperty.call(guilds, 0)) {
          res.render('editor', { session: sessions[0], guild: guilds[0] })
        } else {
          res.render('editor', { session: sessions[0], guild: null })
        }
      })
    } else {
      res.render('editor', { session: null, guild: null })
    }
  })
})

const randomstring = require('randomstring')

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
