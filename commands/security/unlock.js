const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'unlock',
  execute (client, locale, message) {
    if (message.database.moderationEnabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        message.channel.permissionOverwrites.create(message.channel.guild.roles.everyone, {
          SEND_MESSAGES: true
        }).then(() => {
          const sent = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`:unlock: ${getLocales(locale, 'UNLOCK', { CHANNEL: message.channel })}`)
          message.channel.send({ embeds: [sent] })
        })
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
