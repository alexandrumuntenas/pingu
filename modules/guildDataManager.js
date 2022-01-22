/** @module GuildDataManager */

/**
 * Get the guild's configuration from the database.
 * @deprecated since 2202. Use next() instead.
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
 * Get the guild's configuration from the database.
 * @param {Client} client - The Bot Client
 * @param {Guild} guild - The guild
 * @param {Function} callback - The callback function
 * @returns Object - The guild configuration
 */

module.exports.getGuildConfigNext = (client, guild, callback) => {
  const gFD = client.console.sentry.startTransaction({
    op: 'getGuildConfig',
    name: 'Get Guild Configuration'
  })
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) client.logError(err)
    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      if (result[0].clientVersion === 'pingu@1.0.0') {
        module.exports.migrateGuildData(client, guild, () => {
          module.exports.getGuildConfigNext(client, guild, callback)
        })
      } else {
        Object.keys(result[0]).forEach((module) => {
          try {
            result[0][module] = JSON.parse(result[0][module])
          } catch (err) {
            if (err) return err
          }
        })
        callback(result[0])
      }
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
 * @deprecated Use next() instead
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
      if (callback) return callback()
    })
  } else {
    throw new Error('Configuration parameter must be an Object with the following properties: column (column to update) and value (new value).')
  }
}

/**
 * Update a guild's configuration.
 * @param {Client} client - The Bot Client
 * @param {Guild} guild - The Guild
 * @param {Object} botmodule - The module to update
 * @param {String} botmodule.column - The module configuration column to update
 * @param {JSON} botmodule.newconfig - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfigNext = (client, guild, botmodule, callback) => {
  module.exports.getGuildConfigNext(client, guild, (guildConfig) => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, botmodule.column)) {
      try {
        guildConfig[botmodule.column] = JSON.parse(guildConfig[botmodule.column])
      } catch (err) {
        if (err) {
          if (typeof botmodule.newconfig === 'object' && botmodule.newconfig !== null) {
            client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return callback(err)
              if (callback) return callback()
              else return null
            })
          } else {
            client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return callback(err)
              if (callback) return callback()
              else return null
            })
          }
        }
      } finally {
        if (guildConfig[botmodule.column]) {
          Object.keys(guildConfig[botmodule.column]).forEach((moduleProperty) => {
            if (botmodule.newconfig[moduleProperty]) {
              guildConfig[botmodule.column][moduleProperty] = botmodule.newconfig[moduleProperty]
            }
          })
          Object.keys(guildConfig).forEach(moduleConfig => {
            if (guildConfig[botmodule.column][moduleConfig] === null) {
              delete guildConfig[botmodule.column][moduleConfig]
            }
          })
          client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(guildConfig[botmodule.column]), guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return callback(err)
            if (callback) return callback()
            else return null
          })
        }
      }
    } else {
      throw new Error('The specified module does not exist.')
    }
  })
}

module.exports.migrateGuildData = (client, guild, callback) => {
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) client.logError(err)
    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      if (!result[0].clientVersion === 'pingu@1.0.0') return

      // Migrar configuraciones generales
      const general = { idioma: result[0].guildLanguage, prefijo: result[0].guildPrefix, interacciones: { habilitado: 1, desplegarComandosDeConfiguracion: result[0].guildViewCnfCmdsEnabled } }

      // Migrar módulo de bienvenidas
      const welcomer = { habilitado: result[0].welcomeEnabled, canal: result[0].welcomeChannel, mensaje: result[0].welcomeMessage, tarjeta: { habilitado: result[0].welcomeImage, fondo: result[0].welcomeImageCustomBackground, overlay: { color: result[0].welcomeImageCustomOverlayColor, opacidad: result[0].welcomeImageCustomOpacity } } }
      // Migrar módulo de despedidas
      const farewell = { habilitado: result[0].farewellEnabled, canal: result[0].farewellChannel, mensaje: result[0].farewellMessage }

      // Migrar módulo de niveles
      const levels = { habilitado: result[0].levelsEnabled, canal: result[0].levelsChannel, mensaje: result[0].levelsMessage, dificultad: result[0].levelsDifficulty, tarjeta: { fondo: result[0].levelsImageCustomBackground, overlay: { opacidad: result[0].levelsImageCutomOpacity, color: result[0].levelsImageCustomOverlayColor } } }

      // Migrar módulo de economía
      const economy = { habilitado: result[0].economyEnabled, moneda: { nombre: result[0].economyCurrency, icono: result[0].economyCurrencyIcon } }

      // Migrar módulo de sugerencias
      const suggestions = { habilitado: result[0].suggestionsEnabled, canales: { sugerenciasNoRevisadas: result[0].suggestionsChannel, sugerenciasRevisadas: result[0].suggestionsRevChannel } }

      // Migrar módulo de respuestas automáticas
      const autoresponder = { habilitado: result[0].autoresponderEnabled }

      // Migar módulo de comandos personalizados
      const customcommands = { habilitado: result[0].customcommandsEnabled }

      module.exports.updateGuildConfig(client, guild, { column: 'clientVersion', value: 'pingu@2.0.0' })
      module.exports.updateGuildConfigNext(client, guild, { column: 'general', newconfig: general })
      module.exports.updateGuildConfigNext(client, guild, { column: 'bienvenidas', newconfig: welcomer })
      module.exports.updateGuildConfigNext(client, guild, { column: 'despedidas', newconfig: farewell })
      module.exports.updateGuildConfigNext(client, guild, { column: 'niveles', newconfig: levels })
      module.exports.updateGuildConfigNext(client, guild, { column: 'economia', newconfig: economy })
      module.exports.updateGuildConfigNext(client, guild, { column: 'sugerencias', newconfig: suggestions })
      module.exports.updateGuildConfigNext(client, guild, { column: 'respuestasPersonalizadas', newconfig: autoresponder })
      module.exports.updateGuildConfigNext(client, guild, { column: 'comandosPersonalizados', newconfig: customcommands })
      if (callback) callback()
    } else {
      if (callback) callback()
    }
  })
}
