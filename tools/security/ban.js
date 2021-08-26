module.exports = {
  name: 'ban',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.ban
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        let reason = message.content.replace(`${result[0].guild_prefix}ban `, '')
        const array = message.mentions.users.array()
        array.forEach(user => {
          reason = message.content.replace(`<@!${user.id}>`, '')
        })
        message.mentions.users.array().forEach(user => {
          message.guild.member(user)
            .ban({
              reason: reason
            })
            .then(() => {
              message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success} ${user.tag}`)
            })
            .catch(err => {
              if (err) console.log(err)
              message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.fail} ${user.tag}`)
            })
        })
      } else {
        message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_param}`)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
