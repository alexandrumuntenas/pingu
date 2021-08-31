const makeId = require('./makeId')

module.exports = function (action, message, messageDiscord, con) {
  if (action !== 0) {
    switch (action) {
      case 1: {
        con.query('INSERT INTO `guildWarns` (`identificador`,`user`, `guild`, `motivo`) VALUES (?, ?, ?, ?)', [makeId(7), messageDiscord.member.id, messageDiscord.guild.id, message || 'Using NSFW command in SFW channel.'])
        messageDiscord.channel.send(`:warning: ${messageDiscord.member} Warned: \`${message || 'Using NSFW command in SFW channel.'}\``)
        break
      }
      case 2: {
        messageDiscord.member.kick(message)
        break
      }
      case 3: {
        messageDiscord.member.ban(message)
        break
      }
    }
  }
  messageDiscord.delete()
}
