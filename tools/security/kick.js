const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'kick',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.kick_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const dataSplit = message.content.replace(`${result[0].guild_prefix}kick`, '').trim().split('|')
        // const beforeSeparator = message.content.replace(`${options.result.guild_prefix}${options.command}`, '').split(result[0].separator)
        const guilty = dataSplit[0] || message.content.replace(`${result[0].guild_prefix}kick`, '').trim()// Obtenemos los culpables de dataSplit
        const guiltyArray = guilty.trim().split('>').filter((object) => (object))
        if (guiltyArray.length) {
          const reason = dataSplit[1] || 'No reason specified' // Obtenemos el motivo de acción de dataSplit
          reason.trim()

          guiltyArray.forEach(user => {
            if (user.trim().startsWith('<@!')) {
              const resolvableUser = client.users.cache.get(user.trim().replace('<@!', ''))
              message.guild.members.kick(resolvableUser, { reason })
                .then(() => {
                  const sent = new MessageEmbed()
                    .setColor('#28A745')
                    .setAuthor(getLocales(locale, 'KICK_EMBED_SUCCESS_TITLE', { USER: resolvableUser.tag }), resolvableUser.displayAvatarURL())
                    .setDescription(getLocales(locale, 'KICK_EMBED_SUCCESS_REASON', { REASON: reason }))
                  message.channel.send({ embeds: [sent] })
                })
                .catch(err => {
                  if (err) console.log(err)
                  const sent = new MessageEmbed()
                    .setColor('#DC3545')
                    .setAuthor(getLocales(locale, 'KICK_EMBED_ERROR_TITLE', { USER: resolvableUser.tag }), resolvableUser.displayAvatarURL())
                    .setDescription(getLocales(locale, 'KICK_EMBED_SUCCESS_REASON', { REASON: reason }))
                  message.channel.send({ embeds: [sent] })
                })
            }
          })
        } else {
          genericMessages.Info.help(message, locale, `${result[0].guild_prefix}kick <@user> (@user2 @user3...) | (reason)`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
