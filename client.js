/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T2                 *
 * * * * * * * * * * * * * * * * * * * * */

require('dotenv').config()
const Discord = require('discord.js')

const fs = require('fs')

process.Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING], partials: ['REACTION', 'MESSAGE', 'USER'], ws: { properties: { $browser: 'Discord iOS' } } })
require('discord-modals')(process.Client)

const Consolex = require('./functions/consolex')

if (process.env.ENTORNO === 'publico') {
  Consolex.warn('Iniciando sesión como el bot público.')
  process.Client.login(process.env.PUBLIC_TOKEN)
} else {
  Consolex.warn('Iniciando sesión como el bot de desarrollo.')
  process.Client.login(process.env.INSIDER_TOKEN)
}

process.Client.comandos = require('./functions/clientManager').cargarComandoseInteracciones()
process.Client.modulos = require('./functions/moduleManager').registrarModulos()

for (const file of fs.readdirSync('./events').filter(files => files.endsWith('.js'))) {
  const event = require(`./events/${file}`)
  Consolex.success(`Evento ${file} cargado`)
  process.Client.on(event.name, (...args) => event.execute(...args))
}

process.on('exit', () => {
  process.Client.destroy()
})
