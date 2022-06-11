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

const ClientCommandsManager = new CommandsManager('src/client/commands')
const ClientCooldownManager = new CooldownMananger()
const ClientModuleManager = new ModuleManager()
const ClientGuildManager = new GuildManager()
const ClientEventManager = new EventManager()

export { ClientUser, ClientCommandsManager, ClientCooldownManager, ClientModuleManager, ClientGuildManager, ClientEventManager }
