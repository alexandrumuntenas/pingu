/* eslint-disable node/no-callback-literal */
const Database = require('../functions/databaseConnection')
const Consolex = require('../functions/consolex')
const reemplazarPlaceholdersConDatosReales = require('../functions/reemplazarPlaceholdersConDatosReales')

module.exports.getCustomCommands = (guild, callback) => {
  if (!callback) throw new Error('Callback is required')

  Database.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [guild.id], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0')) {
      const customcommands = []
      for (let i = 0; i < result.length; i++) {
        if (Object.prototype.hasOwnProperty.call(result[i], 'customcommandproperties') && result[i].customcommandproperties !== null) {
          customcommands.push(JSON.parse(result[i].customcommandproperties))
        } else {
          module.exports.migrateToNewOrganization(guild, result[i].customCommand, () => {
            customcommands.push({ command: result[i].customCommand, reply: result[i].messageReturned })
          })
        }
      }

      callback(customcommands || [])
    } else {
      callback([])
    }
  })
}

/**
 * Get the custom command from the database
 * @param {Guild} guild
 * @param {String} command
 * @param {Function} callback
 * @returns {Object} customCommand
 */

module.exports.getCustomCommand = (guild, command, callback) => {
  if (!callback) throw new Error('Callback is required')

  Database.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0')) {
      if (Object.prototype.hasOwnProperty.call(result[0], 'customcommandproperties') && result[0].customcommandproperties !== null) {
        callback(JSON.parse(result[0].customcommandproperties))
      } else {
        module.exports.migrateToNewOrganization(guild, command, () => {
          callback({ command, reply: result[0].messageReturned })
        })
      }
    }
  })
}

/**
 * Create a new custom command for the guild
 * @param {Guild} guild
 * @param {Object} customcommandproperties
 * @param {String} customcommandproperties.command - The command to be used
 * @param {String} customcommandproperties.reply - The reply to be sent
 * @param {?Boolean} customcommandproperties.sendDM - Whether or not to send the reply in a DM
 * @param {?TextChannel} customcommandproperties.sendChannel - The channel to send the reply in
 * @param {?Role} customcommandproperties.setRole - The role to set
 * @param {?Boolean} customcommandproperties.sendInEmbed - Whether or not to send the reply in an embed
 * @param {?String} customcommandproperties.sendInEmbed.title - The title field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.description - The description field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.thumbnail - The thumbnail field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.image - The image field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.url - The url field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.color - The url field of the embed.
*/
module.exports.createCustomCommand = (guild, customcommandproperties) => {
  Database.query('INSERT INTO `guildCustomCommands` (`guild`, `customcommand`, `customcommandproperties`) VALUES (?,?,?)', [guild.id, customcommandproperties.command, JSON.stringify(customcommandproperties)], err => {
    if (err) {
      Consolex.gestionarError(err)
      throw err
    }
  })
}

/**
 * Delete a custom command
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.deleteCustomCommand = (guild, command) => {
  Database.query('DELETE FROM `guildCustomCommands` WHERE `guild` = ? AND `customcommand` = ?', [guild.id, command], err => {
    if (err) {
      Consolex.gestionarError(err)
      return err
    }

    return null
  })
}

/**
 * Update the custom command properties in the database to use the new structures
 * @param {Guild} guild
 * @param {String} command
 * @param {Function} callback
 */
module.exports.migrateToNewOrganization = (guild, command, callback) => {
  Database.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0')) {
      const customcommandproperties = { command: result[0].customCommand, reply: result[0].messageReturned }
      Database.query('UPDATE `guildCustomCommands` SET `customcommand` = ?, `customcommandproperties` = ? WHERE `guild` = ? AND `customCommand` = ?', [command, JSON.stringify(customcommandproperties), guild.id, result[0].customCommand], err2 => {
        if (err2) Consolex.gestionarError(err)

        if (callback) callback()
      })
    }
  })
}

/**
 * Runs the custom command if it exists
 * @param {Message} message
 * @param {String} command
 */

const { MessageEmbed } = require('discord.js')

module.exports.runCustomCommand = (message, command) => {
  module.exports.getCustomCommand(message.guild, command, customCommand => {
    const reply = {}

    if (customCommand.sendInEmbed) {
      const embed = new MessageEmbed()

      if (customCommand.sendInEmbed.title) embed.setTitle(customCommand.sendEmbed.title)

      if (customCommand.sendInEmbed.description) {
        reply.content = reemplazarPlaceholdersConDatosReales(customCommand.reply, message.member)
        embed.setDescription(reemplazarPlaceholdersConDatosReales(customCommand.sendEmbed.description, message.member))
      } else embed.setDescription(reemplazarPlaceholdersConDatosReales(customCommand.reply, message.member))

      if (customCommand.sendInEmbed.thumbnail) embed.setThumbnail(customCommand.sendEmbed.thumbnail)

      if (customCommand.sendInEmbed.image) embed.setImage(customCommand.sendEmbed.image)

      if (customCommand.sendInEmbed.url) embed.setURL(customCommand.sendEmbed.url)

      if (customCommand.sendInEmbed.color) embed.setColor(customCommand.sendEmbed.color)
      else embed.setColor('#2F3136')

      embed.setFooter({ text: `Powered by Pingu || ⚠️ This is a custom command made by ${message.guild.name}.`, iconURL: process.Client.user.displayAvatarURL() })

      reply.embeds = [embed]
    } else reply.content = reemplazarPlaceholdersConDatosReales(customCommand.reply, message.member)

    if (customCommand.setRole) message.member.roles.add(customCommand.setRole)

    if (customCommand.sendDM) {
      try {
        reply.embeds = reply.embeds || [new MessageEmbed().setDescription(reemplazarPlaceholdersConDatosReales(customCommand.reply, message.member))]
        message.author.send(reply)
        try {
          message.delete()
        } catch (err) {
          Consolex.gestionarError(err)
        }

        return
      } catch (err) {
        Consolex.gestionarError(err)
      }
    }

    if (customCommand.sendChannel) {
      const customChannelToSend = message.guild.channel.cache.get(customCommand.sendChannel)
      if (customChannelToSend) customChannelToSend.send(reply)
      else message.reply(reply)
    } else message.reply(reply)
  })
}

const CooldownManager = require('../functions/cooldownManager')

module.exports.hooks = [{
  evento: 'messageCreate',
  tipo: 'withPrefix',
  execute: message => {
    if (message.guild.configuration.customcommands.enabled) {
      CooldownManager.add(message.member, message.guild, message.commandName)
      return module.exports.runCustomCommand(message, message.commandName)
    }
  }
}]
