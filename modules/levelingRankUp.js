module.exports = function (client, message) {
  client.pool.query('SELECT * FROM `guildLevels` WHERE guild = ? AND user = ?', [message.guild.id, message.author.id], (err, result) => {
    if (err) console.log(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      let exp = parseInt(result[0].experiencia)
      let niv = parseInt(result[0].nivel)
      const dif = parseInt(message.database.leveling_rankup_difficulty)
      exp = exp + Math.round(Math.random() * (25 - 15) + 15)
      if (exp >= (((niv * niv) * dif) * 100)) {
        exp = exp - (((niv * niv) * dif) * 100)
        niv++
        const messageToSend = message.database.leveling_rankup_message.replace('{user}', `<@${message.author.id}>`).replace('{nivel-antiguo}', `${niv - 1}`).replace('{nivel-nuevo}', `${niv}`)
        if (message.database.leveling_rankup_channel !== '0') {
          const customChannel = client.channels.cache.find(channel => channel.id === message.database.leveling_rankup_channel)
          if (customChannel) {
            customChannel.send(messageToSend)
          } else {
            message.channel.send(messageToSend)
          }
        } else {
          message.channel.send(messageToSend)
        }
      }
      client.pool.query('UPDATE `guildLevels` SET `experiencia` = ?, `nivel` = ? WHERE `user` = ? AND `guild` = ?', [exp, niv, message.author.id, message.guild.id], (err) => { if (err) console.log(err) })
    } else {
      client.pool.query('INSERT INTO `guildLevels` (`user`, `guild`, `experiencia`) VALUES (?, ?, ?)', [message.author.id, message.guild.id, Math.round(Math.random() * (25 - 15) + 15)])
    }
  })
}
