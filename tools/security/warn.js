const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const makeId = require('../../modules/makeId')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'warn',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const dataSplit = message.content.replace(`${result[0].guild_prefix}warn`, '').trim().split('|')
        // const beforeSeparator = message.content.replace(`${options.result.guild_prefix}${options.command}`, '').split(result[0].separator)
        const guilty = dataSplit[0] || message.content.replace(`${result[0].guild_prefix}warn`, '').trim()// Obtenemos los culpables de dataSplit
        const guiltyArray = guilty.trim().split('>')

        const reason = dataSplit[1] || 'No reason specified' // Obtenemos el motivo de acción de dataSplit
        reason.trim()

        guiltyArray.forEach(user => {
          if (user.trim().startsWith('<@!')) {
            const resolvableUser = client.users.cache.get(user.trim().replace('<@!', '').trim())
            const cache = { activado: result[0].moderador_warn_expulsion_activado, cantidad: result[0].moderador_warn_expulsion_cantidad, accion: result[0].moderador_warn_expulsion_accion }
            con.query('SELECT COUNT(*) AS itotal FROM `guildWarns` WHERE user = ? AND guild = ?', [resolvableUser.id, message.guild.id], (err, result) => {
              if (err) console.log(err)
              con.query('INSERT INTO `guildWarns` (`identificador`,`user`, `guild`,`motivo`) VALUES (?, ?, ?, ?)', [makeId(7), resolvableUser.id, message.guild.id, reason])
              const sent = new MessageEmbed()
                .setColor('#FFC107')
                .setAuthor(getLocales(locale, 'WARN_EMBED_SUCCESS_TITLE', { USER: resolvableUser.tag }), resolvableUser.displayAvatarURL())
                .setDescription(getLocales(locale, 'WARN_EMBED_SUCCESS_REASON', { REASON: reason }))
              message.channel.send({ embeds: [sent] })
              if (cache.activado === 0) {
                if (parseInt(result[0].itotal) + 1 >= cache.cantidad) {
                  if (cache.accion !== 0) {
                    message.guild.members.ban(resolvableUser, { reason })
                      .then(() => {
                        const sent2 = new MessageEmbed()
                          .setColor('#28A745')
                          .setAuthor(getLocales(locale, 'WARNLIMIT_OVERLIMIT', { USER: resolvableUser.tag, ACTION: 'baneado' }), resolvableUser.displayAvatarURL())
                        message.channel.send({ embeds: [sent2] })
                      })
                      .catch(err => {
                        console.log(err)
                        const sent2 = new MessageEmbed()
                          .setColor('#DC3545')
                          .setAuthor(getLocales(locale, 'WARNLIMIT_OVERLIMIT_ERROR', { USER: resolvableUser.tag, ACTION: 'baneado' }), resolvableUser.displayAvatarURL())
                        message.channel.send({ embeds: [sent2] })
                      })
                  } else {
                    message.guild.members.kick(resolvableUser, { reason })
                      .then(() => {
                        const sent2 = new MessageEmbed()
                          .setColor('#28A745')
                          .setAuthor(getLocales(locale, 'WARNLIMIT_OVERLIMIT', { USER: resolvableUser.tag, ACTION: 'baneado' }), resolvableUser.displayAvatarURL())
                        message.channel.send({ embeds: [sent2] })
                      })
                      .catch(err => {
                        console.log(err)
                        const sent2 = new MessageEmbed()
                          .setColor('#DC3545')
                          .setAuthor(getLocales(locale, 'WARNLIMIT_OVERLIMIT_ERROR', { USER: resolvableUser.tag, ACTION: 'baneado' }), resolvableUser.displayAvatarURL())
                        message.channel.send({ embeds: [sent2] })
                      })
                  }
                }
              }
            })
          }
        })
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
