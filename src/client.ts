/* * * * * * * * * * * * * * * * * * * * *
 * Proyecto: Pingu                       *
 * Autor: Alexandru Muntenas             *
 * Licencia: BSL-1                       *
 * * * * * * * * * * * * * * * * * * * * *
 * Versión desarrollo: NEXT              *
 * Versión pública: 22T4                 *
 * * * * * * * * * * * * * * * * * * * * */

import 'dotenv/config'
import * as Discord from 'discord.js'
import { GatewayIntentBits } from 'discord-api-types/v10'

interface PinguClient extends NodeJS.Process {
  client: Discord.Client
}

process.Client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent],
  partials: [Discord.Partials.Reaction, Discord.Partials.Message, Discord.Partials.User],
  ws: { properties: { $browser: 'Discord iOS' } }
})

const consolex = require('./core/consolex')

if (process.env.ENTORNO === 'publico') {
  consolex.warn('Iniciando sesión como el bot público.')
  process.Client.login(process.env.PUBLIC_TOKEN)
} else {
  consolex.warn('Iniciando sesión como el bot de desarrollo.')
  process.Client.login(process.env.INSIDER_TOKEN)
}

require('./core/databaseManager').comprobarSiExistenTodasLasTablasNecesarias()

process.Client.comandos = require('./core/commandsManager').cargarComandoseInteracciones()

require('./core/eventManager').cargarEventosDeProceso()
require('./core/eventManager').cargarEventos()

process.Client.modulos = require('./core/moduleManager').registrarModulos()

process.on('exit', () => {
  process.Client.destroy()
})
