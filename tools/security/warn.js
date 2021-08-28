const makeId = require('../../gen/makeId')
module.exports = {
  name: 'warn',
  execute (con, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.warn
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        let warn = message.content
        message.mentions.users.array().forEach(user => {
          warn = warn.replace('<@!' + user.id + '>', '').replace('<@' + user.id + '>', '').replace(`${result[0].guild_prefix}warn`, '')
        })
        message.mentions.users.array().forEach(user => {
          const cache = { activado: result[0].moderador_warn_expulsion_activado, cantidad: result[0].moderador_warn_expulsion_cantidad, accion: result[0].moderador_warn_expulsion_accion }
          con.query('SELECT COUNT(*) AS itotal FROM `guildWarns` WHERE user = ? AND guild = ?', [user.id, message.guild.id], (err, result) => {
            if (err) console.log(err)
            con.query('INSERT INTO `guildWarns` (`identificador`,`user`, `guild`,`motivo`) VALUES (?, ?, ?, ?)', [makeId(7), user.id, message.guild.id, warn])
            if (warn.trim().length > 0) {
              message.channel.send(`:warning: ${user} ${i18n.success} \n${i18n.reason}: \`${warn.trim()}\``)
            } else {
              message.channel.send(`:warning: ${user} ${i18n.success}`)
            }
            const member = message.guild.member(user)
            if (cache.activado === 0) {
              if (parseInt(result[0].itotal) + 1 >= cache.cantidad) {
                if (cache.accion !== 0) {
                  member
                    .ban({
                      reason: i18n.automod.reason
                    })
                    .then(() => {
                      message.channel.send(`:police_officer: ${i18n.automod.success.a} ${user.tag} ${i18n.automod.success.b} ${i18n.automod.ban} ${i18n.automod.success.c} \`${cache.cantidad}\` ${i18n.automod.success.d}`)
                    })
                    .catch(err => {
                      console.log(err)
                      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.automod.error.a} ${i18n.automod.ban} ${i18n.automod.error.b} (${user.tag}) ${i18n.automod.error.c} \`${cache.cantidad}\` ${i18n.automod.error.d}`)
                    })
                } else {
                  member
                    .kick(i18n.automod.reason)
                    .then(() => {
                      message.channel.send(`:police_officer: ${i18n.automod.success.a} ${user.tag} ${i18n.automod.success.b} ${i18n.automod.kick} ${i18n.automod.success.c} \`${cache.cantidad}\` ${i18n.automod.success.d}`)
                    })
                    .catch(err => {
                      console.log(err)
                      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.automod.error.a} ${i18n.automod.kick} ${i18n.automod.error.b} (${user.tag}) ${i18n.automod.error.c} \`${cache.cantidad}\` ${i18n.automod.error.d}`)
                    })
                }
              }
            }
          })
        })
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
