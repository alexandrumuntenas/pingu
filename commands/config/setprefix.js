const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'setprefix',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.success(message, getLocales(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.Info.help(message, locale, `${message.database.guildPrefix}setprefix <newprefix>`)
      }
    } else {
      genericMessages.error.permissionerror(message, locale)
    }
  }
}
