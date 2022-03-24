const fetch = require('superagent')
const { image } = require('../../functions/messageManager')

module.exports = {
  name: 'dog',
  description: '🐶 Sends a random dog image',
  cooldown: 1,
  runInteraction (locale, interaction) {
    fetch('https://nekos.life/api/v2/img/woof')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  },
  runCommand (locale, message) {
    fetch('https://nekos.life/api/v2/img/woof')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [plantillas.imagen(resource.url, 'nekos.life')] })
      )
  }
}
