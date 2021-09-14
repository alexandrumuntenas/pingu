const { MessageEmbed } = require('discord.js')
const flip = require('flipacoin')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'flip',
  execute (client, locale, message) {
    const embed = new MessageEmbed().setColor('#007BFF')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${getLocales(locale, 'FLIP_HEAD')}`)
    } else {
      embed.setDescription(`:coin: ${getLocales(locale, 'FLIP_CROSS')}`)
    }
    message.reply({ embeds: [embed] })
  }
}
