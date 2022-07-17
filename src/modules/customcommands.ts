import { Guild } from 'discord.js'
import { ClientUser } from '../client'
import EventHook from '../core/classes/EventHook'
import Module from '../core/classes/Module'
import Consolex from '../core/consolex'
import { PoolConnection } from '../core/databaseManager'
import { PinguMessage } from '../events/messageCreate'
import CustomCommand from './classes/CustomCommand'

async function getCustomCommand (guild: Guild | null, command: string): Promise<CustomCommand> {
  if (!(guild instanceof Guild)) throw new Error('El "Guild" especificado no existe.')

  const [customCommand] = await PoolConnection.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command]).then((result: any) => Object.prototype.hasOwnProperty.call(result, 0) ? result : {}).catch((error) => Consolex.gestionarError(error))

  const customCommandProperties = JSON.parse(customCommand.customCommandProperties)

  return new CustomCommand(ClientUser.guilds.resolve(customCommand.guild), customCommand.customCommand, customCommandProperties)
}

export default new Module(
  'CustomCommands',
  'Base module for custom commands',
  [
    new EventHook('messageCreate', (message: PinguMessage) => {
      if (message.guildConfiguration.customcommands.enabled) {
        getCustomCommand(message.guild, message.content).then((customCommand) => { customCommand.executeCommand(message) }).catch((getCustomCommandError) => Consolex.gestionarError(getCustomCommandError))
      }
    })
  ],
  {
    enabled: 'boolean'
  },
  { enabled: false }
)
