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
class BaseClient {
  BaseClient = Discord.Client

  constructor () {
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

    if (!process.env.CLIENT_TOKEN) throw new Error('GTW000: CLIENT_TOKEN not declared.')
    ClientUser.login(process.env.CLIENT_TOKEN)

    process.on('exit', () => {
      ClientUser.destroy()
    })
  }
}

export default BaseClient
