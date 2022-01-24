module.exports = (client, guild, callback) => {
  const gFD = client.console.sentry.startTransaction({
    op: "getGuildConfig",
    name: "Get Guild Configuration",
  });
  client.pool.query(
    "SELECT * FROM `guildData` WHERE guild = ?",
    [guild.id],
    (err, result) => {
      if (err) client.logError(err);
      if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
        callback(result[0]);
      } else {
        const chx =
          guild.channels.cache
            .filter((chx) => chx.type === "GUILD_TEXT")
            .find((x) => x.position === 0) || 0;
        client.pool.query(
          "INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)",
          [guild.id, chx.id, chx.id, chx.id],
          (err) => {
            if (err) {
              client.logError(err);
              client.console.error(err);
            }
            gFD.finish();
            module.exports(client, guild, callback);
          }
        );
      }
    }
  );
};
