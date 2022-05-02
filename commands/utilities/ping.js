const { MessageEmbed } = require('discord.js')
const Math = require('mathjs')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'ping',
  description: '🏓 Pong!',
  cooldown: 1,
  runInteraction ( interaction) {
    const embed = new MessageEmbed()
      .setColor('#57F287')
      .setTitle('🏓 Pong!')
      .addField(`<:blurple_bot:938094998283501569> ${i18n(guild.preferredLocale, 'PING::BOTPING')}`, `${Math.abs(Date.now() - interaction.createdTimestamp)}ms`, true)
      .addField(`<:the_connection_is_excellent:939550716555583508> ${i18n(guild.preferredLocale, 'PING::GATEWAYPING')}`, `${Math.round(process.Client.ws.ping)}ms`, true)
      .addField(`<:timeout_clock:937404313901359114> ${i18n(guild.preferredLocale, 'PING::TOTALPING')}`, `${Math.round(process.Client.ws.ping + (Math.abs(Date.now() - interaction.createdTimestamp)))}ms`, true)
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    interaction.editReply({ embeds: [embed] })
  },
  runCommand ( message) {
    const embed = new MessageEmbed()
      .setColor('#57F287')
      .setTitle('🏓 Pong!')
      .addField(`<:blurple_bot:938094998283501569> ${i18n(guild.preferredLocale, 'PING::BOTPING')}`, `${Math.abs(Date.now() - message.createdTimestamp)}ms`, true)
      .addField(`<:the_connection_is_excellent:939550716555583508> ${i18n(guild.preferredLocale, 'PING::GATEWAYPING')}`, `${Math.round(process.Client.ws.ping)}ms`, true)
      .addField(`<:timeout_clock:937404313901359114> ${i18n(guild.preferredLocale, 'PING::TOTALPING')}`, `${Math.round(process.Client.ws.ping + (Math.abs(Date.now() - message.createdTimestamp)))}ms`, true)
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    message.channel.send({ embeds: [embed] })
  }
}
