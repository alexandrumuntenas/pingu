const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

const avaliableLanguages = ['en', 'es']

module.exports = {
  cooldown: 0,
  name: 'setlanguage',
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0] && avaliableLanguages.includes(message.args[0])) {
        client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.legacy.success(message, getLocales(message.args[0], 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}setlanguage <language>`, ['en', 'es'])
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}
