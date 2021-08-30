const { MessageEmbed, Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'user-info',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const user = message.mentions.users.first() || message.member.user
        const member = message.guild.members.cache.get(user.id)
        /* const embed = new MessageEmbed()
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
              name: i18n.usertag,
              value: user.tag,
              inline: true
            },
            {
              name: i18n.userid,
              value: user.id,
              inline: true
            },
            {
              name: i18n.isabot,
              value: user.bot,
              inline: true
            },
            {
              name: i18n.hasnick,
              value: member.nickname || i18n.nonick,
              inline: true
            },
            {
              name: i18n.joinedguild,
              value: new Date(member.joinedTimestamp).toLocaleDateString(),
              inline: true
            },
            {
              name: i18n.joineddiscord,
              value: new Date(user.createdTimestamp).toLocaleDateString(),
              inline: true
            }
          ) */
        message.channel.send('This command is under construction :tools:')
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
