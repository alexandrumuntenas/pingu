module.exports = {
  name: 'guildDelete',
  execute: async (client, guild) => {
    const gD = client.console.sentry.startTransaction({
      op: 'guildDelete',
      name: 'Guild Delete'
    })
    const databaseTables = ['guildData', 'guildAutoResponder', 'guildEconomyProducts', 'guildJoinRoles', 'guildJoinRoles', 'memberData', 'guildLevelsRankupRoles', 'guildReactionRoles']
    databaseTables.forEach(table => {
      client.pool.query(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], (err) => {
        if (err) client.logError(err)
      })
    })
    gD.finish()
  }
}
