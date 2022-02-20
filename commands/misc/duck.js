const fetch = require('superagent')
const { image } = require('../../functions/defaultMessages')

module.exports = {
  name: 'duck',
  description: '🦆 Sends a random duck image',
  cooldown: 1,
  runInteraction (locale, interaction) {
    fetch('https://random-d.uk/api/v2/random')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [image(resource.url, 'Random-d.uk')] })
      )
  },
  runCommand (locale, message) {
    fetch('https://random-d.uk/api/v2/random')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [image(resource.url, 'Random-d.uk')] })
      )
  }
}
