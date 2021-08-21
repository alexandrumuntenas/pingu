module.exports = {
  name: 'clear-user-warns',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.clearuserwarns
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          const user = message.mentions.users.first()
          con.query('DELETE FROM `guild_warns` WHERE user = ? AND guild = ?', [message.mentios.users.first().id, message.guild.id], function (err) {
            console.log(err)
            message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} ${user}`)
          })
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${lan.atleastoneuser}`)
        }
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
