/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T1                 *
 * * * * * * * * * * * * * * * * * * * * */

require('dotenv').config();
const Discord = require('discord.js');

const fs = require('fs');

const initializeThirdParty = require('./functions/initializeThirdParty');

const Client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING], partials: ['REACTION', 'MESSAGE', 'USER']});

const Consolex = require('./functions/consolex');

Client.Database = require('mysql2').createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATA,
	charset: 'utf8mb4_unicode_ci',
	waitForConnections: true,
	connectionLimit: 100,
	queueLimit: 0,
});

Client.Database.config.namedPlaceholders = true;

Consolex.info('Cargando Servicios Third-Party');
Consolex.success('Servicios Third-Party Cargados');

if (process.env.ENTORNO === 'public') {
	Consolex.warn('Iniciando sesión como el bot público.');
	initializeThirdParty(Client);
	Client.login(process.env.PUBLIC_TOKEN);
} else {
	Consolex.warn('Iniciando sesión como el bot de desarrollo.');
	Client.login(process.env.INSIDER_TOKEN);
}

const loadClientCommandsAndInteractions = require('./functions/loadClientCommandsAndInteractions');

Client.commands = loadClientCommandsAndInteractions();

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
	const event = require(`./events/${file}`);
	Consolex.success(`Evento ${file} cargado`);
	Client.on(event.name, (...args) => event.execute(Client, ...args));
}

module.exports = Client;
