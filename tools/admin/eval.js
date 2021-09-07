const { codeBlock } = require('@discordjs/builders')
const genericMessages = require('../../modules/genericMessages')
module.exports = {
  name: 'eval',
  execute: async (client, locale, message, result) => { // eslint-disable-line no-unused-vars
    if (message.author.id === '722810818823192629') {
      const code = message.args.join(' ')
      try {
        const evaled = eval(code)
        const clean = await client.clean(client, evaled)
        message.channel.send(codeBlock('js', clean))
      } catch (err) {
        message.channel.send(codeBlock('xl', `ERROR ${await client.clean(client, err)}`))
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
