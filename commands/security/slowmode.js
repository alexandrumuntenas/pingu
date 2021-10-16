const { Permissions, MessageEmbed } = require('discord.js')
const parse = require('parse-duration')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'slowmode',
  execute (client, locale, message) {
    if (message.database.moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        if (parse(message.args[0], 's')) {
          message.channel.setRateLimitPerUser(parse(message.args[0], 's'), 'Slowmode')
          const sent = new MessageEmbed().setColor('GREEN').setDescription(getLocales(locale, 'SLOWMODE', { SLOWMO: message.args[0] }))
          message.channel.send({ embeds: [sent] })
        } else {
          genericMessages.Info.help(message, locale, `${message.database.guildPrefix}slowmode <time s/m/h>`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
