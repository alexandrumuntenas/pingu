const moment = require('moment')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'server-info',
  execute (args, client, con, locale, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.serverinfo
    const embed = new MessageEmbed()
      .setTitle(i18n.title)
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`:pencil2: ${i18n.guildName}: \`${message.guild.name}\`\n:calendar: ${i18n.guildCreationDate}: \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]\`\n:crown: ${i18n.guildOwner}: \`${client.users.cache.get(message.guild.ownerId).tag}\`\n:id: ${i18n.guildId}: \`${message.guild.id}\`\n<a:nitro_boost:868214436178046976> ${i18n.guildBoost}: \`${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : i18n.guildBoostNone} (${message.guild.premiumSubscriptionCount || '0'})\``, false)
      .setTimestamp()
    message.reply({ embeds: [embed] })
  }
}
