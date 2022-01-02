const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const unixTime = require('unix-time')

module.exports = {
  name: 'server',
  description: '👑 Shows information about the server',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    const embed = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER::EMBED:TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`:medal: **${i18n(locale, 'SERVER::EMBED:SERVERNAME')}**: ${interaction.guild.name}\n:calendar: **${i18n(locale, 'SERVER::EMBED:SERVERCREATIONDATE')}**: <t:${unixTime(interaction.guild.createdTimestamp)}>\n:crown: **${i18n(locale, 'SERVER::EMBED:SERVEROWNER')}**: ${client.users.cache.get(interaction.guild.ownerId).tag}\n<a:nitro:927222194034053161> **${i18n(locale, 'SERVER::EMBED:NITROSTATUS')}**: ${interaction.guild.premiumTier} (${interaction.guild.premiumSubscriptionCount || '0'})`)
      .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
      .setTimestamp()
    interaction.editReply({ embeds: [embed] })
  },
  executeLegacy (client, locale, message) {
    const embed = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER_INFO_EMBED_TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:credit_card: ${i18n(locale, 'SERVER_INFO_EMBED_GUILD_NAME', { GUILDNAME: message.guild.name })}\n:calendar: ${i18n(locale, 'SERVER_INFO_EMBED_GUILD_CREATED_TIMESTAMP', { GUILDCREATEDTIMESTAMP: `<t:${unixTime(message.guild.createdTimestamp)}>` })}\n:crown: ${i18n(locale, 'SERVER_INFO_EMBED_GUILD_OWNER', { USER: client.users.cache.get(message.guild.ownerId).tag })}\n<a:nitro_boost:868214436178046976> ${i18n(locale, 'SERVER_INFO_EMBED_GUILD_BOOST', { GUILDBOOST: `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : i18n(locale, 'SERVER_INFO_BOOST_NONE')} (${message.guild.premiumSubscriptionCount || '0'})` })}`)
      .setTimestamp()
    message.reply({ embeds: [embed] })
  }
}
