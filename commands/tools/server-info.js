const { MessageEmbed } = require('discord.js')
const getLocales = require('../../i18n/getLocales')
const unixTime = require('unix-time')

module.exports = {
  name: 'server-info',
  description: '👑 Shows information about the server',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    const embed = new MessageEmbed()
      .setTitle(getLocales(locale, 'SERVER_INFO_EMBED_TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`:credit_card: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_NAME', { GUILDNAME: interaction.guild.name })}\n:calendar: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_CREATED_TIMESTAMP', { GUILDCREATEDTIMESTAMP: `<t:${unixTime(interaction.guild.createdTimestamp)}>` })}\n:crown: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_OWNER', { USER: client.users.cache.get(interaction.guild.ownerId).tag })}\n<a:nitro_boost:868214436178046976> ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_BOOST', { GUILDBOOST: `${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : getLocales(locale, 'SERVER_INFO_BOOST_NONE')} (${interaction.guild.premiumSubscriptionCount || '0'})` })}`)
      .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
      .setTimestamp()
    interaction.editReply({ embeds: [embed] })
  },
  executeLegacy (client, locale, message) {
    const embed = new MessageEmbed()
      .setTitle(getLocales(locale, 'SERVER_INFO_EMBED_TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:credit_card: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_NAME', { GUILDNAME: message.guild.name })}\n:calendar: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_CREATED_TIMESTAMP', { GUILDCREATEDTIMESTAMP: `<t:${unixTime(message.guild.createdTimestamp)}>` })}\n:crown: ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_OWNER', { USER: client.users.cache.get(message.guild.ownerId).tag })}\n<a:nitro_boost:868214436178046976> ${getLocales(locale, 'SERVER_INFO_EMBED_GUILD_BOOST', { GUILDBOOST: `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : getLocales(locale, 'SERVER_INFO_BOOST_NONE')} (${message.guild.premiumSubscriptionCount || '0'})` })}`)
      .setTimestamp()
    message.reply({ embeds: [embed] })
  }
}
