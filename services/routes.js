const mysql = require('mysql2');

var con = mysql.createConnection({
    host: "104.128.239.45",
    user: "u43502_Ipea7UopvX",
    password: "T0^Y9yXARCuAa1.LfAzmWRRt",
    database: "s43502_pingu",
    charset: "utf8_unicode_ci",
});

module.exports = function (app, client) {

    app.get('/', function (req, res) {
        res.render('login', { err: false });
    })

    app.post('/', function (req, res) {
        var lan = require(`../languages/es.json`);
        lan = lan.web;
        con.query("SELECT * FROM sessions_apolo WHERE Clave_de_Acceso = '" + req.body.uj49kfl + "' LIMIT 1", function (err, result, rows) {
            if (result.hasOwnProperty(0)) {
                var guild = client.guilds.cache.find(guild => guild.id == result[0].Guild_ID);
                con.query(`SELECT * FROM \`guild_data\` WHERE guild LIKE '${guild.id}'`, function (err, result, rows) {
                    if (result.hasOwnProperty(0)) {
                        res.render('panel', { lan: lan, guild: guild, bbdd: result[0] });
                    } else {
                        res.render('login', { err: true });
                    }
                });
            } else {
                res.render('login', { err: true });
            };
        })
    })

    app.get('/status', function (req, res) {
        res.send('Pingu is online!');
    });

}