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
  }
}
