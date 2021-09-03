require('dotenv').config()
const { Client, Intents } = require('discord.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES] })
client.login(process.env.PUBLIC_TOKEN)

const express = require('express')
const helmet = require('helmet')

const mysql = require('mysql2')
const passport = require('passport')
const PassportLocal = require('passport-local').Strategy

const cookieParser = require('cookie-parser')
const session = require('express-session')

const makeId = require('../modules/makeId')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  charset: 'utf8_unicode_ci',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0
})

client.on('ready', () => {
  console.log('[OK] Bot inicializado...')
  console.log(`[IF] Logged in as ${client.user.tag}!`)
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'cpanel',
      type: 'WATCHING'
    }
  })
  setInterval(() => {
    client.user.setPresence({
      status: 'idle',
      activity: {
        name: 'Control Panel',
        type: 'WATCHING'
      }
    })
  }, 3600000)
})

pool.config.namedPlaceholders = true
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())
if (process.env.ENTORNO !== 'desarrollo') {
  app.use(helmet())
  app.disable('x-powered-by')
  app.use(cookieParser(makeId(256)))
  app.use(session({
    secret: makeId(1024),
    resave: true,
    saveUninitialized: true,
    name: makeId(256),
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'pingu.duoestudios.com',
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 1000)
    }
  }))
} else {
  app.use(cookieParser('b'))
  app.use(session({
    secret: makeId('b'),
    resave: true,
    saveUninitialized: true
  }))
}

app.use(passport.initialize())
app.use(passport.session())

passport.use(new PassportLocal({
  usernameField: 'uj49kfl',
  passwordField: 'bPX9orL'
}, function (uj49kfl, bPX9orL, done) {
  pool.query('SELECT * FROM `apoloSessions` WHERE Clave_de_Acceso = ? LIMIT 1', [uj49kfl], function (err, result, rows) {
    if (err) console.log(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      if (bPX9orL === result[0].Clave_de_Autorizacion) {
        return done(null, result[0])
      } else {
        pool.query('DELETE FROM `apoloSessions` WHERE Clave_de_Acceso = ?', [uj49kfl])
        return done(2, null)
      }
    } else {
      return done(1, null)
    };
  })
}))

passport.serializeUser(function (guildData, done) {
  done(null, guildData)
})

passport.deserializeUser(function (guildData, done) {
  return done(null, guildData)
})

app.set('view engine', 'ejs')

// Rutas
app.get('/', (req, res) => { res.redirect('/dashboard') })

app.get('/login', (req, res) => {
  res.render('login', { err: false, claveiande: req.query.iande || '', claveauth: req.query.auth || '' })
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      if (err === 1) {
        return res.render('login', { err: true, twoFa: false, noGuild: false, claveiande: '', claveauth: '' })
      } else {
        return res.render('login', { err: true, twoFa: true, noGuild: false, claveiande: '', claveauth: '' })
      }
    }
    if (!user) {
      return res.render('login', { err: true, twoFa: false, noGuild: false, claveiande: '', claveauth: '' })
    }
    req.logIn(user, function (err) {
      if (err) { console.log(err); return next(err) }
      return res.redirect('/dashboard')
    })
  })(req, res, next)
})

app.post('/logout', (req, res) => {
  pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [req.user.Guild_ID])
  req.logout()
  res.redirect('/')
})

app.get('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/login') }, (req, res) => {
  const guild = client.guilds.cache.find(guild => guild.id === req.user.Guild_ID)
  const channels = new Set()
  const roles = new Set()
  const savedRoles = new Set()
  if (guild) {
    pool.query('SELECT * FROM `guildData` WHERE guild LIKE ?', [guild.id], function (err, result, rows) {
      if (err) console.log(err)
      if (result.length !== 0) {
        result[0].welcome_roles.split(',').forEach(element => {
          savedRoles.add(element)
        })
        const i18n = require(`./i18n/${result[0].guild_language}.json`)
        guild.roles.cache.filter(r => r.managed === false && r.id !== guild.id).map(r => roles.add({ role_name: r.name, role_id: r.id, role_editable: r.editable }))
        guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').map(c => channels.add({ channel_name: c.name, channel_id: c.id }))
        res.render('dashboard/overview', { i18n: i18n, guild: guild, bbdd: result[0], channels: channels, roles: roles, savedRoles: savedRoles, client: client.user })
      } else {
        pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [req.user.Guild_ID])
        req.session.destroy()
        req.logout()
        res.redirect('/')
      }
    })
  } else {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
})

app.get('/dashboard/moderation', (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/login') }, (req, res) => {
  const guild = client.guilds.cache.find(guild => guild.id === req.user.Guild_ID)
  if (guild) {
    pool.query('SELECT * FROM `guildData` WHERE guild LIKE ?', [guild.id], function (err, result, rows) {
      if (err) console.log(err)
      if (result.length !== 0) {
        const i18n = require(`./i18n/${result[0].guild_language}.json`)
        res.render('dashboard/modules/moderation', { i18n: i18n, guild: guild, bbdd: result[0], client: client.user })
      } else {
        pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [req.user.Guild_ID])
        req.session.destroy()
        req.logout()
        res.redirect('/')
      }
    })
  } else {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
})

app.get('/dashboard/custom/commands', (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/login') }, (req, res) => {
  const guild = client.guilds.cache.find(guild => guild.id === req.user.Guild_ID)
  if (guild) {
    pool.query('SELECT * FROM `guildData` WHERE guild LIKE ?', [guild.id], (err, result, rows) => {
      if (err) console.log(err)
      if (result.length !== 0) {
        let i18n = require(`../languages/${result[0].guild_language}.json`)
        i18n = i18n.web
        pool.query('SELECT * FROM `guildCustomCommands` WHERE guild LIKE ?', [guild.id], (err, rows) => {
          if (err) console.log(err)
          res.render('dashboard/custom/commands', { i18n: i18n, guild: guild, bbdd: result[0], commands: rows, client: client.user })
        })
      } else {
        pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [req.user.Guild_ID])
        req.session.destroy()
        req.logout()
        res.redirect('/')
      }
    })
  } else {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
})

const MainSaveController = require('./controllers/MainSaveController')

app.post('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.status(403); res.send('Forbidden') }, (req, res) => {
  MainSaveController(req, res, pool)
})

app.get('/status', (req, res) => {
  res.send('Pingu is online!')
})

// Middleware errores
app.use((err, req, res, next) => {
  console.error(err)
  if (err.code !== 'ERR_HTTP_HEADERS_SENT') {
    req.session.destroy()
  }
  res.status(500).send('Something didn\'t work :(')
})

app.listen(8080, () => {
  console.log('[OK] Running web-server')
})
