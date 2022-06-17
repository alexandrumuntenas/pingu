import { Guild } from 'discord.js'
import { PinguMessage } from '../events/messageCreate'

const Database = require('../core/databaseManager')
const consolex = require('../core/consolex')

async function getCustomCommand (guild: Guild, command: string) {
  try {
    const [customCommand] = await Database.execute(
      'SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1',
      [guild.id, command]
    ).then((result) =>
      Object.prototype.hasOwnProperty.call(result, 0) ? result : {}
    )

    return JSON.parse(customCommand.customcommandproperties)
  } catch (err) {
    consolex.gestionarError(err)
  }
}

module.exports.hooks = [
  {
    event: 'messageCreate',
    type: 'withPrefix',
    function: (message: PinguMessage) => {
      if (message.guildConfiguration.customcommands.enabled) {
        getCustomCommand(message.guild, message.content).then((customCommand) => {

        })
      }
    }
  }
]
