const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

const avaliableLanguages = ['en', 'es']

module.exports = {
  name: 'setlanguage',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0] && avaliableLanguages.includes(message.args[0])) {
        client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.Success(message, getLocales(message.args[0], 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.Info.help(message, locale, `${message.database.guildPrefix}setlanguage <language>`, ['en', 'es', 'ro'])
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
