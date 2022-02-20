const fetch = require('superagent')
const { image } = require('../../functions/defaultMessages')

module.exports = {
  name: 'lizard',
  description: '🦎 Sends a random lizard image',
  cooldown: 1,
  runInteraction (locale, interaction) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        interaction.editReply({ embeds: [image(resource.url, 'nekos.life')] })
      )
  },
  runCommand (locale, message) {
    fetch('https://nekos.life/api/v2/img/lizard')
      .then(response => response.body)
      .then(resource =>
        message.reply({ embeds: [image(resource.url, 'nekos.life')] })
      )
  }
}
