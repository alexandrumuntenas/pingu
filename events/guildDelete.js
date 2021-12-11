module.exports = async (client, guild) => {
  const gD = client.Sentry.startTransaction({
    op: 'guildDelete',
    name: 'Guild Delete'
  });
  client.pool.query('DELETE FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
      gD.finish();
    }
  });
  client.pool.query('DELETE FROM `guildAutoResponder` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildEconomyProducts` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildEconomyUserBank` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildJoinRoles` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildLevelsData` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildLevelsRankupRoles` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
  client.pool.query('DELETE FROM `guildReactionRoles` WHERE guild = ?', [guild.id], (err) => {
    if (err) {
      client.Sentry.captureException(err);
      client.log.error(err);
    }
  });
};
