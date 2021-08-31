const makeId = require('./makeId')

module.exports = function (client, message, parameters) {
  if (parameters.actionToTake !== 0) {
    switch (parameters.actionToTake) {
      case 1: {
        client.pool.query('INSERT INTO `guildWarns` (`identificador`,`user`, `guild`, `motivo`) VALUES (?, ?, ?, ?)', [makeId(7), message.member.id, message.guild.id, parameters.messageToSend || 'Using NSFW command in SFW channel.'])
        message.channel.send(`:warning: ${message.member} Warned: \`${parameters.messageToSend || 'Using NSFW command in SFW channel.'}\``)
        break
      }
      case 2: {
        message.member.kick(parameters.messageToSend)
        break
      }
      case 3: {
        message.member.ban(parameters.messageToSend)
        break
      }
    }
  }
  message.delete()
}
