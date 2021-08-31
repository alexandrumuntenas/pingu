module.exports = (client, member) => {
  const gMR = client.Sentry.startTransaction({
    op: 'guildMemberRemove',
    name: 'Guild Member Remove'
  })
  if (member.user.id !== client.user.id) {
    client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [member.guild.id], (err, result) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      if (result[0].farewell_enabled !== 0) {
        const mensaje = client.channels.cache.find(channel => channel.id === result[0].farewell_channel)
        if (mensaje) {
          mensaje.send(result[0].farewell_message.replace('{user}', `${member.user.tag}`).replace('{server}', `${member.guild.name}`))
        }
      }
      client.pool.query('DELETE FROM `guildLevels` WHERE user = ? AND guild = ?', [member.user.id, member.guild.id])
      client.pool.query('DELETE FROM `guildWarns` WHERE user = ? AND guild = ?', [member.user.id, member.guild.id])
    })
  }
  gMR.finish()
}
