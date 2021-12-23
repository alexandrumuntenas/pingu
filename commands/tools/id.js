const { Info } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'id',
  description: '🆔 Get the server ID',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    interaction.editReply({ embeds: [Info(getLocales(locale, 'ID', { ID: `\`${interaction.guild.id}\`` }))] })
  },
  executeLegacy (client, locale, message) {
    message.reply({ embeds: [Info(getLocales(locale, 'ID', { ID: `\`${message.guild.id}\`` }))] })
  }
}
