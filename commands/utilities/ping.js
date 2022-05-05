const { EmbedBuilder } = require('discord.js')
const Math = require('mathjs')
const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'ping',
  description: '🏓 Pong!',
  cooldown: 1,
  runInteraction (interaction) {
    const embed = new EmbedBuilder().setColor('#57F287').setTitle('🏓 Pong!')
      .addFields([
        { name: `<:system_bot:968432962796388402>: ${i18n.getTranslation(interaction.guild.preferredLocale, 'PING::BOTPING')}`, value: `${Math.abs(Date.now() - interaction.createdTimestamp)}ms`, inline: true },
        { name: `<:connection_excellent:967782019721490462> ${i18n.getTranslation(interaction.guild.preferredLocale, 'PING::GATEWAYPING')}`, value: `${Math.round(process.Client.ws.ping)}ms`, inline: true },
        { name: `<:system_timeout:970715618938617856> ${i18n.getTranslation(interaction.guild.preferredLocale, 'PING::TOTALPING')}`, value: `${Math.round(process.Client.ws.ping + (Math.abs(Date.now() - interaction.createdTimestamp)))}ms`, inline: true }
      ])
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    interaction.editReply({ embeds: [embed] })
  },
  runCommand (message) {
    const embed = new EmbedBuilder()
      .setColor('#57F287')
      .setTitle('🏓 Pong!')
      .addFields([
        { name: `<:system_bot:968432962796388402> ${i18n.getTranslation(message.guild.preferredLocale, 'PING::BOTPING')}`, value: `${Math.abs(Date.now() - message.createdTimestamp)}ms`, inline: true },
        { name: `<:connection_excellent:967782019721490462> ${i18n.getTranslation(message.guild.preferredLocale, 'PING::GATEWAYPING')}`, value: `${Math.round(process.Client.ws.ping)}ms`, inline: true },
        { name: `<:system_timeout:970715618938617856> ${i18n.getTranslation(message.guild.preferredLocale, 'PING::TOTALPING')}`, value: `${Math.round(process.Client.ws.ping + (Math.abs(Date.now() - message.createdTimestamp)))}ms`, inline: true }
      ])
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    message.channel.send({ embeds: [embed] })
  }
}
