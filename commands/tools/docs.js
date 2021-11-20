const { MessageEmbed } = require('discord.js')

module.exports = {
  cooldown: 0,
  name: 'docs',
  description: 'Get documentation of the bot',
  executeInteraction (client, locale, interaction) {
    const messageToSend = new MessageEmbed().setColor('#F8F9FA').setDescription(':point_right: https://pingu.duoestudios.com')
    interaction.editReply({ embeds: [messageToSend] })
  },
  executeLegacy (client, locale, message) {
    const messageToSend = new MessageEmbed().setColor('#F8F9FA').setDescription(':point_right: https://pingu.duoestudios.com')
    message.reply({ embeds: [messageToSend] })
  }
}
