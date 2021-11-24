const { MessageEmbed } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'id',
  description: '🆔 Get the server ID',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    genericMessages.info.status(interaction, getLocales(locale, 'ID', { ID: `\`${interaction.guild.id}\`` }))
  },
  executeLegacy (client, locale, message) {
    const messageSent = new MessageEmbed().setColor('#3984BD').setDescription(`<:win_information:876119543968305233> ${getLocales(locale, 'ID', { ID: `\`${message.guild.id}\`` })}`)
    message.reply({ embeds: [messageSent] })
  }
}
