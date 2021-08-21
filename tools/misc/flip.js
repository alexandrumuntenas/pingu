const flip = require('flipacoin')

module.exports = {
  name: 'flip',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.misc.flip
    if (flip() === 'head') {
      message.channel.send(`:coin: ${lan.cara}`)
    } else {
      message.channel.send(`:coin: ${lan.cruz}`)
    }
  }
}
