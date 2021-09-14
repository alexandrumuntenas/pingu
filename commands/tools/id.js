const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'id',
  data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('Returns guild ID'),
  execute (client, locale, message, isInteraction) {
    const messageSent = new MessageEmbed().setColor('#3984BD').setDescription(`<:win_information:876119543968305233> ${getLocales(locale, 'ID', { ID: message.guild.id })}`)
    if (!isInteraction) {
      message.channel.send({ embeds: [messageSent] })
    } else {
      message.editReply({ embeds: [messageSent] })
    }
  }
}
