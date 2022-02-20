const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const unixTime = require('unix-time')

module.exports = {
  name: 'server',
  description: '👑 Shows information about the server',
  cooldown: 1,
  runInteraction (locale, interaction) {
    const serverInfo = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER::EMBED:TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`:medal: **${i18n(locale, 'SERVER::EMBED:SERVERNAME')}**: ${interaction.guild.name}\n:id: **${i18n(locale, 'SERVER::EMBED:SERVERID')}**: ${interaction.guild.id}\n:calendar: **${i18n(locale, 'SERVER::EMBED:SERVERCREATIONDATE')}**: <t:${unixTime(interaction.guild.createdTimestamp)}>\n:crown: **${i18n(locale, 'SERVER::EMBED:SERVEROWNER')}**: ${process.Client.users.cache.get(interaction.guild.ownerId).tag}\n<a:nitro:927222194034053161> **${i18n(locale, 'SERVER::EMBED:NITROSTATUS')}**: ${interaction.guild.premiumTier} (${interaction.guild.premiumSubscriptionCount || '0'})`)
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    interaction.editReply({ embeds: [serverInfo] })
  },
  runCommand (locale, message) {
    const serverInfo = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER::EMBED:TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:medal: **${i18n(locale, 'SERVER::EMBED:SERVERNAME')}**: ${message.guild.name}\n:id: **${i18n(locale, 'SERVER::EMBED:SERVERID')}**: ${message.guild.id}\n:calendar: **${i18n(locale, 'SERVER::EMBED:SERVERCREATIONDATE')}**: <t:${unixTime(message.guild.createdTimestamp)}>\n:crown: **${i18n(locale, 'SERVER::EMBED:SERVEROWNER')}**: ${process.Client.users.cache.get(message.guild.ownerId).tag}\n<a:nitro:927222194034053161> **${i18n(locale, 'SERVER::EMBED:NITROSTATUS')}**: ${message.guild.premiumTier} (${message.guild.premiumSubscriptionCount || '0'})`)
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    message.reply({ embeds: [serverInfo] })
  }
}
