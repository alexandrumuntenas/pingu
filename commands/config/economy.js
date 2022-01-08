const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const updateGuildConfig = require('../../functions/updateGuildConfig')

module.exports = {
  module: 'economy',
  name: 'economy',
  description: '⚙️ Configure the economy settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Configure the economy settings for your server.')
    .addSubcommand(subcommand => subcommand.setName('setcoinname').setDescription('Set the coin name').addStringOption(option => option.setName('coinname').setDescription('Enter the new coin name').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setcoinicon').setDescription('Set the coin icon').addStringOption(option => option.setName('coinicon').setDescription('Enter the new coin icon').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setcoinname': {
        updateGuildConfig(client, interaction.guild, { column: 'economyCurrency', value: interaction.options.getString('coinname') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ECONOMY::SETCOINNAME:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ECCONOMY::SETCOINNAME:SUCCESS', { CURRENCY: interaction.options.getString('coinname') }))] })
        })
        break
      }
      case 'setcoinicon': {
        updateGuildConfig(client, interaction.guild, { column: 'economyCurrencyIcon', value: interaction.options.getString('coinicon') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ECONOMY::SETCOINICON:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ECONOMY::SETCOINICON:SUCCESS', { CURRENCY: interaction.options.getString('coinicon') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('economy', i18n(locale, 'ECONOMY::HELPTRAY:DESCRIPTION'), [{ option: 'setcoinname', description: i18n(locale, 'ECONOMY::HELPTRAY:OPTION:SETCOINNAME'), syntax: 'setcoinname <new currency>', isNsfw: false }, { option: 'setcoinicon', description: i18n(locale, 'ECONOMY::HELPTRAY:OPTION:SETCOINICON'), syntax: 'setcoinicon <:emoji:>', isNsfw: false }])
    if (!Object.prototype.hasOwnProperty.call(message.args, [0, 1])) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'setcoinname': {
        updateGuildConfig(client, message.guild, { column: 'economyCurrency', value: message.content.replace(`${message.database.guildPrefix}economy setcoinname `, '') }, (err) => {
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'ECONOMY::SETCOINNAME:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'ECCONOMY::SETCOINNAME:SUCCESS', { CURRENCY: message.content.replace(`${message.database.guildPrefix}economy setcoinname `, '') }))] })
        })
        break
      }
      case 'setcoinicon': {
        updateGuildConfig(client, message.guild, { column: 'economyCurrency', value: message.args[1] }, (err) => {
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'ECONOMY::SETCOINICON:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'ECONOMY::SETCOINICON:SUCCESS', { CURRENCY: message.args[1] }))] })
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
