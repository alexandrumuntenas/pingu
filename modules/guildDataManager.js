/** @module GuildDataManager */

/**
 * Get the guild's configuration from the database.
 * @param {Client} client - The Bot Client
 * @param {Guild} guild - The guild
 * @param {Function} callback - The callback function
 * @returns Object - The guild configuration
 */

module.exports.getGuildConfig = (client, guild, callback) => {
  const gFD = client.console.sentry.startTransaction({
    op: 'getGuildConfig',
    name: 'Get Guild Configuration'
  })
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) client.logError(err)
    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      callback(result[0])
    } else {
      const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0) || 0
      client.pool.query('INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)', [guild.id, chx.id, chx.id, chx.id], (err) => {
        if (err) {
          client.logError(err)
          client.console.error(err)
        }
        gFD.finish()
        module.exports(client, guild, callback)
      })
    }
  })
}

/**
 * @deprecated Use new() instead
 * Update a guild's configuration.
 * @param {Client} client - The Bot Client
 * @param {Guild} guild - The Guild
 * @param {Object} configuration - The configuration to update
 * @param {String} configuration.column - The configuration column to update
 * @param {String} configuration.value - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfig = (client, guild, configuration, callback) => {
  const uGC = client.console.sentry.startTransaction({
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

/**
 * Update a guild's configuration.
 * @param {Client} client - The Bot Client
 * @param {Guild} guild - The Guild
 * @param {Object} module - The module to update
 * @param {String} module.column - The module configuration column to update
 * @param {JSON} module.newconfig - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfig.next = () => {
  // TODO: Add a check to see if the module exists
  // TODO: Add a check to see if the newconfig includes all module properties
  // TODO: Add a check to see if the newconfig is valid
  // TODO: Update current config to new config without replacing the whole thing. (This will require a new function)
}
