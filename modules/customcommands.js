/* eslint-disable node/no-callback-literal */

module.exports.modeloDeConfiguracion = {
  enabled: 'boolean'
}

const Database = require('../core/databaseManager')
const consolex = require('../core/consolex')
const reemplazarPlaceholdersConDatosReales = require('../core/reemplazarPlaceholdersConDatosReales')

module.exports.getCustomCommands = async (guild) => {
  Database.execute('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [guild.id], (err, result) => {
    if (err) consolex.gestionarError(err)

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

      return customcommands || []
    }

    return []
  })
}

/**
 * @param {Guild} guild
 * @param {String} command
 * @returns {Object} customCommand
 */

module.exports.getCustomCommand = (guild, command) => {
  Database.execute('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
    if (err) consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0')) {
      if (Object.prototype.hasOwnProperty.call(result[0], 'customcommandproperties') && result[0].customcommandproperties !== null) {
        return JSON.parse(result[0].customcommandproperties)
      }

      return module.exports.migrateToNewOrganization(guild, command)
    }
  })
}

/**
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
  Database.execute('INSERT INTO `guildCustomCommands` (`guild`, `customcommand`, `customcommandproperties`) VALUES (?,?,?)', [guild.id, customcommandproperties.command, JSON.stringify(customcommandproperties)], err => {
    if (err) {
      consolex.gestionarError(err)
      throw err
    }

    return module.exports.getCustomCommand(guild, customcommandproperties.command)
  })
}

/**
 * Delete a custom command
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.deleteCustomCommand = (guild, command) => {
  Database.execute('DELETE FROM `guildCustomCommands` WHERE `guild` = ? AND `customcommand` = ?', [guild.id, command], err => {
    if (err) {
      consolex.gestionarError(err)
      return err
    }

    return null
  })
}

/**
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.migrateToNewOrganization = (guild, command) => {
  Database.execute('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
    if (err) consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0')) {
      const customcommandproperties = { command: result[0].customCommand, reply: result[0].messageReturned }
      Database.execute('UPDATE `guildCustomCommands` SET `customcommand` = ?, `customcommandproperties` = ? WHERE `guild` = ? AND `customCommand` = ?', [command, JSON.stringify(customcommandproperties), guild.id, result[0].customCommand], err2 => {
        if (err2) consolex.gestionarError(err)

        return module.exports.getCustomCommand(guild, command)
      })
    }
  })
}

/**
 * @param {Message} message
 * @param {String} command
 */

const { EmbedBuilder } = require('discord.js')

module.exports.runCustomCommand = (message, command) => {
  module.exports.getCustomCommand(message.guild, command).then((customCommand) => {
    const reply = {}

    if (customCommand.sendInEmbed) {
      const embed = new EmbedBuilder()

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
        reply.embeds = reply.embeds || [new EmbedBuilder().setDescription(reemplazarPlaceholdersConDatosReales(customCommand.reply, message.member))]
        message.author.send(reply)
        try {
          message.delete()
        } catch (err) {
          consolex.gestionarError(err)
        }

        return
      } catch (err) {
        consolex.gestionarError(err)
      }
    }

    if (customCommand.sendChannel) {
      const customChannelToSend = message.guild.channel.cache.get(customCommand.sendChannel)
      if (customChannelToSend) customChannelToSend.send(reply)
      else message.reply(reply)
    } else message.reply(reply)
  })
}

const CooldownManager = require('../core/cooldownManager')

module.exports.hooks = [{
  event: 'messageCreate',
  type: 'withPrefix',
  function: message => {
    if (message.guild.configuration.customcommands.enabled) {
      CooldownManager.add(message.member, message.guild, message.commandName)
      return module.exports.runCustomCommand(message, message.commandName)
    }
  }
}]
