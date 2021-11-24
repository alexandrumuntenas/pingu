const genericMessages = require('../../functions/genericMessages')
const { fetchMember } = require('../../modules/levels')
const { MessageAttachment } = require('discord.js')
const { rankCard } = require('../../modules/canvasProcessing')
const tempFileRemover = require('../../functions/tempFileRemover')

module.exports = {
  cooldown: 10000,
  name: 'level',
  description: '⭐ Check your level',
  executeInteraction (client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      fetchMember(client, interaction.member, (data) => {
        if (data) {
          interaction.member.levelData = data
          interaction.member.tag = `${interaction.user.username}#${interaction.user.discriminator}`
          rankCard(client, interaction.member, locale, interaction.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            interaction.editReply({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
        } else {
          genericMessages.error(interaction, locale, 'RANK_NO_CLASSIFIED')
        }
      })
    } else {
      genericMessages.error.noavaliable(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
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
          genericMessages.legacy.error(message, locale, 'RANK_NO_CLASSIFIED')
        }
      })
    } else {
      genericMessages.legacy.error.noavaliable(message, locale)
    }
  }
}
