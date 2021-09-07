const fetch = require('superagent')
const { MessageEmbed } = require('discord.js')
const translate = require('translatte')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'nasa',
  execute (client, locale, message, result) {
    message.reply('<a:loading:880765834774073344>')
      .then(msg => {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
          .then(response => response.body)
          .then(quote => {
            translate(quote.explanation, { to: result[0].guild_language }).then(res => {
              if (quote.media_type === 'image') {
                const embed = new MessageEmbed()
                  .setTitle(quote.title)
                  .setDescription(res.text)
                  .setImage(quote.hdurl)
                  .setColor('#0B3D91')
                  .addField('+ Info', `:camera: ${quote.copyright || 'We don\'t have that information'}\n<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: 'Nasa.gov' })}`)
                  .setFooter('')
                msg.edit({ content: 'Done!', embeds: [embed] })
              } else {
                message.channel.send('We are working on video media type.')
              }
            })
          })
      })
  }
}
