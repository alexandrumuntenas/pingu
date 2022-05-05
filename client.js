/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T2                 *
 * * * * * * * * * * * * * * * * * * * * */

require('dotenv').config()
const { GatewayIntentBits } = require('discord-api-types/v10')
const Discord = require('discord.js')

const fs = require('fs')

process.Client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping], partials: ['REACTION', 'MESSAGE', 'USER'], ws: { properties: { $browser: 'Discord iOS' } } })

const Consolex = require('./functions/consolex')

if (process.env.ENTORNO === 'publico') {
  Consolex.warn('Iniciando sesión como el bot público.')
  process.Client.login(process.env.PUBLIC_TOKEN)
} else {
  Consolex.warn('Iniciando sesión como el bot de desarrollo.')
  process.Client.login(process.env.INSIDER_TOKEN)
}

process.Client.comandos = require('./functions/clientManager').cargarComandoseInteracciones()

require('./functions/eventManager').cargarEventosDeProceso()
require('./functions/eventManager').cargarEventos()

process.Client.modulos = require('./functions/moduleManager').registrarModulos()

process.Client.eventos = require('./functions/eventManager').funcionesDeTerceros
