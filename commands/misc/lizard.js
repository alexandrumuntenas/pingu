const fetch = require('superagent')
const { plantillas } = require('../../functions/messageManager')

module.exports = {
  name: 'lizard',
  description: '🦎 Sends a random lizard image',
  cooldown: 1,
  runInteraction (locale, interaction) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  },
  runCommand (locale, message) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  }
}
