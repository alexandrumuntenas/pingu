const { getDailyMoney } = require('../../modules/economy')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'daily',
  description: '💰 Get your daily salary.',
  cooldown: 86400000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      try {
        getDailyMoney(client, interaction.member, (money) => {
          interaction.editReply({ embeds: [Success(i18n(locale, 'DAILY', { REWARD: `${money} ${interaction.database.economyCurrencyIcon}` }))] })
        })
      } catch (err) {
        client.log.error(err)
        interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      try {
        getDailyMoney(client, message.member, (money) => {
          message.reply({ embeds: [Success(i18n(locale, 'DAILY', { REWARD: `${money} ${message.database.economyCurrencyIcon}` }))] })
        })
      } catch (err) {
        client.log.error(err)
        message.reply({ embeds: [Error(i18n(locale, 'ERROR'))] })
      }
    } else {
      message.reply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
