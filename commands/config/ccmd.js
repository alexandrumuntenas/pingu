const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

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
          interaction.editReply({ embeds: [Success(i18n(locale, 'CCMD_CREATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: interaction.options.getString('command'), CCMD_VALUERETURNED: interaction.options.getString('response') }))] })
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [interaction.options.getString('command'), interaction.guild.id], function (err) {
          if (err) client.Sentry.captureException(err)
          interaction.editReply({ embeds: [Success(i18n(locale, 'CCMD_ELIMINATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: interaction.options.getString('command') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('ccmd', i18n.help(locale, 'CCMD::DESCRIPTION'), [{ option: 'create', description: i18n.help(locale, 'CCMD::OPTION:CREATE'), syntax: 'create <command> <value to return>', isNsfw: false }, { option: 'remove', description: i18n.help(locale, 'CCMD::OPTION:CREATE'), syntax: 'remove <command>', isNsfw: false }])
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'create': {
          if (message.args[1] && message.args[2]) {
            const messageReturned = message.content.replace(`${message.database.guildPrefix}ccmd create ${message.args[1]}`, '')
            client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [message.guild.id, message.args[1], messageReturned], function (err) {
              if (err) client.Sentry.captureException(err)
              message.reply({ embeds: [Success(i18n(locale, 'CCMD_CREATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1], CCMD_VALUERETURNED: messageReturned }))] })
            })
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'remove': {
          if (message.args[1]) {
            client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
              if (err) client.Sentry.captureException(err)
              message.reply({ embeds: [Success(i18n(locale, 'CCMD_ELIMINATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1] }))] })
            })
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        default: {
          message.reply({ embeds: [helpTray] })
          break
        }
      }
    } else {
      message.reply({ embeds: [helpTray] })
    }
  }
}
