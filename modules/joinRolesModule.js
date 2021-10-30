module.exports = {
  addJoinRole: (client, data, callback) => {
    const aJR = client.Sentry.startTransaction({
      op: 'joinRolesModule.addJoinRole',
      name: 'JoinRolesModule (Add Join Roles)'
    })
    client.pool.query('INSERT INTO `guildJoinRoles` (`guild`, `roleID`) VALUES (?, ?)', [data.guild.id, data.role.id], (err) => {
      if (err) client.Sentry.captureException(err)
      if (callback) callback()
      aJR.finish()
    })
  },
  removeJoinRole: (client, data, callback) => {
    const rJR = client.Sentry.startTransaction({
      op: 'joinRolesModule.removeJoinRole',
      name: 'JoinRolesModule (Remove Join Roles)'
    })
    client.pool.query('DELETE FROM `guildJoinRoles` WHERE `guild` = ? AND roleID = ?', [data.guild.id, data.role.id], (err) => {
      if (err) client.Sentry.captureException(err)
      if (callback) callback()
      rJR.finish()
    })
  },
  fetchJoinRoles: (client, guild, callback) => {
    client.pool.query('SELECT * FROM `guildJoinRoles` WHERE `guild` = ?', [guild.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows) {
        rows.forEach(r => console.log(r))
      }
    })
  }
}
