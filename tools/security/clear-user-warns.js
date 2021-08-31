const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'clear-user-warns',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        if (message.mentions.users.first()) {
          const user = message.mentions.users.first()
          con.query('DELETE FROM `guildWarns` WHERE user = ? AND guild = ?', [message.mentions.users.first().id, message.guild.id], function (err) {
            if (err) console.log(err)
            const sent = new MessageEmbed().setColor('#28A745').setAuthor(getLocales(locale, 'CLEAR_USER_WARNS_EMBED_TITLE', { USER: user.tag }), user.displayAvatarURL())
            message.reply({ embeds: [sent] })
          })
        } else {
          genericMessages.Info.help(message, locale, `${result[0].guild_prefix}clear-user-warns <@user>`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
