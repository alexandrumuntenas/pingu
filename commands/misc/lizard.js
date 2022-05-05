const fetch = require('superagent')
const { plantillas } = require('../../core/messageManager')

module.exports = {
  name: 'lizard',
  description: '🦎 Sends a random lizard image',
  cooldown: 1,
  runInteraction (interaction) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  },
  runCommand (message) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  }
}
