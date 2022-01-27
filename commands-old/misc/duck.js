const fetch = require('superagent')
const { Image } = require('../../modules/constructor/messageBuilder')

module.exports = {
  name: 'duck',
  description: '🦆 Sends a random duck image',
  cooldown: 1,
  runInteraction(client, locale, interaction) {
    fetch('https://random-d.uk/api/v2/random')
      .then((response) => response.body)
      .then((image) => interaction.editReply({ embeds: [Image(image.url, 'Random-d.uk')] }))
  },
  runCommand(client, locale, message) {
    fetch('https://random-d.uk/api/v2/random')
      .then((response) => response.body)
      .then((image) => message.reply({ embeds: [Image(image.url, 'Random-d.uk')] }))
  }
}
