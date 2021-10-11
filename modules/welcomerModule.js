module.exports = {
  fetchConfig: (client, guild, callback) => {
    client.pool.query('SELECT * FROM `guildWelcomerConfig` WHERE guild = ?', [guild.id], (err, result) => {
      if (err) client.Sentry.captureException(err)
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        callback(result[0])
      } else {
        const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0)
        client.pool.query('INSERT INTO `guildWelcomerConfig` (`guild`, `welcomeChannel`) VALUES (?, ?)', [guild.id, chx.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          callback()
        })
      }
    })
  }
}
