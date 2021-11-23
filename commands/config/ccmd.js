const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'ccmd',
  description: '⚙️ Create or remove custom commands',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('ccmd')
    .setDescription('Create or remove custom commands')
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a custom command').addStringOption(option => option.setName('command').setDescription('The Custom Command').setRequired(true)).addStringOption(option => option.setName('response').setDescription('The Response to the command').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a custom command').addStringOption(option => option.setName('command').setDescription('The Custom Command').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'create': {
        client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [interaction.guild.id, interaction.options.getString('command'), interaction.options.getString('response')], function (err) {
          if (err) client.Sentry.captureException(err)
          genericMessages.success(interaction, getLocales(locale, 'CCMD_CREATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: interaction.options.getString('command'), CCMD_VALUERETURNED: interaction.options.getString('response') }))
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [interaction.options.getString('command'), interaction.guild.id], function (err) {
          if (err) client.Sentry.captureException(err)
          genericMessages.success(interaction, getLocales(locale, 'CCMD_ELIMINATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: interaction.options.getString('command') }))
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'create': {
          if (message.args[1] && message.args[2]) {
            const messageReturned = message.content.replace(`${message.database.guildPrefix}ccmd create ${message.args[1]}`, '')
            client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [message.guild.id, message.args[1], messageReturned], function (err) {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'CCMD_CREATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1], CCMD_VALUERETURNED: messageReturned }))
            })
          } else {
            helpTray(message, locale)
          }
          break
        }
        case 'remove': {
          if (message.args[1]) {
            client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'CCMD_ELIMINATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1] }))
            })
          } else {
            helpTray(message, locale)
          }
          break
        }
        default: {
          helpTray(message, locale)
          break
        }
      }
    } else {
      helpTray(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}ccmd <option>`, ['create <command> <value to return ···>', 'remove <command>'])
}
