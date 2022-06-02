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

declare global {
  interface Window {
    client: Discord.Client
  }
}

globalThis.Client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent],
  partials: [Discord.Partials.Reaction, Discord.Partials.Message, Discord.Partials.User],
  ws: { properties: { $browser: 'Discord iOS' } }
})

const consolex = require('./core/consolex')

if (process.env.ENTORNO === 'publico') {
  consolex.warn('Iniciando sesión como el bot público.')
  globalThis.Client.login(process.env.PUBLIC_TOKEN);
} else {
  consolex.warn('Iniciando sesión como el bot de desarrollo.')
  globalThis.Client.login(process.env.INSIDER_TOKEN);
}

require('./core/databaseManager').comprobarSiExistenTodasLasTablasNecesarias()

globalThis.Client.comandos = require('./core/commandsManager').cargarComandoseInteracciones()

require('./core/eventManager').cargarEventosDeProceso()
require('./core/eventManager').cargarEventos()

globalThis.Client.modulos = require("./core/moduleManager").registrarModulos();

process.on('exit', () => {
  globalThis.Client.destroy();
})
