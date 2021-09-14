const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'i18n',
  execute (client, locale, message, isInteraction) {
    if (message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || message.guild.ownerId === message.author.id) {
      const languages = ['en', 'es', 'ro']
      if (message.args[0]) {
        if (languages.includes(message.args[0])) {
          client.pool.query('UPDATE `guildData` SET `guild_language` = ? WHERE `guildData`.`guild` = ?', [message.args[0], message.guild.id])
        } else {
          message.reply('The language you specified is not in our database.')
        }
      } else {
        message.reply('You must supply an language code. Avaliable: `es`,`en`,`ro`. :warning: Case Sensitive Input')
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
