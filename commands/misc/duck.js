const fetch = require('superagent')
const { plantillas } = require('../../core/messageManager')

module.exports = {
  name: 'duck',
  description: '🦆 Sends a random duck image',
  cooldown: 1,
  runInteraction (interaction) {
    fetch('https://random-d.uk/api/v2/random')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [plantillas.imagen(resource.url, 'Random-d.uk')] })
      )
  },
  runCommand (message) {
    fetch('https://random-d.uk/api/v2/random')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [plantillas.imagen(resource.url, 'Random-d.uk')] })
      )
  }
}
