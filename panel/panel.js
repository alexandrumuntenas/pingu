require('dotenv').config()
const { Client } = require('discord.js')

const client = new Client()
client.login('ODI3MTk5NTM5MTg1OTc1NDE3.YGXjmg.GqMdOfnGC6HVLu4Ql-kdBoAtcFU')

const express = require('express')

const mysql = require('mysql2')
const passport = require('passport')
const PassportLocal = require('passport-local').Strategy

const cookieParser = require('cookie-parser')
const session = require('express-session')

const makeId = require('../gen/makeId')
const emojiStrip = require('emoji-strip')

const pool = mysql.createPool({
  host: '104.128.239.45',
  user: 'u43502_Ipea7UopvX',
  password: 'T0^Y9yXARCuAa1.LfAzmWRRt',
  database: 's43502_pingu',
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
  /* app.use(helmet())
    app.disable('x-powered-by'); */
  app.use(cookieParser(makeId(256)))
  app.use(session({
    secret: makeId(1024),
    resave: true,
    saveUninitialized: true,
    name: makeId(256)
    /* cookie: {
            secure: true,
            httpOnly: true,
            domain: 'pingu.duoestudios.com',
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000)
        } */
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
        guild.channels.cache.filter(c => c.type === 'text').map(c => channels.add({ channel_name: c.name, channel_id: c.id }))
        res.render('dashboard/main', { i18n: i18n, guild: guild, bbdd: result[0], channels: channels, roles: roles, savedRoles: savedRoles, client: client.user })
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

app.post('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.status(403); res.send('Forbidden') }, (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'frmname')) {
    switch (req.body.frmname) {
      case 'system':
        if (Object.prototype.hasOwnProperty.call(req.body, 'EEScEqQw')) {
          pool.query('UPDATE `guildData` SET `guild_prefix` = ? WHERE `guild` = ?', [req.body.EEScEqQw, req.user.Guild_ID])
        }
        break
      case 'welcome':
        if (Object.prototype.hasOwnProperty.call(req.body, 'LNV5Ljl')) {
          pool.query("UPDATE `guildData` SET `welcome_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `welcome_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'AZGW50Tc4p')) {
          pool.query('UPDATE `guildData` SET `welcome_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.AZGW50Tc4p), req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'daLuxtTuG5')) {
          pool.query('UPDATE `guildData` SET `welcome_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.daLuxtTuG5), req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'vyKS7bC')) {
          pool.query("UPDATE `guildData` SET `welcome_image` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `welcome_image` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'nviCCd9jDc')) {
          const roles = new Set()
          if (Array.isArray(req.body.nviCCd9jDc)) {
            req.body.nviCCd9jDc.forEach(r => roles.add(r))
          } else {
            roles.add(req.body.nviCCd9jDc)
          }
          pool.query('UPDATE `guildData` SET `welcome_roles` = ? WHERE `guildData`.`guild` = ?', ['' + Array.from(roles) + '', req.user.Guild_ID])
        }
        break
      case 'farewell':
        if (Object.prototype.hasOwnProperty.call(req.body, 'noLp3EI')) {
          pool.query("UPDATE `guildData` SET `farewell_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `farewell_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'pfeZmgU')) {
          pool.query('UPDATE `guildData` SET `farewell_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.pfeZmgU), req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'tKDIdy1')) {
          pool.query('UPDATE `guildData` SET `farewell_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.tKDIdy1), req.user.Guild_ID])
        }
        break
      case 'moderation':
        if (Object.prototype.hasOwnProperty.call(req.body, 'Y2adeog')) {
          pool.query("UPDATE `guildData` SET `moderator_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `moderator_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'OxV1juz')) {
          pool.query("UPDATE `guildData` SET `moderador_warn_expulsion_activado` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `moderador_warn_expulsion_activado` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'DHLJ2YI')) {
          pool.query('UPDATE `guildData` SET `moderador_warn_expulsion_cantidad` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.DHLJ2YI), req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'AkeMlvn')) {
          pool.query('UPDATE `guildData` SET `moderador_warn_expulsion_accion` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.AkeMlvn), req.user.Guild_ID])
        }
        break
      case 'leveling':
        if (Object.prototype.hasOwnProperty.call(req.body, 'QTMVmdD')) {
          pool.query("UPDATE `guildData` SET `leveling_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        } else {
          pool.query("UPDATE `guildData` SET `leveling_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'Q8xq8vO')) {
          pool.query('UPDATE `guildData` SET `leveling_rankup_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.Q8xq8vO), req.user.Guild_ID])
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'ELMb9ge')) {
          pool.query('UPDATE `guildData` SET `leveling_rankup_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.ELMb9ge), req.user.Guild_ID])
        }
        break
      default:
        res.status(406)
        res.send('You modified something important for the server.')
        break
    }
  } else {
    res.status(406)
    res.send('You modified something important for the server.')
  }
  res.status(200)
  res.send('Good to Go :)')
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
