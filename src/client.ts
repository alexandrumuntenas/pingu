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
import Consolex from './core/consolex'

import CommandsManager from './core/commandsManager'
import CooldownMananger from './core/cooldownManager'
import ModuleManager from './core/moduleManager'
import GuildManager from './core/guildManager'
import EventManager from './core/eventManager'
import MessageTemplate from './templates/messageTemplate'
import InternationalizationManager from './core/internationalizationManager'

const ClientUser: Discord.Client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Discord.Partials.Reaction,
    Discord.Partials.Message,
    Discord.Partials.User
  ],
  ws: { properties: { $browser: 'Discord iOS' } }
})

if (process.env.ENTORNO === 'publico') {
  Consolex.warn('Iniciando sesión como el bot público.')
  ClientUser.login(process.env.PUBLIC_TOKEN)
} else {
  Consolex.warn('Iniciando sesión como el bot de desarrollo.')
  ClientUser.login(process.env.INSIDER_TOKEN)
}

process.on('exit', () => {
  ClientUser.destroy()
})

// Managers

const ClientCommandsManager = new CommandsManager('src/client/commands')
const ClientCooldownManager = new CooldownMananger()
const ClientModuleManager = new ModuleManager()
const ClientGuildManager = new GuildManager()
const ClientEventManager = new EventManager()
const ClientInternationalizationManager = new InternationalizationManager()

// Templates

const ClientMessageTemplate = new MessageTemplate({
  status: { color: Discord.Colors.Blurple, emoji: '📝' },
  success: { color: Discord.Colors.Green, emoji: '✅' },
  error: { color: Discord.Colors.Red, emoji: '❌' },
  warning: { color: Discord.Colors.Orange, emoji: '⚠' },
  info: { color: Discord.Colors.Blue, emoji: 'ℹ' },
  debug: { color: Discord.Colors.LuminousVividPink, emoji: '🔧' },
  question: { color: Discord.Colors.Gold, emoji: '❓' },
  loading: { color: Discord.Colors.Blurple, emoji: '<a:core_loading:970712845429903461>' },
  help: { color: Discord.Colors.Gold, emoji: '❓' },
  timeout: { color: Discord.Colors.Red, emoji: '<:system_timeout:970715618938617856>' }
})

export {
  ClientUser,
  ClientCommandsManager,
  ClientCooldownManager,
  ClientModuleManager,
  ClientGuildManager,
  ClientEventManager,
  ClientMessageTemplate,
  ClientInternationalizationManager
}
