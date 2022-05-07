
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
  Database.query('SELECT * FROM webeditor_sessions WHERE sedit = ?', [req.params.sedit], (err, rows) => {
    if (err) consolex.gestionarError(err)
    if (rows.length > 0) {
      Database.query('SELECT * FROM guildData WHERE guild = ?', [rows[0].guild], (err, rows) => {
        if (err) consolex.gestionarError(err)
        if (rows.length > 0) {
          res.render('editor', {
            guild: rows[0].guild,
            sedit: req.params.sedit,
            config: rows[0]
          })
        } else {
          res.render('editor', {
            guild: '',
            sedit: req.params.sedit,
            config: {}
          })
        }
      })
    } else {
      res.render('editor', {
        guild: '',
        sedit: req.params.sedit,
        config: {}
      })
    }
  })
})

app.post('/editor/:sedit', (req, res) => {
  Database.query('SELECT * FROM webeditor_sessions WHERE sedit = ?', [req.params.sedit], (err, rows) => {
    if (err) consolex.gestionarError(err)
    if (rows.length > 0) {
      Database.query('INSERT INTO webeditor_changes (sedit, guild, newconfiguration) VALUES (?, ?, ?)', [req.params.sedit, rows[0].guild, JSON.stringify(req.body)], (err, rows) => {
        if (err) consolex.gestionarError(err)
        res.status(200).send('ok')
      })
    } else {
      res.status(500).send('error')
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
