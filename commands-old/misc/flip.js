const { MessageEmbed } = require('discord.js')
const flip = require('flipacoin')
const i18n = require('../../i18n/i18n')

module.exports = {
  cooldown: 1,
  name: 'flip',
  description: '🪙 Flip a coin',
  runInteraction(client, locale, interaction) {
    const embed = new MessageEmbed().setColor('#007BFF')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${i18n(locale, 'FLIP::HEADS')}`)
    } else {
      embed.setDescription(`:coin: ${i18n(locale, 'FLIP::TAILS')}`)
    }
    interaction.editReply({ embeds: [embed] })
  },
  runCommand(client, locale, message) {
    const embed = new MessageEmbed().setColor('#007BFF')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${i18n(locale, 'FLIP::HEADS')}`)
    } else {
      embed.setDescription(`:coin: ${i18n(locale, 'FLIP::TAILS')}`)
    }
    message.reply({ embeds: [embed] })
  }
}