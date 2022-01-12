const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'ccmd',
  description: '⚙️ Create or remove custom commands',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('ccmd')
    .setDescription('Create or remove custom commands')
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a custom command').addStringOption(option => option.setName('command').setDescription('The Custom Command').setRequired(true)).addStringOption(option => option.setName('response').setDescription('The Response to the command').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a custom command').addStringOption(option => option.setName('command').setDescription('The Custom Command').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'create': {
        client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [interaction.guild.id, interaction.options.getString('command'), interaction.options.getString('response')], function (err) {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'CCMD::CREATE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'CCMD::CREATE:SUCCESS', { COMMAND: interaction.options.getString('command') }))] })
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [interaction.options.getString('command'), interaction.guild.id], function (err) {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'CCMD::REMOVE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'CCMD::REMOVE:SUCCESS', { COMMAND: interaction.options.getString('command') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('ccmd', i18n(locale, 'CCMD::HELPTRAY:DESCRIPTION'), [{ option: 'create', description: i18n(locale, 'CCMD::HELPTRAY:OPTION:CREATE'), syntax: 'create <command> <value to return>', isNsfw: false }, { option: 'remove', description: i18n(locale, 'CCMD::HELPTRAY:OPTION:REMOVE'), syntax: 'remove <command>', isNsfw: false }])
    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, 0) && Object.prototype.hasOwnProperty.call(message.args, 1))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'create': {
        const messageReturned = message.content.replace(`${message.database.guildPrefix}ccmd create ${message.args[1]}`, '').trim()
        client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [message.guild.id, message.args[1], messageReturned], function (err) {
          if (err) client.logError(err)
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'CCMD::CREATE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'CCMD::CREATE:SUCCESS', { COMMAND: message.args[1] }))] })
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
          if (err) client.logError(err)
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'CCMD::REMOVE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'CCMD::REMOVE:SUCCESS', { COMMAND: message.args[1] }))] })
        })
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
