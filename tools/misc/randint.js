const { MessageEmbed } = require('discord.js')
const Math = require('mathjs')

module.exports = {
  name: 'randint',
  execute (args, client, con, locale, message, result) {
    const messageSent = new MessageEmbed().setColor('#007BFF')
    if (args[0]) {
      const specifiedRandom = Math.round(Math.random(1, parseInt(args[0])))
      messageSent.setDescription(`:abacus: **${specifiedRandom}**`)
    } else {
      const unspecifiedRandom = Math.round(Math.random(1, 100))
      messageSent.setDescription(`:abacus: **${unspecifiedRandom}**`)
    }
    message.reply({ embeds: [messageSent] })
  }
}
