const { EmbedBuilder } = require('discord.js')
const flip = require('flipacoin')
const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'flip',
  description: '🪙 Flip a coin',
  cooldown: 1,
  runInteraction (interaction) {
    const embed = new EmbedBuilder().setColor('#007BFF')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'FLIP::HEADS')}`)
    } else {
      embed.setDescription(`:coin: ${i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'FLIP::TAILS')}`)
    }

    interaction.editReply({ embeds: [embed] })
  },
  runCommand (message) {
    const embed = new EmbedBuilder().setColor('#007BFF')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${i18n.obtenerTraduccion(message.guild.preferredLocale, 'FLIP::HEADS')}`)
    } else {
      embed.setDescription(`:coin: ${i18n.obtenerTraduccion(message.guild.preferredLocale, 'FLIP::TAILS')}`)
    }

    message.reply({ embeds: [embed] })
  }
}
