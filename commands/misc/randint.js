const { MessageEmbed } = require('discord.js')
const Math = require('mathjs')

module.exports = {
  cooldown: 0,
  name: 'randint',
  execute (client, locale, message) {
    const messageSent = new MessageEmbed().setColor('#007BFF')
    if (message.args[0]) {
      const specifiedRandom = Math.round(Math.random(1, parseInt(message.args[0])))
      messageSent.setDescription(`:abacus: **${specifiedRandom}**`)
    } else {
      const unspecifiedRandom = Math.round(Math.random(1, 100))
      messageSent.setDescription(`:abacus: **${unspecifiedRandom}**`)
    }
    message.reply({ embeds: [messageSent] })
  }
}
