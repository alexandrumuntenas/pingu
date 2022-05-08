/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T4                 *
 * * * * * * * * * * * * * * * * * * * * */

require('dotenv').config()
const { GatewayIntentBits } = require('discord-api-types/v10')
const Discord = require('discord.js')
const Dashboard = require('discord-easy-dashboard')

const fs = require('fs')

process.Client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping], partials: ['REACTION', 'MESSAGE', 'USER'], ws: { properties: { $browser: 'Discord iOS' } } })

const Consolex = require('./functions/consolex')

if (process.env.ENTORNO === 'publico') {
  Consolex.warn('Iniciando sesión como el bot público.')
  process.Client.login(process.env.PUBLIC_TOKEN)
  process.Client.Dashboard = new Dashboard(process.Client, { secret: process.env.PUBLIC_SECRET, theme: 'dark' })
} else {
  Consolex.warn('Iniciando sesión como el bot de desarrollo.')
  process.Client.login(process.env.INSIDER_TOKEN)
  process.Client.Dashboard = new Dashboard(process.Client, { secret: process.env.INSIDER_SECRET, theme: 'dark' })
}

process.Client.comandos = require('./functions/commandsManager').cargarComandoseInteracciones()

require('./functions/eventManager').cargarEventosDeProceso()
require('./functions/eventManager').cargarEventos()

process.Client.modulos = require('./functions/moduleManager').registrarModulos()

for (const file of fs.readdirSync('./events').filter(files => files.endsWith('.js'))) {
  const event = require(`./events/${file}`)
  Consolex.success(`Evento ${file} cargado`)
  process.Client.on(event.name, (...args) => event.execute(...args))
}

process.on('exit', () => {
  process.Client.destroy()
})

// TODO: Añadir un gestor para los "help" para ser dinámico.
