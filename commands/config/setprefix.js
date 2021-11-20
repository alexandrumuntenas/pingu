const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 0,
  name: 'setprefix',
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.legacy.success(message, getLocales(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}setprefix <newprefix>`)
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}
