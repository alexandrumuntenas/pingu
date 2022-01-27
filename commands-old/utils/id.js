const { Info } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'id',
  description: '🆔 Get the server ID',
  cooldown: 1,
  runInteraction(client, locale, interaction) {
    interaction.editReply({ embeds: [Info(i18n(locale, 'ID', { ID: `\`${interaction.guild.id}\`` }))] })
  },
  runCommand(client, locale, message) {
    message.reply({ embeds: [Info(i18n(locale, 'ID', { ID: `\`${message.guild.id}\`` }))] })
  }
}
