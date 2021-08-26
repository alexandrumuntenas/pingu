const parse = require('parse-duration')

module.exports = {
  name: 'slowmode',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.security.slowmode
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (args[1]) {
          const timeslowmo1 = message.content.replace(`${result[0].guild_prefix}slowmode `, '')
          message.channel.setRateLimitPerUser(parse(timeslowmo1, 's'), 'Slowmode')
          message.channel.send(`:clock1: ${i18n.success} **${timeslowmo1}**`)
        } // ??
      } else {
        message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_args}`)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
