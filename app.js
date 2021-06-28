//https://discord.com/api/oauth2/authorize?client_id=827199539185975417&permissions=8&scope=bot%20applications.commands
const { Client, Intents, MessageAttachment, MessageEmbed, MessageReaction, MessageCollector, Collection } = require('discord.js');
const mysql = require('mysql2');
const Math = require('mathjs');
const Jimp = require('jimp');
const downloader = require('nodejs-file-downloader');
const webp = require('webp-converter');
const fs = require('fs')
const moment = require('moment');
const pdf = require('pdfkit');
const emojiStrip = require('emoji-strip');
const msi = require('ms');
const translate = require('translatte')
const progressbar = require('string-progressbar');
const boxen = require('boxen');

//Services Workers
const guildcreate = require('./services/guildcreate');
const guilddelete = require('./services/guilddelete');
const guildmemberadd = require('./services/guildmemberadd');
const guildmemberremove = require('./services/guildmemberremove');
const levelworker = require('./services/leveling');
const antispamworker = require('./services/antispam');
console.log('[OK] Services Workers Cargados');

// Funciones globales
async function comprobarcarpetas() {
    console.log('Comprobando carpetas...');
    if (!fs.existsSync('./usuarios')) {
        fs.mkdirSync('./usuarios/');
        console.log('Carpeta usuarios no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
        console.log('Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
        console.log('Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
        console.log('Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/bievenidas');
        console.log('Carpeta bienvenidas no existe >> creando...');
    }
    if (!fs.existsSync('./usuarios/moderacion')) {
        console.log('Carpeta moderacion no existe >> creando...');
        fs.mkdirSync('./usuarios/moderacion');
    }
    if (!fs.existsSync('./usuarios/avatares')) {
        console.log('Carpeta avatares no existe >> creando...');
        fs.mkdirSync('./usuarios/avatares');
    }
    if (!fs.existsSync('./usuarios/leveling')) {
        console.log('Carpeta leveling no existe >> creando...');
        fs.mkdirSync('./usuarios/leveling');
    }
    if (!fs.existsSync('./usuarios/bienvenidas')) {
        console.log('Carpeta bienvenidas no existe >> creando...');
        fs.mkdirSync('./usuarios/bienvenidas');
    }
    console.log('Comprobación finalizada...');
}

// Bot
var con = mysql.createConnection({
    host: "localhost",
    user: "wiredpenguin",
    password: "",
    database: "wiredpenguin",
    charset: "utf8_unicode_ci",
});

con.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Me he conectado a MariaDB! Continuando el inicio del script...');
    }
});

const client = new Client();

//Cargar comandos
console.log('Cargando comandos...');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./tools').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log('[··] Cargando ' + file);
    const command = require(`./tools/${file}`);
    client.commands.set(command.name, command);
    console.log('[OK] Cargado ' + file);
}

client.on('ready', () => {
    comprobarcarpetas()
    console.log('Yo también estoy listo! Ya puedo comenzar a trabajar...');
    client.user.setPresence({
        status: 'idle',
        activity: {
            name: '1 y 0',
            type: 'WATCHING',
            url: 'https://pingu.duoestudios.es'
        }
    })
    setInterval(() => {
        client.user.setPresence({
            status: 'idle',
            activity: {
                name: 'pingu.duoestudios.es',
                type: 'WATCHING',
                url: 'https://pingu.duoestudios.es'
            }
        })
    }, 3600000);
    webp.grant_permission();
});

client.on('guildCreate', guild => {
    guildcreate(con, guild);
});

client.on('guildDelete', (guild) => {
    guilddelete(con, guild);
});

client.on('guildMemberAdd', member => {
    guildmemberadd(client, con, Jimp, downloader, webp, fs, MessageAttachment, member);
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
        if (result) {
            if (result[0] !== undefined) {
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
                                client.commands.get(args[0]).execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp);
                            } catch (error) {
                                console.error(error);
                                message.reply(' se ha producido un error mientras se intentaba ejecutar ese comando...');
                            }
                        } else {
                            var consultacomandoscustom = "SELECT * FROM `comandos_custom` WHERE `guild` = " + global.id;
                            con.query(consultacomandoscustom, function (err, result) {
                                if (typeof result[0] !== 'undefined') {
                                    var buscarcomando = "SELECT * FROM `comandos_custom` WHERE `guild` = '" + global.id + "' AND `cmd` = '" + args[0] + "'";
                                    con.query(buscarcomando, function (err, result) {
                                        if (typeof result[0] !== 'undefined') {
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
                    if (result[0].niveles_activado != "0") {
                        levelworker(result, client, con, Jimp, downloader, webp, message, MessageAttachment, global);
                    }
                }

                // Respuestas personalizadas
                var consultarespuestacustom = "SELECT * FROM `respuestas_custom` WHERE `guild` = " + global.id;
                con.query(consultarespuestacustom, function (err, result) {
                    if (typeof result[0] !== 'undefined') {
                        var buscarrespuesta = "SELECT * FROM `respuestas_custom` WHERE `guild` = '" + global.id + "' AND `action` = '" + contenido + "'";
                        con.query(buscarrespuesta, function (err, result) {
                            if (typeof result[0] !== 'undefined') {
                                message.channel.send("<:respuestacustom:858671300024074240> " + result[0].returns);
                            }
                        });
                    }
                });
            }
        }
        else {
            var chx = message.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
            var id = global.id;
            var sql = "INSERT INTO `servidores` (`guild`, `prefix`,`bienvenida_canal_id`,`bienvenida_mensaje`,`salida_canal`,`salida_mensaje`,`niveles_canal_id`,`niveles_canal_mensaje`) VALUES (" + id + ", '/','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    }
    )
});

client.login('ODI3MTk5NTM5MTg1OTc1NDE3.YGXjmg.GqMdOfnGC6HVLu4Ql-kdBoAtcFU');

