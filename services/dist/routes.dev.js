"use strict";

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "104.128.239.45",
  user: "u43502_Ipea7UopvX",
  password: "T0^Y9yXARCuAa1.LfAzmWRRt",
  database: "s43502_pingu",
  charset: "utf8_unicode_ci"
});

module.exports = function (app, client) {
  app.get('/', function (req, res) {
    res.render('login', {
      err: false
    });
  });
  app.post('/', function (req, res) {
    var lan = require("../languages/es.json");

    lan = lan.web;
    con.query("SELECT * FROM sessions_apolo WHERE Clave_de_Acceso = '" + req.body.uj49kfl + "' LIMIT 1", function (err, result, rows) {
      if (result.hasOwnProperty(0)) {
        if (req.body.bPX9orL == result[0].Clave_de_Autorizacion) {
          var guild = client.guilds.cache.find(function (guild) {
            return guild.id == result[0].Guild_ID;
          });
          var channels = new Set();
          var roles = new Set();
          con.query("SELECT * FROM `guild_data` WHERE guild LIKE '".concat(guild.id, "'"), function (err, result, rows) {
            if (result.hasOwnProperty(0)) {
              guild.roles.cache.filter(function (r) {
                return r.managed === false && r.id !== guild.id;
              }).map(function (r) {
                return roles.add({
                  "role_name": r.name,
                  "role_id": r.id,
                  "role_editable": r.editable
                });
              });
              guild.channels.cache.filter(function (c) {
                return c.type === 'text';
              }).map(function (c) {
                return channels.add({
                  "channel_name": c.name,
                  "channel_id": c.id
                });
              });
              res.render('panel', {
                lan: lan,
                guild: guild,
                bbdd: result[0],
                channels: channels,
                roles: roles,
                client: client.user.avatarURL({
                  format: 'jpg'
                })
              });
            } else {
              res.render('login', {
                err: true,
                twoFa: false,
                noGuild: true
              });
            }
          });
        } else {
          con.query("DELETE FROM `sessions_apolo` WHERE Clave_de_Acceso = '" + req.body.uj49kfl + "'");
          res.render('login', {
            err: true,
            twoFa: true,
            noGuild: false
          });
        }
      } else {
        res.render('login', {
          err: true,
          twoFa: false,
          noGuild: false
        });
      }

      ;
    });
  });
  app.get('/status', function (req, res) {
    res.send('Pingu is online!');
  });
};