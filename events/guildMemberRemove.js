module.exports = (client, con, member) => {
  if (member.user.id !== client.user.id) {
    con.query('SELECT * FROM `guild_data` WHERE guild = ?', [member.guild.id], (err, result) => {
      if (err) console.log(err)
      if (result[0].farewell_enabled !== 0) {
        const mensaje = client.channels.cache.find(channel => channel.id === result[0].farewell_channel)
        if (mensaje) {
          mensaje.send(result[0].farewell_message.replace('{user}', `${member.user.tag}`).replace('{server}', `${member.guild.name}`))
        }
      }
      con.query('DELETE FROM `guild_levels` WHERE user = ? AND guild = ?', [member.user.id, member.guild.id])
      con.query('DELETE FROM `guild_warns` WHERE user = ? AND guild = ?', [member.user.id, member.guild.id])
    })
  }
}
