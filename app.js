//https://discord.com/api/oauth2/authorize?client_id=827199539185975417&permissions=8&scope=bot%20applications.commands
const { Client, Collection } = require('discord.js');
const mysql = require('mysql2');
const fs = require('fs');
const winston = require('winston');
const Sentry = require("winston-transport-sentry-node").default;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});
logger.add(new Sentry({
    sentry: {
        dsn: 'https://428ebb1b4ccc4d4d81806506a6064bdb@o923346.ingest.sentry.io/5870573',
    },
    level: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
}));
const talkedRecently = new Set();
const client = new Client();

//Services Workers
const guildcreate = require('./services/guildcreate');
const guilddelete = require('./services/guilddelete');
const guildmemberadd = require('./services/guildmemberadd');
const guildmemberremove = require('./services/guildmemberremove');
const leveling = require('./services/leveling');
const antispamworker = require('./services/antispam');
console.log('[OK] Services Workers Cargados');

// Funciones globales
async function comprobarcarpetas() {
    console.log('[··] Comprobando carpetas');
    if (!fs.existsSync('./usuarios')) {
        fs.mkdirSync('./usuarios/');
        console.log('[··] Carpeta usuarios no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
        console.log('[··] Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
        console.log('[··] Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
        console.log('[··] Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/bievenidas');
        console.log('[··] Carpeta bienvenidas no existe >> creando...');
    }
    if (!fs.existsSync('./usuarios/moderacion')) {
        console.log('[··] Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
    }
    if (!fs.existsSync('./usuarios/avatares')) {
        console.log('[··] Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
    }
    if (!fs.existsSync('./usuarios/leveling')) {
        console.log('[··] Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
    }
    if (!fs.existsSync('./usuarios/bienvenidas')) {
        console.log('[··] Carpeta bienvenidas no existe >> creando...');
        fs.mkdirSync('./usuarios/bienvenidas');
    }
    console.log('[OK] Existen todas las carpetas necesarias');
}

// Bot

client.login('ODI3MTk5NTM5MTg1OTc1NDE3.YGXjmg.GqMdOfnGC6HVLu4Ql-kdBoAtcFU');
//client.login('ODQ3NTE3NTQxMDgwMzY3MTI0.YK_ONw.lX_psegfTcjglbokdP9qqAnoYgg');


//Cargar comandos
console.log('--Cargando comandos--');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./tools').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log('[··] Cargando ' + file);
    const command = require(`./tools/${file}`);
    client.commands.set(command.name, command);
    console.log('[OK] Cargado ' + file);
}

var con = mysql.createConnection({
    host: "104.128.239.45",
    user: "u43502_Ipea7UopvX",
    password: "T0^Y9yXARCuAa1.LfAzmWRRt",
    database: "s43502_pingu",
    charset: "utf8_unicode_ci",
});
con.connect(function (err) {
    console.log('[··] Conectando a MariaDB');
    if (err) {
        console.log(err)
    } else {
        console.log('[OK] Conexión establecida con MariaDB');
    }
});
console.log('[··] Obteniendo últimas actualizaciones de GitHub');

client.on('ready', () => {
    comprobarcarpetas()
    console.log('[OK] Bot inicializado...');
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

    global = [];
    global.id = message.guild.id;
    global.name = message.guild.name;
    //Conectamos con Mariadb y obtenemos datos del servidor
    con.query("SELECT * FROM `servidores` WHERE guild = '" + global.id + "'", function (err, result, rows) {
        if (result.hasOwnProperty(0)) {
            global.prefix = result[0].prefix;
            var id = global.id;
            //Comprobamos si el mensaje ha comenzado con prefijo
            if (message.content.startsWith(global.prefix) && message.content != global.prefix) {

                //Retirar el comandomsg.content.split(' ').splice(1).join(' ')
                var cortar = message.content.trim().split(' ');

                //Solo retira el prefijo del comando, por lo que cuenta también la acción deseada en el array
                var mensajeprocesado = message.content.replace(global.prefix, '');
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
            if (message.content.startsWith(global.prefix)) {
                if (args) {
                    if (client.commands.has(args[0])) {
                        try {
                            client.commands.get(args[0]).execute(args, client, con, contenido, global, message, result);
                        } catch (e) {
                            console.log(e);
                            message.reply(' se ha producido un error cuando ha intentado ejecutar este comando...');
                        }
                    } else {
                        var consultacomandoscustom = "SELECT * FROM `comandos_custom` WHERE `guild` = " + global.id;
                        con.query(consultacomandoscustom, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                var buscarcomando = "SELECT * FROM `comandos_custom` WHERE `guild` = '" + global.id + "' AND `cmd` = '" + args[0] + "'";
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
            if (!contenido.startsWith(global.prefix)) {
                if (!talkedRecently.has(message.author.id)) {
                    if (result[0].niveles_activado != "0") {
                        talkedRecently.add(message.author.id);
                        setTimeout(() => {
                            talkedRecently.delete(message.author.id);
                        }, 60000);
                        leveling(result, client, con, message, global);
                    }
                }
            }

            // Respuestas personalizadas
            var consultarespuestacustom = "SELECT * FROM `respuestas_custom` WHERE `guild` = " + global.id;
            con.query(consultarespuestacustom, function (err, result) {
                if (result) {
                    if (result.hasOwnProperty(0)) {
                        var buscarrespuesta = "SELECT * FROM `respuestas_custom` WHERE `guild` = '" + global.id + "' AND `action` = '" + contenido + "'";
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
            var id = global.id;
            var sql = "INSERT INTO `servidores` (`guild`, `prefix`,`bienvenida_canal_id`,`bienvenida_mensaje`,`salida_canal`,`salida_mensaje`,`niveles_canal_id`,`niveles_canal_mensaje`) VALUES (" + id + ", '/','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
            con.query(sql, function (err, result) {
                if (err) console.log(err);
            });
        }
    }
    )
});