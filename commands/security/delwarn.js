const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'delwarn',
  execute (client, locale, message) {
    if (message.database.moderationEnabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        if (message.mentions.users.first()) {
          if (message.args[1]) {
            client.pool.query('SELECT * FROM guildWarns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, message.args[1]], (err, result) => {
              if (err) {
                client.Sentry.captureException(err)
                client.log.error(err)
              }
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                client.pool.query('DELETE FROM guildWarns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, message.args[1]])
                const sentTrue = new MessageEmbed().setColor('GREEN').setDescription(getLocales(locale, 'DELWARN_EMBED_SUCCESS', { WARNID: message.args[1], USER: message.mentions.users.first().tag }))
                message.channel.send({ embeds: [sentTrue] })
              } else {
                const sentTrue = new MessageEmbed().setColor('RED').setDescription(getLocales(locale, 'DELWARN_EMBED_USER_NO_HAS_WARN', { WARNID: message.args[1], USER: message.mentions.users.first().tag }))
                message.channel.send({ embeds: [sentTrue] })
              }
            })
          } else {
            genericMessages.Info.help(message, locale, `${message.database.guildPrefix}delwarn <@user> <warnID>`)
          }
        } else {
          genericMessages.Info.help(message, locale, `${message.database.guildPrefix}delwarn <@user> <warnID>`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
