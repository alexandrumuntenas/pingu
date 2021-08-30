const { Permissions } = require('discord.js')

module.exports = {
  name: 'unlock',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.unlock
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
        SEND_MESSAGES: true
      }).then(() => {
        message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success}`)
      })
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
