const { MessageAttachment } = require('discord.js')
const { generateRankCard } = require('../../modules/leveling')

module.exports = {
  name: 'rank',
  module: 'leveling',
  description: '🏅 Get your rank',
  cooldown: 1,
  runInteraction ( interaction) {
    generateRankCard(interaction.member, card => {
      const rankCardAttachment = new MessageAttachment(card, 'rankcard.png')
      interaction.editReply({ files: [rankCardAttachment] })
    })
  },
  runCommand ( message) {
    generateRankCard(message.member, card => {
      const rankCardAttachment = new MessageAttachment(card, 'rankcard.png')
      message.reply({ files: [rankCardAttachment] })
    })
  }
}
