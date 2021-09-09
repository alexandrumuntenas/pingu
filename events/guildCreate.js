module.exports = (client, guild) => {
  const gC = client.Sentry.startTransaction({
    op: 'guildCreate',
    name: 'Guild Create'
  })
  const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0)
  client.pool.query('SELECT * FROM `guildData` WHERE `guild` LIKE ?', [guild.id], (err, result) => {
    if (err) client.Sentry.captureException(err)
    if (!Object.prototype.hasOwnProperty.call(result, 0)) {
      client.pool.query('INSERT INTO `guildData` (`guild`, `guild_prefix`,`guild_language`,`welcome_channel`,`welcome_message`,`farewell_channel`,`farewell_message`,`leveling_rankup_channel`,`leveling_rankup_message`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [guild.id, '!', 'es', chx.id, 'Bienvenido {user} a {server}', chx.id, '¡Adiós {user}!', chx.id, 'GG! {user} ha subido al nivel {nivel-nuevo}'], (err, result) => {
        if (err) client.Sentry.captureException(err)
      })
    }
  })
  gC.finish()
}
