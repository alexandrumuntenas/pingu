const { MessageEmbed } = require('discord.js')
const { fetchUserAccount } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')

module.exports = {
  module: 'economy',
  name: 'balance',
  description: '💸 Check your balance',
  cooldown: 5000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      fetchUserAccount(client, interaction.member, interaction.guild, (user) => {
        const firstMessageSent = new MessageEmbed()
          .setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
          .setColor('#009FE3')
          .setDescription(`${user.amount || 0} ${interaction.database.economyCurrency} ${interaction.database.economyCurrencyIcon}`)

        interaction.editReply({ embeds: [firstMessageSent] })
      })
    } else {
      genericMessages.error.noavaliable(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      fetchUserAccount(client, message.member, message.guild, (user) => {
        const firstMessageSent = new MessageEmbed()
          .setAuthor(message.member.displayName, message.author.displayAvatarURL())
          .setColor('#009FE3')
          .setDescription(`${user.amount || 0} ${message.database.economyCurrency} ${message.database.economyCurrencyIcon}`)

        message.reply({ embeds: [firstMessageSent] })
      })
    } else {
      genericMessages.legacy.error.noavaliable(message, locale)
    }
  }
}
