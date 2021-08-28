module.exports = {
  name: 'clear-user-warns',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.clearuserwarns
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          const user = message.mentions.users.first()
          con.query('DELETE FROM `guildWarns` WHERE user = ? AND guild = ?', [message.mentios.users.first().id, message.guild.id], function (err) {
            console.log(err)
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success} ${user}`)
          })
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.atleastoneuser}`)
        }
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
