module.exports = (client, guild, configuration, callback) => {
  const uGC = client.Sentry.startTransaction({
    op: 'updateGuildConfig',
    name: 'Update Guild Config'
  })
  if (typeof configuration === 'object' && !Array.isArray(configuration) && configuration !== null) {
    client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [configuration.column, configuration.value, guild.id], (err) => {
      uGC.finish()
      if (err) client.logError(err)
      if (err) return callback(err)
      return callback()
    })
  } else {
    throw new Error('Configuration parameter must be an Object with the following properties: column (column to update) and value (new value).')
  }
}
