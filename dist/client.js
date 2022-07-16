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
import CommandsManager from './core/commandsManager.js'
import CooldownMananger from './core/cooldownManager.js'
import ModuleManager from './core/moduleManager.js'
import GuildManager from './core/guildManager.js'
import EventManager from './core/eventManager.js'
import MessageTemplate from './templates/messageTemplate.js'
import InternationalizationManager from './core/internationalizationManager.js'
import PrivacyManager from './core/privacyManager.js'
const ClientUser = new Discord.Client({
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
if (!process.env.CLIENT_TOKEN) { throw new Error('GTW000: CLIENT_TOKEN not declared.') }
ClientUser.login(process.env.CLIENT_TOKEN)
process.on('exit', () => {
  ClientUser.destroy()
})
// Managers
const ClientInternationalizationManager = new InternationalizationManager()
const ClientCommandsManager = new CommandsManager('commands')
const ClientCooldownManager = new CooldownMananger()
const ClientModuleManager = new ModuleManager()
const ClientGuildManager = new GuildManager()
const ClientEventManager = new EventManager()
const ClientPrivacyManager = new PrivacyManager()
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
export { ClientUser, ClientCommandsManager, ClientCooldownManager, ClientModuleManager, ClientGuildManager, ClientEventManager, ClientMessageTemplate, ClientInternationalizationManager, ClientPrivacyManager }
