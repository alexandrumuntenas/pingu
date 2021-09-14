/* eslint-disable no-eval */
const genericMessages = require('../../modules/genericMessages')
const { deploySlashCommands } = require('../../modules/commandHandler')
module.exports = {
  name: 'deploy',
  execute: async (client, locale, message, isInteraction) => { // eslint-disable-line no-unused-vars
    if (message.author.id === '722810818823192629') {
      try {
        deploySlashCommands(client, message.guild)
      } catch (err) {
        console.log(err)
      } finally {
        message.reply('Deploying commands')
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
