const fetch = require('superagent')
const { Image } = require('../../modules/constructor/messageBuilder')

module.exports = {
  name: 'dog',
  description: '🐶 Sends a random dog image',
  cooldown: 1,
  executeInteraction (client, locale, interaction) {
    fetch('https://nekos.life/api/v2/img/woof')
      .then((response) => response.body)
      .then((image) =>
        interaction.editReply({ embeds: [Image(image.url, 'nekos.life')] })
      )
  },
  executeLegacy (client, locale, message) {
    fetch('https://nekos.life/api/v2/img/woof')
      .then((response) => response.body)
      .then((image) =>
        message.reply({ embeds: [Image(image.url, 'nekos.life')] })
      )
  }
}
