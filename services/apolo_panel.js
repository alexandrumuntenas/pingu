module.exports = function (pwd, client) {
    const express = require('express');

    const mysql = require('mysql2');
    const passport = require('passport');
    const passportLocal = require('passport-local').Strategy;

    const cookieParser = require('cookie-parser');
    const session = require('express-session');

    const makeId = require('../gen/makeId');

    var con = mysql.createConnection({
        host: "104.128.239.45",
        user: "u43502_Ipea7UopvX",
        password: "T0^Y9yXARCuAa1.LfAzmWRRt",
        database: "s43502_pingu",
        charset: "utf8_unicode_ci",
    });

    con.config.namedPlaceholders = true;
    const app = express()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.text());

    app.use(cookieParser(makeId(256)))
    app.use(session({
        secret: makeId(256),
        resave: true,
        saveUninitialized: true
    }))

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
                    return done('La clave de acceso es válida, pero la clave de autorización no. Por motivos de seguridad, la clave de acceso ha sido invalidado.Puede volver a solicitar una nueva clave de acceso.', null);
                    //res.render('login', { err: true, twoFa: true, noGuild: false });
                }
            } else {
                return done('Clave de acceso inválida.', null)
                //res.render('login', { err: true, twoFa: false, noGuild: false });
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

    app.post('/login', passport.authenticate('local'), (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/dashboard', (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/login') }, (req, res) => {
        var guild = client.guilds.cache.find(guild => guild.id == req.user.Guild_ID);
        var channels = new Set();
        var roles = new Set();
        con.query(`SELECT * FROM \`guild_data\` WHERE guild LIKE '${guild.id}'`, function (err, result, rows) {
            if (result.hasOwnProperty(0)) {
                var lan = require(`../languages/${result[0].idioma}.json`);
                lan = lan.web;
                guild.roles.cache.filter(r => r.managed === false && r.id !== guild.id).map(r => roles.add({ "role_name": r.name, "role_id": r.id, "role_editable": r.editable }));
                guild.channels.cache.filter(c => c.type === 'text').map(c => channels.add({ "channel_name": c.name, "channel_id": c.id }));
                res.render('panel', { lan: lan, guild: guild, bbdd: result[0], channels: channels, roles: roles, client: client.user.avatarURL({ format: 'jpg' }) });
            }
        });
    });

    app.get('/status', (req, res) => {
        res.send('Pingu is online!');
    });

    app.listen(pwd, () => {
        console.log(`[OK] Running web-server`);
    })
}