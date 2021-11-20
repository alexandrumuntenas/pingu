const { MessageEmbed } = require('discord.js')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 0,
  name: 'id',
  executeLegacy (client, locale, message) {
    const messageSent = new MessageEmbed().setColor('#3984BD').setDescription(`<:win_information:876119543968305233> ${getLocales(locale, 'ID', { ID: `\`${message.guild.id}\`` })}`)
    message.reply({ embeds: [messageSent] })
  }
}
