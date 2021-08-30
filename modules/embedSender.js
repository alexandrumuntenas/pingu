const { MessageEmbed } = require('discord.js')

module.exports = {
  Moderation: {
    Success: (message, member, i18n, content) => {
      const sendMessage = new MessageEmbed().setColor('#28A745').setAuthor(member.username + i18n, member.avatarURL()).setTitle(i18n.youHaveBeenWarned).setDescription(content)
      message.channel.send({ embeds: [sendMessage] })
    }
  }
}
