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

module.exports.getGuildConfig = (guild, callback) => {
  Database.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) Consolex.handleError(err)

    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      Object.keys(result[0]).forEach(module => {
        try {
          result[0][module] = JSON.parse(result[0][module])
        } catch (err2) {
          if (!err2.constructor.name === 'SyntaxError') Consolex.handleError(err2)
        }
      })

      if (callback) callback(result[0] || {})
    } else {
      //! Será eliminado en la actualización de junio.
      const topChannel = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').find(x => x.position === 0) || 0
      Database.query('INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)', [guild.id, topChannel.id, topChannel.id, topChannel.id], err2 => {
        if (err2) Consolex.handleError(err2)

        return module.exports.getGuildConfig(guild, callback)
      })
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
  if (newconfig instanceof Object === false) callback(newconfig)
  else {
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
}

/**
 * Update a guild's configuration.

 * @param {Guild} guild - The Guild
 * @param {Object} botmodule - The module to update
 * @param {String} botmodule.column - The module configuration column to update
 * @param {JSON} botmodule.newconfig - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfig = (guild, botmodule, callback) => {
  module.exports.getGuildConfig(guild, guildConfig => {
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
            return callback(err)
          }

          if (callback) {
            return callback()
          }

          return null
        })
      }
    } else throw new Error('The specified module does not exist.')
  })
}

/**
 * Deploy the interactions to the guild
 * @param {Guild} guild - The Guild
 * @param {Function} callback - The callback function
 * @returns Object - The command list
 */

const rest = new REST({ version: '9' })

if (process.env.ENTORNO === 'desarrollo') rest.setToken(process.env.INSIDER_TOKEN)
else rest.setToken(process.env.PUBLIC_TOKEN)

const { Collection } = require('discord.js')

/**
 * Create the interaction list for the requested guild using it's configuration as a base
 * @param {Object} guildConfig
 * @param {Boolean} deployConfigInteractions
 * @param {Function} callback
 * @returns {Object} The interaction list
 */

function createTheInteractionListOfTheGuild (guildConfig, deployConfigInteractions, callback) {
  if (!callback) throw new Error('Callback function is required')

  let interactionList = new Collection()

  if (guildConfig.welcome.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'welcome') || [])

  if (guildConfig.farewell.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'farewell') || [])

  if (guildConfig.leveling.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'leveling') || [])

  if (guildConfig.suggestions.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'suggestions') || [])

  if (guildConfig.customcommands.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'customcommands') || [])

  if (guildConfig.autoreplies.enabled !== 0) interactionList = interactionList.concat(process.Client.commands.filter(command => command.module === 'autoreplies') || [])

  interactionList = interactionList.concat(process.Client.commands.filter(command => !command.module) || [])

  if (!deployConfigInteractions) interactionList = interactionList.filter(command => !command.isConfigurationCommand)

  callback(interactionList.map(command => command.interactionData.toJSON()))
}

/**
 * Deploy the interactions to the guild.
 * @param {Guild} guild
 * @param {Boolean} deployConfigInteractions
 * @param {Function} callback
 */

module.exports.deployGuildInteractions = (guild, deployConfigInteractions, callback) => {
  if (!callback) throw new Error('Callback is required')

  module.exports.getGuildConfig(guild, guildConfig => {
    createTheInteractionListOfTheGuild(guildConfig, deployConfigInteractions, guildInteractionList => {
      rest.put(
        Routes.applicationGuildCommands(process.Client.user.id, guild.id), { body: guildInteractionList })
        .catch(err => {
          if (err) return callback(err)
          return callback()
        }).then(() => { callback() })
    })
  })
}

/**
 * Remove all the guild related data from Pingu database.
 * @param {Guild} guild - The Guild
 */

module.exports.deleteGuildData = guild => {
  const databaseTables = ['guildData', 'guildAutoReply', 'guildCustomCommands', 'memberData', 'guildLevelsRankupRoles', 'guildReactionRoles', 'guildSuggestions']
  databaseTables.forEach(table => {
    Database.query(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], err => {
      if (err) Consolex.handleError(err)
    })
  })
}
