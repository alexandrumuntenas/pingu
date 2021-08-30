const { Permissions } = require('discord.js')
const makeId = require('../../modules/makeId')

module.exports = {
  name: 'warn',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.warn
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (result[0].moderator_enabled !== 0) {
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
              message.channel.send(`:warning: ${resolvableUser} ${i18n.success} \n${i18n.reason}: \`${reason}\``)
              if (cache.activado === 0) {
                if (parseInt(result[0].itotal) + 1 >= cache.cantidad) {
                  if (cache.accion !== 0) {
                    message.guild.members.ban(resolvableUser, { reason })
                      .then(() => {
                        message.channel.send(`:police_officer: ${i18n.automod.success.a} ${resolvableUser.tag} ${i18n.automod.success.b} ${i18n.automod.ban} ${i18n.automod.success.c} \`${cache.cantidad}\` ${i18n.automod.success.d}`)
                      })
                      .catch(err => {
                        console.log(err)
                        message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.automod.error.a} ${i18n.automod.ban} ${i18n.automod.error.b} (${resolvableUser.tag}) ${i18n.automod.error.c} \`${cache.cantidad}\` ${i18n.automod.error.d}`)
                      })
                  } else {
                    message.guild.members.kick(resolvableUser, { reason })
                      .then(() => {
                        message.channel.send(`:police_officer: ${i18n.automod.success.a} ${resolvableUser.tag} ${i18n.automod.success.b} ${i18n.automod.kick} ${i18n.automod.success.c} \`${cache.cantidad}\` ${i18n.automod.success.d}`)
                      })
                      .catch(err => {
                        console.log(err)
                        message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.automod.error.a} ${i18n.automod.kick} ${i18n.automod.error.b} (${resolvableUser.tag}) ${i18n.automod.error.c} \`${cache.cantidad}\` ${i18n.automod.error.d}`)
                      })
                  }
                }
              }
            })
          }
        })
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
