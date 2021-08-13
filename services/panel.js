require('dotenv').config();
const { Client } = require('discord.js');

const client = new Client();
client.login(process.env.PUBLIC_TOKEN);

const express = require('express');
const fs = require('fs');

//const helmet = require('helmet');
//const https = require("https");


const mysql = require('mysql2');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;

const cookieParser = require('cookie-parser');
const session = require('express-session');

const makeId = require('../gen/makeId');
const emojiStrip = require('emoji-strip');

var con = mysql.createConnection({
    host: "104.128.239.45",
    user: "u43502_Ipea7UopvX",
    password: "T0^Y9yXARCuAa1.LfAzmWRRt",
    database: "s43502_pingu",
    charset: "utf8_unicode_ci",
});

client.on('ready', () => {
    console.log('[OK] Bot inicializado...');
    console.log(`[IF] Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'cpanel',
            type: 'WATCHING',
        }
    })
    setInterval(() => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: 'cpanel',
                type: 'WATCHING',
            }
        })
    }, 3600000);
})

con.connect(function (err) {
    console.log('[··] Conectando a MariaDB');
    if (err) {
        log.warn(err)
    } else {
        console.log('[OK] Conexión establecida con MariaDB');
    }
});

con.config.namedPlaceholders = true;
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
if (process.env.ENTORNO !== "desarrollo") {
    /*app.use(helmet())
    app.disable('x-powered-by');*/
    app.use(cookieParser(makeId(256)))
    app.use(session({
        secret: makeId(1024),
        resave: true,
        saveUninitialized: true,
        name: makeId(256),
        /*cookie: {
            secure: true,
            httpOnly: true,
            domain: 'pingu.duoestudios.com',
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000)
        }*/
    }))
} else {
    app.use(cookieParser('b'))
    app.use(session({
        secret: makeId('b'),
        resave: true,
        saveUninitialized: true
    }))
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal({
    usernameField: 'uj49kfl',
    passwordField: 'bPX9orL'
}, function (uj49kfl, bPX9orL, done) {
    con.query("SELECT * FROM `apolo_sessions` WHERE Clave_de_Acceso = ? LIMIT 1", [uj49kfl], function (err, result, rows) {
        if (result.hasOwnProperty(0)) {
            if (bPX9orL == result[0].Clave_de_Autorizacion) {
                return done(null, result[0]);
            } else {
                con.query("DELETE FROM `apolo_sessions` WHERE Clave_de_Acceso = ?", [uj49kfl]);
                return done(2, null);
                res.render('login', { err: true, twoFa: true, noGuild: false });
            }
        } else {
            return done(1, null)
        };
    })
}));

passport.serializeUser(function (guild_data, done) {
    done(null, guild_data);
});

passport.deserializeUser(function (guild_data, done) {
    return done(null, guild_data);
});

app.set('view engine', 'ejs');

app.use('*/dist', express.static('./services/web'));
app.use('*/plugins', express.static('./services/web/plugins'));

//Rutas
app.get('/', (req, res) => { res.redirect('/dashboard') });

app.get('/login', (req, res) => {
    res.render('login', { err: false });
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            if (err === 1) {
                return res.render('login', { err: true, twoFa: false, noGuild: false });
            } else {
                return res.render('login', { err: true, twoFa: true, noGuild: false });
            }
        }
        if (!user) {
            return res.render('login', { err: true, twoFa: false, noGuild: false });
        }
        req.logIn(user, function (err) {
            if (err) { console.log(err); return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next)
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    req.logout();
    res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
    con.query("DELETE FROM `apolo_sessions` WHERE `Guild_ID` LIKE ?", [req.user.Guild_ID]);
    req.logout();
    res.redirect('/');
});

app.get('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/login') }, (req, res) => {
    var guild = client.guilds.cache.find(guild => guild.id == req.user.Guild_ID);
    var channels = new Set();
    var roles = new Set();
    if (guild) {
        con.query(`SELECT * FROM \`guild_data\` WHERE guild LIKE '${guild.id}'`, function (err, result, rows) {
            if (result.hasOwnProperty(0)) {
                var lan = require(`../languages/${result[0].idioma}.json`);
                lan = lan.web;
                guild.roles.cache.filter(r => r.managed === false && r.id !== guild.id).map(r => roles.add({ "role_name": r.name, "role_id": r.id, "role_editable": r.editable }));
                guild.channels.cache.filter(c => c.type === 'text').map(c => channels.add({ "channel_name": c.name, "channel_id": c.id }));
                res.render('panel', { lan: lan, guild: guild, bbdd: result[0], channels: channels, roles: roles, client: client.user.avatarURL({ format: 'jpg' }) });
            } else {
                con.query("DELETE FROM `apolo_sessions` WHERE `Guild_ID` LIKE ?", [req.user.Guild_ID]);
                req.logout();
                res.redirect('/');
            }
        });
    } else {
        req.logout();
        res.redirect('/');
    }
});

app.post('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.status(403); res.send('Forbidden') }, (req, res) => {
    if (req.body.hasOwnProperty('EEScEqQw')) {
        con.query("UPDATE `guild_data` SET `prefix` = ? WHERE `guild` = ?", [req.body.EEScEqQw, req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('LNV5Ljl')) {
        con.query("UPDATE `guild_data` SET `bienvenida_mensaje_activado` = '1' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    } else {
        con.query("UPDATE `guild_data` SET `bienvenida_mensaje_activado` = '0' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('AZGW50Tc4p')) {
        con.query("UPDATE `guild_data` SET `bienvenida_mensaje` = ? WHERE `guild_data`.`guild` = ?", [emojiStrip(req.body.AZGW50Tc4p), req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('daLuxtTuG5')) {
        con.query("UPDATE `guild_data` SET `bienvenida_canal_id` = ? WHERE `guild_data`.`guild` = ?", [emojiStrip(req.body.daLuxtTuG5), req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('vyKS7bC')) {
        con.query("UPDATE `guild_data` SET `bienvenida_cartel` = '1' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    } else {
        con.query("UPDATE `guild_data` SET `bienvenida_cartel` = '0' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('nviCCd9jDc')) {
        var roles = new Set();
        if (Array.isArray(req.body.nviCCd9jDc)) {
            req.body.nviCCd9jDc.forEach(r => roles.add(r))
        } else {
            roles.add(req.body.nviCCd9jDc);
        }
        con.query("UPDATE `guild_data` SET `bienvenida_roles_user` = ? WHERE `guild_data`.`guild` = ?", ['' + Array.from(roles) + '', req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('noLp3EI')) {
        con.query("UPDATE `guild_data` SET `salida_mensaje_activado` = '1' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    } else {
        con.query("UPDATE `guild_data` SET `salida_mensaje_activado` = '0' WHERE `guild_data`.`guild` = ?", [req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('pfeZmgU')) {
        con.query("UPDATE `guild_data` SET `salida_mensaje` = ? WHERE `guild_data`.`guild` = ?", [emojiStrip(req.body.pfeZmgU), req.user.Guild_ID]);
    }
    if (req.body.hasOwnProperty('tKDIdy1')) {
        con.query("UPDATE `guild_data` SET `salida_canal` = ? WHERE `guild_data`.`guild` = ?", [emojiStrip(req.body.tKDIdy1), req.user.Guild_ID]);
    }
    res.status(200);
    res.send('Good to Go :)')
});

app.get('/status', (req, res) => {
    res.send('Pingu is online!');
});

//Middleware errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something didn\'t work :(');
});

app.listen(8080, () => {
    console.log(`[OK] Running web-server`);
})