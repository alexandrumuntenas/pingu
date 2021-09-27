const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'setprefix',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        client.pool.query('UPDATE `guildData` SET `guild_prefix` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.Success(message, getLocales(locale, 'SETPREFIX_SUCCESS', { GUILD_PREFIX: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.Info.help(message, locale, `${message.database.guild_prefix}setprefix <newprefix>`)
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
