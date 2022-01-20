const { Collection } = require('discord.js')

/**
 * Generate the command list of the guild
 * @param {Client} client - The Bot Client
 * @param {Array<GuildConfig>} guildConfig - The Guild Config
 * @param {Function} callback - The callback function
 * @returns Object - The command list
 */

module.exports = (client, guildConfig, callback) => {
  let welcome, joinroles, farewell, levels, economy, suggestions, bodyToSend
  if (guildConfig.welcomeEnabled !== 0) welcome = client.commands.filter(command => command.module === 'welcome') || []
  if (guildConfig.farewellEnabled !== 0) farewell = client.commands.filter(command => command.module === 'farewell') || []
  if (guildConfig.joinRolesEnabled !== 0) joinroles = client.commands.filter(command => command.module === 'joinroles') || []
  if (guildConfig.levelsEnabled !== 0) levels = client.commands.filter(command => command.module === 'levels') || []
  if (guildConfig.suggestionsEnabled !== 0) suggestions = client.commands.filter(command => command.module === 'suggestions') || []
  if (guildConfig.economyEnabled !== 0) economy = client.commands.filter(command => command.module === 'economy') || []
  const nomodule = client.commands.filter(command => !command.module)

  bodyToSend = new Collection().concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [], nomodule || [])

  if (guildConfig.guildViewCnfCmdsEnabled === 0) {
    bodyToSend = bodyToSend.filter(command => command.isConfigCommand === false)
  }

  if (callback) callback(bodyToSend.map(command => command.interactionData.toJSON()))
}
