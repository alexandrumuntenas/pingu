const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

const avaliableLanguages = ['en', 'es', 'ro']

module.exports = {
  name: 'setlanguage',
  execute (client, locale, message, isInteraction) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0] && avaliableLanguages.includes(message.args[0])) {
        client.pool.query('UPDATE `guildData` SET `guild_language` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.Success(message, getLocales(message.args[0], 'SETLANGUAGE_SUCCESS', { GUILD_LANGUAGE: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.Info.help(message, locale, `${message.database.guild_prefix}setlanguages <language>`, ['en', 'es', 'ro'])
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
