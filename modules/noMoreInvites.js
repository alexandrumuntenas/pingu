const { Permissions } = require('discord.js')
const makeId = require('./makeId')

module.exports = function (message, result, con) {
  if (!message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
    if (message.content.includes('discord.gg/' || 'discordapp.com/invite/')) { // if it contains an invite link
      message.delete()
      message.channel.send('<:pingu_cross:876104109256769546> **Los enlaces de invitación no están permitidos en este servidor**')

      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        if (result[0].moderator_noMoreInvites_enabled === 1) {
          switch (result[0].moderator_noMoreInvites_action) {
            case 1: {
              client.pool.query('INSERT INTO `guildWarns` (`identificador`,`user`, `guild`, `motivo`) VALUES (?, ?, ?, ?)', [makeId(7), message.member.id, message.guild.id, result[0].moderator_noMoreInvites_message || 'You have sent a link and it wasn\'t allowed'])
              message.channel.send(`:warning: ${message.member} Warned: \`${message || 'You have sent a link'}\``)
              break
            }
            case 2: {
              message.member.kick(message)
              break
            }
            case 3: {
              message.member.ban(message)
              break
            }
          }
        }
      }
    }
  }
}
