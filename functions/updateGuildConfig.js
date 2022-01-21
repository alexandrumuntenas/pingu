
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

module.exports = (client, guild, configuration, callback) => {
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

module.exports.new = () => {
  // TODO: Add a check to see if the module exists
  // TODO: Add a check to see if the newconfig includes all module properties
  // TODO: Add a check to see if the newconfig is valid
  // TODO: Update current config to new config without replacing the whole thing. (This will require a new function)
}
