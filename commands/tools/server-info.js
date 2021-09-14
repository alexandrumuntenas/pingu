const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')
const unixTime = require('unix-time')

module.exports = {
  name: 'server-info',
  execute (client, locale, message, isInteraction) {
    const embed = new MessageEmbed()
      .setTitle(getLocales(locale, 'SERVER_INFO_EMBED_TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:credit_card: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_NAME', { GUILDNAME: message.guild.name })}\n:calendar: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_CREATED_TIMESTAMP', { GUILDCREATEDTIMESTAMP: `<t:${unixTime(message.guild.createdTimestamp)}>` })}\n:crown: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_OWNER', { USER: client.users.cache.get(message.guild.ownerId).tag })}\n<a:nitro_boost:868214436178046976> ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_BOOST', { GUILDBOOST: `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : getLocales(locale, 'SERVER_INFO_BOOST_NONE')} (${message.guild.premiumSubscriptionCount || '0'})` })}`)
      .setTimestamp()
    message.reply({ embeds: [embed] })
  }
}
