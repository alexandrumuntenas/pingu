/* eslint-disable no-eval */
const genericMessages = require('../../modules/genericMessages')
const tempFileRemover = require('../../modules/tempFileRemover')
const { welcomeCard } = require('../../modules/canvasProcessing')
const { MessageAttachment } = require('discord.js')

module.exports = {
  name: 'wt',
  execute: async (client, locale, message) => { // eslint-disable-line no-unused-vars
    client.pool.query('SELECT * FROM `guildWelcomerConfig` WHERE guild = ?', [message.guild.id], (err, result) => {
      if (err) throw err
      if (message.author.id === '722810818823192629') {
        welcomeCard(client, message.member, locale, result[0]).then((paths) => {
          const attachmentSent = new MessageAttachment(paths.attachmentSent)
          message.channel.send({ files: [attachmentSent] }).then(() => {
            tempFileRemover(paths)
          })
        })
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    })
  }
}
