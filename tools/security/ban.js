const { Permissions } = require('discord.js')
const { Success } = require('../../modules/embedSender')

module.exports = {
  name: 'ban',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.ban
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        const dataSplit = message.content.replace(`${result[0].guild_prefix}ban`, '').trim().split('|')
        // const beforeSeparator = message.content.replace(`${options.result.guild_prefix}${options.command}`, '').split(result[0].separator)
        const guilty = dataSplit[0] || message.content.replace(`${result[0].guild_prefix}ban`, '').trim()// Obtenemos los culpables de dataSplit
        const guiltyArray = guilty.trim().split('>')
        if (guiltyArray) {
          const reason = dataSplit[1] || 'No reason specified' // Obtenemos el motivo de acción de dataSplit
          reason.trim()

          guiltyArray.forEach(user => {
            if (user.trim().startsWith('<@!')) {
              const resolvableUser = client.users.cache.get(user.trim().replace('<@!', ''))
              message.guild.members.ban(resolvableUser, { reason })
                .then(() => {
                  message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success} ${resolvableUser.tag}`)
                })
                .catch(err => {
                  if (err) console.log(err)
                  message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.fail} ${resolvableUser.tag}`)
                })
            }
          })
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_param}`)
        }
      } else {
        message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${noavaliable}`)
    }
  }
}
