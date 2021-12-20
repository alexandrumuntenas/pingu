const { MessageEmbed } = require('discord.js')
const { fetchUserAccount } = require('../../modules/economy')
const messageBuilder = require('../../functions/messageBuilder')

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
      messageBuilder.error.noavaliable(interaction, locale)
    }
  }
}
