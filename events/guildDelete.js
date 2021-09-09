module.exports = (client, guild) => {
  const gD = client.Sentry.startTransaction({
    op: 'guildDelete',
    name: 'Guild Delete'
  })
  client.pool.query('DELETE FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) client.Sentry.captureException(err)
    client.pool.query('DELETE FROM `guildLevels` WHERE guild = ?', [guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    client.pool.query('DELETE FROM `guildWarns` WHERE guild = ?', [guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    client.pool.query('DELETE FROM `guildCustomCommands` WHERE guild = ?', [guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    client.pool.query('DELETE FROM `guildAutoResponder` WHERE guild = ?', [guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    gD.finish()
  })
}
