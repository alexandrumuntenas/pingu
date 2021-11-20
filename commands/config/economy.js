const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 0,
  name: 'economy',
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'setCurrency': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyCurrency` = ? WHERE `guild` = ?', [message.content.replace(`${message.database.guildPrefix}economy setCurrency `, ''), message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: message.content.replace(`${message.database.guildPrefix}economy setCurrency `, '') }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: message.database.economyCurrency }))
            }
            break
          }
          case 'setCurrencyIcon': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyCurrencyIcon` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'ECONOMY_CURRENCYICON_SUCCESS', { CURRENCYICON: message.args[1] }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCYICON_NOARGS', { CURRENCYICON: message.database.economyCurrencyIcon }))
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
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `\`${message.database.guildPrefix}economy <option>\``, ['setCurrency <new currency>', 'setCurrencyIcon :emoji:'])
}
