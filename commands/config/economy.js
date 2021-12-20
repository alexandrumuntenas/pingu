const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const messageBuilder = require('../../modules/constructor/messageBuilder')
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
            messageBuilder.success(interaction, getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: interaction.options.getString('coinname') }))
          })
        } else {
          messageBuilder.info.status(interaction, getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: interaction.database.economyCurrency }))
        }
        break
      }
      case 'coinicon': {
        if (interaction.options.getString('coinicon')) {
          client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [interaction.options.getString('coinicon'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
            messageBuilder.success(interaction, getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: interaction.options.getString('coinicon') }))
          })
        } else {
          messageBuilder.info.status(interaction, getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: interaction.database.economyCurrencyIcon }))
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
              messageBuilder.legacy.success(message, getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: message.content.replace(`${message.database.guildPrefix}economy setCurrency `, '') }))
            })
          } else {
            messageBuilder.legacy.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: message.database.economyCurrency }))
          }
          break
        }
        case 'setCurrencyIcon': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              messageBuilder.legacy.success(message, getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: message.args[1] }))
            })
          } else {
            messageBuilder.legacy.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: message.database.economyCurrencyIcon }))
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
  messageBuilder.legacy.Info.help(message, locale, `\`${message.database.guildPrefix}economy <option>\``, ['setCurrency <new currency>', 'setCurrencyIcon :emoji:'])
}
