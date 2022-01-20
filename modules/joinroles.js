module.exports = {
  addJoinRole: (client, data, callback) => {
    const aJR = client.console.sentry.startTransaction({
      op: 'joinroles.addJoinRole',
      name: 'joinroles (Add Join Roles)'
    });
    client.pool.query('INSERT INTO `guildJoinRoles` (`guild`, `roleID`) VALUES (?, ?)', [data.guild.id, data.role.id], (err) => {
      if (err) client.logError(err);
      if (callback && err) callback(err);
      if (callback && !err) callback();
      aJR.finish();
    });
  },
  removeJoinRole: (client, data, callback) => {
    const rJR = client.console.sentry.startTransaction({
      op: 'joinroles.removeJoinRole',
      name: 'joinroles (Remove Join Roles)'
    });
    client.pool.query('DELETE FROM `guildJoinRoles` WHERE `guild` = ? AND roleID = ?', [data.guild.id, data.role.id], (err) => {
      if (err) client.logError(err);
      if (callback && err) callback(err);
      if (callback && !err) callback();
      rJR.finish();
    });
  },
  fetchJoinRoles: (client, guild, callback) => {
    client.pool.query('SELECT * FROM `guildJoinRoles` WHERE `guild` = ?', [guild.id], (err, rows) => {
      if (err) client.logError(err);
      if (rows && !err) {
        if (callback) callback(rows);
      } else if (callback) callback(err);
    });
  }
};
