//https://discord.com/api/oauth2/authorize?client_id=827199539185975417&permissions=8&scope=bot%20applications.commands
const { Client, Intents, MessageAttachment, MessageEmbed, MessageReaction, MessageCollector, Collection } = require('discord.js');
const mysql = require('mysql2');
const Math = require('mathjs');
const Jimp = require('jimp');
const downloader = require('nodejs-file-downloader');
const webp = require('webp-converter');
const fs = require('fs')
const { timeStamp } = require('console');
const moment = require('moment');
const pdf = require('pdfkit');
const emojiStrip = require('emoji-strip');
const msi = require('ms');
const { globalAgent } = require('http');


//Services Workers
const guildcreate = require('./services/guildcreate');
const guilddelete = require('./services/guilddelete');
const guildmemberadd = require('./services/guildmemberadd');
const guildmemberremove = require('./services/guildmemberremove');
const levelworker = require('./services/leveling');
const antispamworker = require('./services/antispam');
const onmessage = require('./services/onmessage');
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
                name: '1 y 0',
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
    onmessage(levelworker, antispamworker, client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global);
});

client.login('ODI3MTk5NTM5MTg1OTc1NDE3.YGXjmg.GqMdOfnGC6HVLu4Ql-kdBoAtcFU');

