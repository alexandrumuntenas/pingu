const { MessageEmbed } = require('discord.js')
const { getDailyMoney } = require('../../modules/economy')
const { Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'daily',
  description: '💰 Get your daily salary.',
  cooldown: 86400000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getDailyMoney(client, interaction.member, interaction.guild, (money) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
          .setColor('#2F3136')
          .setDescription(i18n(locale, 'DAILY', { REWARD: `${money} ${interaction.database.economyCurrencyIcon}` }))
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
        interaction.editReply({ embeds: [inventoryEmbed] })
      })
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
