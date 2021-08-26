const { poll } = require('discord.js-poll')

module.exports = {
  name: 'poll',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.functions.qpoll
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (Object.prototype.hasOwnProperty.call(args, 0)) {
        poll(message, args, '/', '#965E89')
      } else {
        message.channel.send(`**USAGE**: \n__You can create multiple answer polls__ ${result[0].guild_prefix}poll What's Your Favorite Color? / Blue / Red / Yellow\n __Or yes/no polls__ ${result[0].guild_prefix}poll Do you like Pingu?`)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
