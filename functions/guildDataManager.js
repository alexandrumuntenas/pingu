/** @module GuildDataManager */

const Database = require('./databaseConnection')
const Consolex = require('./consolex')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

/**
 * Get the guild's configuration from the database.
 * @param {Guild} guild - The guild
 * @param {Function} callback - The callback function
 * @returns Object - The guild configuration
 */

module.exports.getGuildConfigNext = (guild, callback) => {
  const gFD = Consolex.Sentry.startTransaction({
    op: 'getGuildConfig',
    name: 'Get Guild Configuration'
  })
  Database.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) {
      Consolex.handleError(err)
    }

    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      if (result[0].clientVersion === 'pingu@1.0.0') {
        module.exports.migrateGuildData(guild, () => module.exports.getGuildConfigNext(guild, callback))
      } else {
        Object.keys(result[0]).forEach(module => {
          try {
            result[0][module] = JSON.parse(result[0][module])
          } catch (err) {
            if (err) {
              return err
            }
          }
        })
        callback(result[0])
      }
    } else {
      const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0) || 0
      Database.query('INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)', [guild.id, chx.id, chx.id, chx.id], err => {
        if (err) {
          Consolex.handleError(err)
          Consolex.error(err)
        }

        gFD.finish()
        module.exports.getGuildConfigNext(guild, callback)
      })
    }
  })
}

/**
 * @deprecated Use ·Next() instead
 * Update a guild's configuration.
 * @param {Guild} guild - The Guild
 * @param {Object} configuration - The configuration to update
 * @param {String} configuration.column - The configuration column to update
 * @param {String} configuration.value - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfig = (guild, configuration, callback) => {
  const uGC = Consolex.Sentry.startTransaction({
    op: 'updateGuildConfig',
    name: 'Update Guild Config'
  })
  if (typeof configuration === 'object' && !Array.isArray(configuration) && configuration !== null) {
    Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [configuration.column, configuration.value, guild.id], err => {
      uGC.finish()
      if (err) {
        Consolex.handleError(err)
      }

      if (err) {
        return callback(err)
      }

      if (callback) {
        return callback()
      }
    })
  } else {
    throw new Error('Configuration parameter must be an Object with the following properties: column (column to update) and value (new value).')
  }
}

/**
 * Update a guild's configuration.

 * @param {Guild} guild - The Guild
 * @param {Object} botmodule - The module to update
 * @param {String} botmodule.column - The module configuration column to update
 * @param {JSON} botmodule.newconfig - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfigNext = (guild, botmodule, callback) => {
  module.exports.getGuildConfigNext(guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, botmodule.column)) {
      if (typeof guildConfig[botmodule.column] === 'object' && !Array.isArray(guildConfig[botmodule.column]) && guildConfig[botmodule.column] !== null) {
        procesarObjetosdeConfiguracion(guildConfig[botmodule.column], botmodule.newconfig, newModuleConfig => {
          guildConfig[botmodule.column] = newModuleConfig
          Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(guildConfig[botmodule.column]), guild.id], err => {
            if (err) {
              Consolex.handleError(err)
              return callback(err)
            }

            if (callback) {
              return callback()
            }

            return null
          })
        })
      } else if (typeof botmodule.newconfig === 'object' && botmodule.newconfig !== null) {
        Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id], err => {
          if (err) {
            Consolex.handleError(err)
            return callback(err)
          }

          if (callback) {
            return callback()
          }

          return null
        })
      } else {
        Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id], err => {
          if (err) {
            Consolex.handleError(err)
          }

          if (err) {
            return callback(err)
          }

          if (callback) {
            return callback()
          }

          return null
        })
      }
    } else {
      throw new Error('The specified module does not exist.')
    }
  })
}

/**
 *
 * @param {*} config
 * @param {*} newconfig
 * @param {*} callback
 */

function procesarObjetosdeConfiguracion (config, newconfig, callback) {
  let count = 0
  const newConfigProperties = Object.keys(newconfig)
  newConfigProperties.forEach(property => {
    if (Object.prototype.hasOwnProperty.call(config, property) && typeof newconfig[property] === 'object') {
      procesarObjetosdeConfiguracion(config[property], newconfig[property], newConfig => {
        config[property] = newConfig
        count += 1
      })
    } else {
      config[property] = newconfig[property]
      count += 1
    }

    if (count === newConfigProperties.length) {
      callback(config)
    }
  })
}

module.exports.migrateGuildData = (guild, callback) => {
  Database.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) {
      Consolex.handleError(err)
    }

    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      if (!result[0].clientVersion === 'pingu@1.0.0') {
        return
      }

      const BoolRelation = { 0: false, 1: true }

      // Migrar configuraciones generales
      const general = { language: result[0].guildLanguage, prefix: result[0].guildPrefix, interactions: { enabled: BoolRelation['1'], deployConfigInteractions: result[0].guildViewCnfCmdsEnabled } }

      // Migrar módulo de bienvenidas
      const welcomer = {
        enabled: BoolRelation[result[0].welcomeEnabled], channel: result[0].welcomeChannel, message: result[0].welcomeMessage, welcomecard: { enabled: BoolRelation[result[0].welcomeImage], background: result[0].welcomeImageCustomBackground, overlay: { color: result[0].welcomeImageCustomOverlayColor, opacity: result[0].welcomeImageCustomOpacity } }
      }
      // Migrar módulo de despedidas
      const farewell = { enabled: BoolRelation[result[0].farewellEnabled], channel: result[0].farewellChannel, message: result[0].farewellMessage }

      // Migrar módulo de niveles
      const levels = {
        enabled: BoolRelation[result[0].levelsEnabled], channel: result[0].levelsChannel, message: result[0].levelsMessage, difficulty: result[0].levelsDifficulty, card: { background: result[0].levelsImageCustomBackground, overlay: { opacity: result[0].levelsImageCutomOpacity, color: result[0].levelsImageCustomOverlayColor } }
      }

      // Migrar módulo de sugerencias
      const suggestions = { enabled: BoolRelation[result[0].suggestionsEnabled], channels: { suggestionsNotRevised: result[0].suggestionsChannel, suggestionsRevised: result[0].suggestionsRevChannel } }

      // Migrar módulo de respuestas automáticas
      const autoresponder = { enabled: BoolRelation[result[0].autoresponderEnabled] }

      // Migar módulo de comandos personalizados
      const customcommands = { enabled: BoolRelation[result[0].customcommandsEnabled] }

      module.exports.updateGuildConfig(guild, { column: 'clientVersion', value: 'pingu@2.0.0' })
      module.exports.updateGuildConfigNext(guild, { column: 'common', newconfig: general })
      module.exports.updateGuildConfigNext(guild, { column: 'welcome', newconfig: welcomer })
      module.exports.updateGuildConfigNext(guild, { column: 'farewell', newconfig: farewell })
      module.exports.updateGuildConfigNext(guild, { column: 'leveling', newconfig: levels })
      module.exports.updateGuildConfigNext(guild, { column: 'suggestions', newconfig: suggestions })
      module.exports.updateGuildConfigNext(guild, { column: 'autoreplies', newconfig: autoresponder })
      module.exports.updateGuildConfigNext(guild, { column: 'customcommands', newconfig: customcommands })
      if (callback) {
        callback()
      }
    } else if (callback) {
      callback()
    }
  })
}

/**
 * Deploy the interactions to the guild
 * @param {Guild} guild - The Guild
 * @param {Function} callback - The callback function
 * @returns Object - The command list
 */

const rest = new REST({ version: '9' })

if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN)
} else {
  rest.setToken(process.env.PUBLIC_TOKEN)
}

/**
 * Deploy the interactions to the guild.
 * @param {Guild} guild
 * @param {Boolean} deployConfigInteractions
 * @param {Function} callback
 */

module.exports.deployGuildInteractions = (guild, deployConfigInteractions, callback) => {
  if (!callback) {
    throw new Error('Callback is required')
  }

  module.exports.getGuildConfigNext(guild, guildConfig => {
    createTheInteractionListOfTheGuild(guildConfig, deployConfigInteractions, guildInteractionList => {
      rest
        .put(
          Routes.applicationGuildCommands(
            process.Client.user.id,
            guild.id
          ),
          { body: guildInteractionList }
        ).catch(err => {
          if (err) {
            return callback(err)
          }
        }).then(() => {
          callback()
        })
    })
  })
}

const { Collection } = require('discord.js')

function createTheInteractionListOfTheGuild (guildConfig, deployConfigInteractions, callback) {
  if (!callback) {
    throw new Error('Callback function is required')
  }

  let interactionList = new Collection()
  if (guildConfig.welcome.enabled !== 0) {
    interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'welcome') || [])
  }

  if (guildConfig.farewell.enabled !== 0) {
    interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'farewell') || [])
  }

  if (guildConfig.leveling.enabled !== 0) {
    interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'leveling') || [])
  }

  if (guildConfig.suggestions.enabled !== 0) {
    interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'suggestions') || [])
  }

  if (guildConfig.customcommands.enabled !== 0) {
    interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'customcommands') || [])
  }

  interactionList = interactionList.concat(process.Client.commands.filter(command => !command.module) || [])

  if (!deployConfigInteractions) {
    interactionList = interactionList.filter(command => !command.isConfigurationCommand)
  }

  callback(interactionList.map(command => command.interactionData.toJSON()))
}

/**
 * Remove all the guild related data from Pingu database.
 * @param {Guild} guild - The Guild
 */

module.exports.deleteGuildData = guild => {
  const databaseTables = ['guildData', 'guildAutoReply', 'guildCustomCommands', 'memberData', 'guildLevelsRankupRoles', 'guildReactionRoles', 'guildSuggestions']
  databaseTables.forEach(table => {
    Database.query(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], err => {
      if (err) {
        Consolex.handleError(err)
      }
    })
  })
}
