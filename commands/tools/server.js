const { MessageEmbed } = require('discord.js');
const i18n = require('../../i18n/i18n');
const unixTime = require('unix-time');

module.exports = {
  name: 'server',
  description: '👑 Shows information about the server',
  cooldown: 1,
  executeInteraction(client, locale, interaction) {
    const embed = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER::EMBED:TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`:medal: **${i18n(locale, 'SERVER::EMBED:SERVERNAME')}**: ${interaction.guild.name}\n:calendar: **${i18n(locale, 'SERVER::EMBED:SERVERCREATIONDATE')}**: <t:${unixTime(interaction.guild.createdTimestamp)}>\n:crown: **${i18n(locale, 'SERVER::EMBED:SERVEROWNER')}**: ${client.users.cache.get(interaction.guild.ownerId).tag}\n<a:nitro:927222194034053161> **${i18n(locale, 'SERVER::EMBED:NITROSTATUS')}**: ${interaction.guild.premiumTier} (${interaction.guild.premiumSubscriptionCount || '0'})`)
      .setFooter({ text: 'Powered by Pingu', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  },
  executeLegacy(client, locale, message) {
    const embed = new MessageEmbed()
      .setTitle(i18n(locale, 'SERVER::EMBED:TITLE'))
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:medal: **${i18n(locale, 'SERVER::EMBED:SERVERNAME')}**: ${message.guild.name}\n:calendar: **${i18n(locale, 'SERVER::EMBED:SERVERCREATIONDATE')}**: <t:${unixTime(message.guild.createdTimestamp)}>\n:crown: **${i18n(locale, 'SERVER::EMBED:SERVEROWNER')}**: ${client.users.cache.get(message.guild.ownerId).tag}\n<a:nitro:927222194034053161> **${i18n(locale, 'SERVER::EMBED:NITROSTATUS')}**: ${message.guild.premiumTier} (${message.guild.premiumSubscriptionCount || '0'})`)
      .setFooter({ text: 'Powered by Pingu', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();
    message.reply({ embeds: [embed] });
  }
};
