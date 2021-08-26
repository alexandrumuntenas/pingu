const flip = require('flipacoin')

module.exports = {
  name: 'flip',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.flip
    if (flip() === 'head') {
      message.channel.send(`:coin: ${i18n.cara}`)
    } else {
      message.channel.send(`:coin: ${i18n.cruz}`)
    }
  }
}
