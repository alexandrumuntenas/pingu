const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'ban',
  execute (client, locale, message, isInteraction) {
    if (message.database.moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const dataSplit = message.content.replace(`${message.database.guild_prefix}ban`, '').trim().split('|')
        // const beforeSeparator = message.content.replace(`${options.result.guild_prefix}${options.command}`, '').split(message.database.separator)
        const guilty = dataSplit[0] || message.content.replace(`${message.database.guild_prefix}ban`, '').trim()// Obtenemos los culpables de dataSplit
        const guiltyArray = guilty.trim().split('>').filter((object) => (object))
        if (guiltyArray.length) {
          const reason = dataSplit[1] || 'No reason specified' // Obtenemos el motivo de acción de dataSplit
          reason.trim()

          guiltyArray.forEach(user => {
            if (user.trim().startsWith('<@!')) {
              const resolvableUser = client.users.cache.get(user.trim().replace('<@!', ''))
              message.guild.members.ban(resolvableUser, { reason })
                .then(() => {
                  const sent = new MessageEmbed()
                    .setColor('#28A745')
                    .setAuthor(getLocales(locale, 'BAN_EMBED_SUCCESS_TITLE', { USER: resolvableUser.tag }), resolvableUser.displayAvatarURL())
                    .setDescription(getLocales(locale, 'BAN_EMBED_SUCCESS_REASON', { REASON: reason }))
                  message.channel.send({ embeds: [sent] })
                })
                .catch(err => {
                  if (err) {
                    client.Sentry.captureException(err)
                    client.log.error(err)
                  }
                  const sent = new MessageEmbed()
                    .setColor('#DC3545')
                    .setAuthor(getLocales(locale, 'BAN_EMBED_ERROR_TITLE', { USER: resolvableUser.tag }), resolvableUser.displayAvatarURL())
                    .setDescription(getLocales(locale, 'BAN_EMBED_SUCCESS_REASON', { REASON: reason }))
                  message.channel.send({ embeds: [sent] })
                })
            }
          })
        } else {
          genericMessages.Info.help(message, locale, `${message.database.guild_prefix}ban <@user> (@user2 @user3...) | (reason)`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
