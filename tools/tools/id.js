const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'id',
  execute (args, client, con, locale, message, result) {
    const messageSent = new MessageEmbed().setColor('#3984BD').setDescription(`<:win_information:876119543968305233> ${getLocales(locale, 'ID', { ID: message.guild.id })}`)
    message.reply({ embeds: [messageSent] })
  }
}
