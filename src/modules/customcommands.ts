import { Guild } from 'discord.js'
import { ClientUser } from '../client'
import EventHook from '../core/classes/EventHook'
import Module from '../core/classes/Module'
import { PinguMessage } from '../events/messageCreate'
import CustomCommand from './classes/CustomCommand'

const Database = require('../core/databaseManager')
const consolex = require('../core/consolex')

async function getCustomCommand (guild: Guild, command: string): Promise<CustomCommand> {
  try {
    const [customCommand] = await Database.execute(
      'SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1',
      [guild.id, command]
    ).then((result) =>
      Object.prototype.hasOwnProperty.call(result, 0) ? result : {}
    )

    const customCommandProperties = JSON.parse(customCommand.customCommandProperties)

    return new CustomCommand(ClientUser.guilds.resolve(customCommand.guild), customCommand.customCommand, customCommandProperties)
  } catch (err) {
    consolex.gestionarError(err)
  }
}

export default new Module(
  'CustomCommands',
  'Base module for custom commands',
  [
    new EventHook('messageCreate', (message: PinguMessage) => {
      if (message.guildConfiguration.customcommands.enabled) {
        getCustomCommand(message.guild, message.content).then(
          (customCommand) => { customCommand.executeCommand(message) }
        )
      }
    })
  ],
  {
    enabled: 'boolean'
  },
  { enabled: false }
)
