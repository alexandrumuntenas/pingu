const { Error } = require('../../modules/constructor/messageBuilder')
const { getMember, generateRankCard } = require('../../modules/levels')
const { MessageAttachment } = require('discord.js')
const tempFileRemover = require('../../functions/tempFileRemover')

module.exports = {
  module: 'levels',
  cooldown: 10000,
  name: 'rank',
  description: '⭐ Check your level',
  executeInteraction (client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      getMember(client, interaction.member, (data) => {
        if (data) {
          interaction.member.levelData = data
          interaction.member.tag = `${interaction.user.username}#${interaction.user.discriminator}`
          generateRankCard(client, interaction.member, locale, interaction.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            interaction.editReply({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
        } else {
          interaction.editReply({ embeds: [Error(locale, 'RANK::NOCLASSIFIED')] })
        }
      })
    } else {
      interaction.editReply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      getMember(client, message.member, (data) => {
        if (data) {
          message.member.levelData = data
          message.member.tag = message.author.tag
          generateRankCard(client, message.member, locale, message.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            message.channel.send({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
        } else {
          message.reply({ embeds: [Error(locale, 'RANK::NOCLASSIFIED')] })
        }
      })
    } else {
      message.reply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  }
}
