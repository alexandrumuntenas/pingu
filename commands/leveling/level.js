const genericMessages = require('../../modules/genericMessages')
const { fetchMember } = require('../../modules/levelsModule')
const { MessageAttachment } = require('discord.js')
const { rankCard } = require('../../modules/canvasProcessing')
const tempFileRemover = require('../../modules/tempFileRemover')

module.exports = {
  name: 'level',
  execute (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      fetchMember(client, message.member, (data) => {
        if (data) {
          message.member.levelData = data
          message.member.tag = message.author.tag
          rankCard(client, message.member, locale, message.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            message.channel.send({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
        } else {
          genericMessages.Error.customerror(message, locale, 'RANK_NO_CLASSIFIED')
        }
      })
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
