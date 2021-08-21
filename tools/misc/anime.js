const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'anime',
  execute (args, client, con, contenido, message, result) {
    function embed (quote) {
      const embed = new MessageEmbed()
      embed.setAuthor(quote.anime)
      embed.setFooter(quote.character)
      embed.setDescription(quote.quote)
      message.channel.send(embed)
    }
    fetch('https://animechan.vercel.app/api/random')
      .then(response => response.json())
      .then(quote => embed(quote))
  }
}
