const { MessageEmbed, Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const unixTime = require('unix-time')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'user-info',
  execute (client, locale, message) {
    if (message.database.moderationEnabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const user = message.mentions.users.first() || message.author
        const member = message.guild.members.cache.get(user.id)
        const sent = new MessageEmbed()
          .setAuthor(user.tag, user.displayAvatarURL())
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_TAG'), user.tag)
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_ID'), user.id)
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_BOT'), user.bot || getLocales(locale, 'USER_INFO_EMBED_USER_NOBOT'))
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_NICK'), member.nickname || getLocales(locale, 'USER_INFO_EMBED_USER_NONICK'))
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_JOINEDGUILD'), `<t:${unixTime(member.joinedTimestamp)}>`)
          .addField(getLocales(locale, 'USER_INFO_EMBED_USER_JOINEDDISCORD'), `<t:${unixTime(user.createdTimestamp)}>`)
        message.channel.send({ embeds: [sent] })
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
