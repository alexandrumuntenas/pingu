const { MessageEmbed } = require('discord.js')
const flip = require('flipacoin')

module.exports = {
  name: 'flip',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.flip
    const embed = new MessageEmbed().setColor('#3984BD')
    if (flip() === 'head') {
      embed.setDescription(`:coin: ${i18n.cara}`)
    } else {
      embed.setDescription(`:coin: ${i18n.cruz}`)
    }
    message.reply({ embeds: [embed] })
  }
}
