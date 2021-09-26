const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'docs',
  execute (client, locale, message, isInteraction) {
    const messageToSend = new MessageEmbed().setColor('#F8F9FA').setDescription(':point_right: https://alexandrutheodor.gitbook.io/pingu/')
    message.reply({ embeds: [messageToSend] })
  }
}
