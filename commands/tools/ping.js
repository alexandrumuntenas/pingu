const { MessageEmbed } = require('discord.js')
const Math = require('mathjs')

module.exports = {
  cooldown: 0,
  name: 'ping',
  executeLegacy (client, locale, message) {
    const embed = new MessageEmbed().setColor('#9DF63F').setTitle('🏓 Pong!').setDescription(`🕑 Bot: **${Date.now() - message.createdTimestamp}ms** \n📨 API: **${Math.round(client.ws.ping)}ms**\n ⌛ Total: **${Math.round(client.ws.ping + (Date.now() - message.createdTimestamp))}ms**`).setTimestamp().setFooter('Hey!')
    message.channel.send({ embeds: [embed] })
  }
}
