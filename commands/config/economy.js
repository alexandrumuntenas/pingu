const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Status, Help } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  module: 'economy',
  name: 'economy',
  description: '⚙️ Configure the economy settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Configure the economy settings for your server.')
    .addSubcommand(subcommand => subcommand.setName('coinname').setDescription('Set the coin name').addStringOption(option => option.setName('coinname').setDescription('Enter the new coin name')))
    .addSubcommand(subcommand => subcommand.setName('coinicon').setDescription('Set the coin icon').addStringOption(option => option.setName('coinicon').setDescription('Enter the new coin icon'))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'coinname': {
        if (interaction.options.getString('coinname')) {
          client.pool.query('UPDATE `guildData` SET `economyCurrency` = ? WHERE `guild` = ?', [interaction.options.getString('coinname'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
            interaction.editReply({ embeds: [Success(getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: interaction.options.getString('coinname') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: interaction.database.economyCurrency }))] })
        }
        break
      }
      case 'coinicon': {
        if (interaction.options.getString('coinicon')) {
          client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [interaction.options.getString('coinicon'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
            interaction.editReply({ embeds: [Success(getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: interaction.options.getString('coinicon') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: interaction.database.economyCurrencyIcon }))] })
        }
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'setCurrency': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `economyCurrency` = ? WHERE `guild` = ?', [message.content.replace(`${message.database.guildPrefix}economy setCurrency `, ''), message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              message.reply({ embeds: [Success(getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: message.content.replace(`${message.database.guildPrefix}economy setCurrency `, '') }))] })
            })
          } else {
            message.reply({ embeds: [Status(getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: message.database.economyCurrency }))] })
          }
          break
        }
        case 'setCurrencyIcon': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              message.reply({ embeds: [Success(getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: message.args[1] }))] })
            })
          } else {
            message.reply({ embeds: [Status(getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: message.database.economyCurrencyIcon }))] })
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

const helpTray = Help('economy', 'Configure the economy module in your server', [{ option: 'setCurrency', description: 'Set the currency name', syntax: 'setCurrency <new currency>', isNsfw: false }, { option: 'setCurrencyIcon', description: 'Set the currency icon', syntax: 'setCurrencyIcon <:emoji:>', isNsfw: false }])
