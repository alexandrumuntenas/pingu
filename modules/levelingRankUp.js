module.exports = function (result, client, con, message, global) {
  const cache = { canal_id: result[0].leveling_rankup_channel, canal_msg: result[0].leveling_rankup_message, aspecto: result[0].leveling_rankup_image_background, cartelactivado: result[0].leveling_rankup_image }
  const dif = result[0].leveling_rankup_difficulty
  con.query('SELECT * FROM `guild_levels` WHERE guild = ? AND user = ?', [message.guild.id, message.author.id], (err, result) => {
    if (err) console.log(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      let exp = parseInt(result[0].experiencia)
      let niv = parseInt(result[0].nivel)
      exp = exp + Math.round(Math.random() * (25 - 15) + 15)
      if (exp >= (((niv * niv) * dif) * 100)) {
        exp = exp - (((niv * niv) * dif) * 100)
        niv++
        const messageToSend = cache.canal_msg.replace('{user}', `<@${message.author.id}>`).replace('{nivel-antiguo}', `${niv - 1}`).replace('{nivel-nuevo}', `${niv}`)
        if (cache.canal_id !== '0') {
          const customChannel = client.channels.cache.find(channel => channel.id === cache.canal_id)
          if (customChannel) {
            customChannel.send(messageToSend)
          } else {
            message.channel.send(messageToSend)
          }
        } else {
          message.channel.send(messageToSend)
        }
      }
      con.query('UPDATE `guild_levels` SET `experiencia` = ?, `nivel` = ? WHERE `user` = ? AND `guild` = ?', [exp, niv, message.author.id, message.guild.id], (err) => { if (err) console.log(err) })
    } else {
      con.query('INSERT INTO `guild_levels` (`user`, `guild`, `experiencia`) VALUES (?, ?, ?)', [message.author.id, message.guild.id, Math.round(Math.random() * (25 - 15) + 15)])
    }
  })
}
