const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const translate = require('translatte')

module.exports = {
  name: 'nasa',
  execute (args, client, con, contenido, message, result) {
    message.channel.send('<a:win_loading:876111904353959936>')
      .then(msg => {
        fetch('https://api.nasa.gov/planetary/apod?api_key=ezowSxroDnhKvjzojV9SXx7LmZ6P7OndGYLGXuE9')
          .then(response => response.json())
          .then(quote => {
            translate(quote.explanation, { to: result[0].guild_language }).then(res => {
              const embed = new MessageEmbed()
              embed.setTitle(quote.title)
              embed.setDescription(res.text)
              embed.setImage(quote.hdurl)
              embed.setColor('#0B3D91')
              embed.setFooter('Nasa.gov')
              msg.edit('', embed)
            })
          })
      })
  }
}
