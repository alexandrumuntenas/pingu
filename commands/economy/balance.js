const { getMemberInventoryAndBalance } = require('../../modules/economy')
const { Status } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'balance',
  description: '💸 Check your balance',
  cooldown: 5000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getMemberInventoryAndBalance(client, interaction.member, interaction.guild, (user) => {
        interaction.editReply({ embeds: [Status(`**${interaction.user.tag}**: ${user.amount || 0} ${interaction.database.economyCurrency} ${interaction.database.economyCurrencyIcon}`)] })
      })
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      getMemberInventoryAndBalance(client, message.member, message.guild, (user) => {
        message.reply({ embeds: [Status(`**${message.member.user.tag}**: ${user.amount || 0} ${message.database.economyCurrency} ${message.database.economyCurrencyIcon}`)] })
      })
    } else {
      message.reply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
