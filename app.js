//https://discord.com/api/oauth2/authorize?client_id=827199539185975417&permissions=8&scope=bot%20applications.commands
const { Client, Collection } = require('discord.js');
const mysql = require('mysql2');
const fs = require('fs');
const winston = require('winston');
const Sentry = require("winston-transport-sentry-node").default;

console.log('-- Redirección de consola a --');

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const log = require('simple-node-logger').createRollingFileLogger({
    logDirectory: `./log`,
    fileNamePattern: `<date>_${makeId(5)}.log`,
    dateFormat: 'YYYY.MM.DD',
});

// Redireccionar console.log a @package/simple-node-logger
console.log = function (d) { //
    log.info(d);
};

process.on('uncaughtException', function (err) {
    log.warn((err && err.stack) ? err.stack : err);
});

const logger = winston.createLogger({
    level: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 },
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
});
logger.add(new Sentry({
    sentry: {
        dsn: 'https://428ebb1b4ccc4d4d81806506a6064bdb@o923346.ingest.sentry.io/5870573',
    },
    level: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
}));
const talkedRecently = new Set();
const client = new Client();

// Servicios de TOP.GG
/*const { AutoPoster } = require('topgg-autoposter')
const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyNzE5OTUzOTE4NTk3NTQxNyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI2OTc2NzkzfQ.hXeX11LMvSjuyn2YIm7r8zBE-HL0OaaTkL-DkItzlKs', client)
log.info('[··] Publicando Estadísticas a Top.GG')
ap.on('posted', () => {
    log.info('[OK] Estadísticas publicadas en Top.GG')
})*/

//Services Workers
const guildcreate = require('./services/guildcreate');
const guilddelete = require('./services/guilddelete');
const guildmemberadd = require('./services/guildmemberadd');
const guildmemberremove = require('./services/guildmemberremove');
const leveling = require('./services/leveling');
const antispamworker = require('./services/antispam');
log.info('[OK] Services Workers Cargados');

// Funciones globales
async function comprobarcarpetas() {
    log.info('[··] Comprobando carpetas');
    if (!fs.existsSync('./usuarios')) {
        fs.mkdirSync('./usuarios/');
        log.info('[··] Carpeta usuarios no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
        log.info('[··] Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
        log.info('[··] Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
        log.info('[··] Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/bievenidas');
        log.info('[··] Carpeta bienvenidas no existe >> creando...');
    }
    if (!fs.existsSync('./usuarios/moderacion')) {
        log.info('[··] Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
    }
    if (!fs.existsSync('./usuarios/avatares')) {
        log.info('[··] Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
    }
    if (!fs.existsSync('./usuarios/leveling')) {
        log.info('[··] Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
    }
    if (!fs.existsSync('./usuarios/bienvenidas')) {
        log.info('[··] Carpeta bienvenidas no existe >> creando...');
        fs.mkdirSync('./usuarios/bienvenidas');
    }
    log.info('[OK] Existen todas las carpetas necesarias');
}

// Bot

client.login('ODI3MTk5NTM5MTg1OTc1NDE3.YGXjmg.GqMdOfnGC6HVLu4Ql-kdBoAtcFU');
//client.login('ODQ3NTE3NTQxMDgwMzY3MTI0.YK_ONw.lX_psegfTcjglbokdP9qqAnoYgg');

//Cargar comandos
log.info('--Cargando comandos--');

client.commands = new Collection();

loadCommands(client.commands, './tools');

function loadCommands(collection, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const path = `${directory}/${file}`;

        if (file.endsWith('.js')) {
            const command = require(path);
            log.info(`[··] Cargando ${command.name}`);
            collection.set(command.name, command);
            log.info(`[OK] Cargado ${command.name}`);
        }
        else if (fs.lstatSync(path).isDirectory()) {
            loadCommands(collection, path);
        }
    }
};

var con = mysql.createConnection({
    host: "104.128.239.45",
    user: "u43502_Ipea7UopvX",
    password: "T0^Y9yXARCuAa1.LfAzmWRRt",
    database: "s43502_pingu",
    charset: "utf8_unicode_ci",
});
con.connect(function (err) {
    log.info('[··] Conectando a MariaDB');
    if (err) {
        log.warn(err)
    } else {
        log.info('[OK] Conexión establecida con MariaDB');
    }
});
log.info('[··] Obteniendo últimas actualizaciones de GitHub');

client.on('ready', () => {
    comprobarcarpetas()
    log.info('[OK] Bot inicializado...');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Discord',
            type: 'WATCHING',
            url: 'https://pingu.duoestudios.es'
        }
    })
    setInterval(() => {
        client.user.setPresence({
            status: 'idle',
            activity: {
                name: 'Discord',
                type: 'WATCHING',
                url: 'https://pingu.duoestudios.es'
            }
        })
    }, 3600000);
});

client.on('guildCreate', guild => {
    guildcreate(con, guild);
});

client.on('guildDelete', (guild) => {
    guilddelete(con, guild);
});

client.on('guildMemberAdd', member => {
    guildmemberadd(client, con, member);
});

client.on('guildMemberRemove', member => {
    guildmemberremove(client, con, member);
});

client.on('message', (message) => {
    //Comprobamos que no hemos recibido mensaje a través de DM, que no es un bot, o que el propio autor del mensaje sea el bot
    if (message.channel.type === "dm" || message.author.bot || message.author === client.user) return;

    //Conectamos con Mariadb y obtenemos datos del servidor
    con.query(`SELECT * FROM \`servidores\` WHERE guild =${message.guild.id}`, function (err, result, rows) {
        if (result.hasOwnProperty(0)) {
            var id = message.guild.id;
            //Comprobamos si el mensaje ha comenzado con prefijo
            if (message.content.startsWith(result[0].prefix) && message.content != result[0].prefix) {

                //Retirar el comandomsg.content.split(' ').splice(1).join(' ')
                var cortar = message.content.trim().split(' ');

                //Solo retira el prefijo del comando, por lo que cuenta también la acción deseada en el array
                var mensajeprocesado = message.content.replace(result[0].prefix, '');
                //Regex para los argumentos con ""

                const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
                var args = [];
                mensajeprocesado.match(regex).forEach(element => {
                    if (!element) return;
                    return args.push(element.replace(/"/g, ''));
                });

            }
            var tolower = message.content;
            var contenido = tolower.toLowerCase();
            if (message.content.startsWith(result[0].prefix)) {
                if (args) {
                    if (client.commands.has(args[0])) {
                        try {
                            client.commands.get(args[0]).execute(args, client, con, contenido, message, result);
                        } catch (err) {
                            log.warn(err);
                            message.reply(' se ha producido un error cuando ha intentado ejecutar este comando...');
                        }
                    } else {
                        var consultacomandoscustom = "SELECT * FROM `comandos_custom` WHERE `guild` = " + message.guild.id;
                        con.query(consultacomandoscustom, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                var buscarcomando = "SELECT * FROM `comandos_custom` WHERE `guild` = '" + message.guild.id + "' AND `cmd` = '" + args[0] + "'";
                                con.query(buscarcomando, function (err, result) {
                                    if (result.hasOwnProperty(0)) {
                                        message.channel.send("<:comandoscustom:858671400424046602>" + result[0].returns);
                                    }
                                });
                            }
                        });
                    };
                }
            }

            if (result[0].aspam_activado != 0) {
                antispamworker(message);
            }
            //Leveling
            if (!contenido.startsWith(result[0].prefix)) {
                if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
                    if (result[0].niveles_activado != "0") {
                        talkedRecently.add(`${message.author.id}_${message.guild.id}`);
                        setTimeout(() => {
                            talkedRecently.delete(`${message.author.id}_${message.guild.id}`);
                        }, 60000);
                        leveling(result, client, con, message, global);
                    }
                }
            }

            // Respuestas personalizadas
            var consultarespuestacustom = "SELECT * FROM `respuestas_custom` WHERE `guild` = " + message.guild.id;
            con.query(consultarespuestacustom, function (err, result) {
                if (result) {
                    if (result.hasOwnProperty(0)) {
                        var buscarrespuesta = "SELECT * FROM `respuestas_custom` WHERE `guild` = '" + message.guild.id + "' AND `action` = '" + contenido + "'";
                        con.query(buscarrespuesta, function (err, result) {
                            if (result) {
                                if (result.hasOwnProperty(0)) {
                                    message.channel.send("<:respuestacustom:858671300024074240> " + result[0].returns);
                                }
                            }
                        });
                    }
                }
            });
        }
        else {
            var chx = message.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
            var id = message.guild.id;
            var sql = "INSERT INTO `servidores` (`guild`, `prefix`,`bienvenida_canal_id`,`bienvenida_mensaje`,`salida_canal`,`salida_mensaje`,`niveles_canal_id`,`niveles_canal_mensaje`) VALUES (" + id + ", '/','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
            con.query(sql, function (err, result) {
                if (err) log.warn(err);
            });
        }
    }
    )
});