module.exports = {
  name: 'unlock',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.unlock
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
        SEND_MESSAGES: true
      }).then(() => {
        message.channel.send(`<:pingu_check:876104161794596964> ${lan.success}`)
      })
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
