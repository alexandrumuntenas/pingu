const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'user-info',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.userinfo
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        const user = message.mentions.users.first() || message.member.user
        const member = message.guild.members.cache.get(user.id)
        const embed = new MessageEmbed()
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
              name: lan.usertag,
              value: user.tag,
              inline: true
            },
            {
              name: lan.userid,
              value: user.id,
              inline: true
            },
            {
              name: lan.isabot,
              value: user.bot,
              inline: true
            },
            {
              name: lan.hasnick,
              value: member.nickname || lan.nonick,
              inline: true
            },
            {
              name: lan.joinedguild,
              value: new Date(member.joinedTimestamp).toLocaleDateString(),
              inline: true
            },
            {
              name: lan.joineddiscord,
              value: new Date(user.createdTimestamp).toLocaleDateString(),
              inline: true
            }
          )
        message.channel.send(embed)
      } // ??
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
