/**
 * Do all the stuff that should be done when a member leaves the guild
 * @param {GuildMember} member
 */

const { getGuildConfigNext } = require('../functions/guildDataManager')

module.exports.doGuildMemberRemove = member => {
  getGuildConfigNext(member.guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'farewell') && Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'enabled')) {
      if (guildConfig.farewell.enabled) {
        this.sendFarewellMessage(member)
      }
    }
  })
}

/**
 * Send the farewell message to the channel configured in the guild
 * @param {GuildMember} member
 */

module.exports.sendFarewellMessage = member => {
  getGuildConfigNext(member.guild, guildConfig => {
    if (!Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'channel')) {
      return
    }

    const channel = member.guild.channels.cache.get(guildConfig.farewell.channel)
    if (!channel) {
      return
    }

    channel.send(replaceBracePlaceholdersWithActualData(guildConfig.farewell.message || '{member} left {server}!', member))
  })
}
/**
 * Replace in the farewell message all the brace placeholders with the actual data.
 * Known placeholders: {member} GuildMember, {guild} Guild name
 * @param {String} message
 * @param {GuildMember} member
 */

function replaceBracePlaceholdersWithActualData (message, member) {
  return message.replace('{member}', `<@${member.user.id}>`).replace('{guild}', `${member.guild.name}`)
}
