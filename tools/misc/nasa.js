const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const translate = require('translatte')

module.exports = {
  name: 'nasa',
  execute (args, client, con, contenido, message, result) {
    message.reply('<a:loading:880765834774073344>')
      .then(msg => {
        fetch('https://api.nasa.gov/planetary/apod?api_key=ezowSxroDnhKvjzojV9SXx7LmZ6P7OndGYLGXuE9')
          .then(response => response.json())
          .then(quote => {
            translate(quote.explanation, { to: result[0].guild_language }).then(res => {
              const embed = new MessageEmbed()
                .setTitle(quote.title)
                .setDescription(res.text)
                .setImage(quote.hdurl)
                .setColor('#0B3D91')
                .setFooter('Data via the API of Nasa.gov')
              msg.edit({ content: 'Done!', embeds: [embed] })
            })
          })
      })
  }
}
