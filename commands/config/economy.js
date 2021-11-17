const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'economy',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'setCurrency': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyCurrency` = ? WHERE `guild` = ?', [message.content.replace(`${message.database.guildPrefix}economy setCurrency `, ''), message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: message.content.replace(`${message.database.guildPrefix}economy setCurrency `, '') }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: message.database.economyCurrency }))
            }
            break
          }
          case 'setCurrencyIcon': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: message.args[1] }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: message.database.economyCurrencyIcon }))
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
    } else {
      genericMessages.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guildPrefix}economy <option>\``, ['setCurrency <new currency>', 'setCurrencyIcon :emoji:'])
}
