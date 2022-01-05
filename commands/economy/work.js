const { getWorkMoney } = require('../../modules/economy')
const { Success, Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'work',
  description: '🏗️ Work to get some money!',
  cooldown: 3600000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      try {
        getWorkMoney(client, interaction.member, interaction.guild, (money) => {
          interaction.editReply({ embeds: [Success(i18n(locale, 'WORK::SUCCESS', { MONEY: `${money} ${interaction.database.economyCurrencyIcon}` }))] })
        })
      } catch (err) {
        client.log.error(err)
        interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
