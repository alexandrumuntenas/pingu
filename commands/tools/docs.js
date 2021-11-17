const { MessageEmbed } = require('discord.js')

module.exports = {
  cooldown: 0,
  name: 'docs',
  execute (client, locale, message) {
    const messageToSend = new MessageEmbed().setColor('#F8F9FA').setDescription(':point_right: https://pingu.duoestudios.com')
    message.reply({ embeds: [messageToSend] })
  }
}
