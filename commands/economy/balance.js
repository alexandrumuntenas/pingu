const { getMember } = require('../../modules/memberManager')
const { Status } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'balance',
  description: '💸 Check your balance',
  cooldown: 5000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getMember(client, interaction.member, (memberData) => {
        interaction.editReply({ embeds: [Status(`**${interaction.user.tag}**: ${memberData.ecoBalance || 0} ${interaction.database.economyCurrency} ${interaction.database.economyCurrencyIcon}`)] })
      })
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      getMember(client, message.member, (memberData) => {
        message.reply({ embeds: [Status(`**${message.member.user.tag}**: ${memberData.ecoBalance || 0} ${message.database.economyCurrency} ${message.database.economyCurrencyIcon}`)] })
      })
    } else {
      message.reply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
