/**
 * Do all the stuff that should be done when a member leaves the guild
 * @param {GuildMember} member
 */

const { getGuildConfig } = require('../functions/guildDataManager')

module.exports.doGuildMemberRemove = member => {
  getGuildConfig(member.guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'farewell') && Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'enabled')) {
      if (guildConfig.farewell.enabled) module.exports.sendFarewellMessage(member)
    }
  })
}

/**
 * Send the farewell message to the channel configured in the guild
 * @param {GuildMember} member
 */

const reemplazarPlaceholdersConDatosReales = require('../functions/reemplazarPlaceholdersConDatosReales')

module.exports.sendFarewellMessage = member => {
  getGuildConfig(member.guild, guildConfig => {
    if (!Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'channel')) return

    const channel = member.guild.channels.cache.get(guildConfig.farewell.channel)
    if (!channel) return

    channel.send(reemplazarPlaceholdersConDatosReales(guildConfig.farewell.message || '{member} left {server}!', member))
  })
}
