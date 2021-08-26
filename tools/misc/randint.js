const Math = require('mathjs')

module.exports = {
  name: 'randint',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.randint
    if (args[1]) {
      const specifiedRandom = Math.round(Math.random(1, parseInt(args[1])))
      message.channel.send(`:teacher: ${i18n} **${specifiedRandom}**`)
    } else {
      const unspecifiedRandom = Math.round(Math.random(1, 100))
      message.channel.send(`:teacher: ${i18n} **${unspecifiedRandom}**`)
    }
  }
}
