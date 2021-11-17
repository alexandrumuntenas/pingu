const { MessageEmbed } = require('discord.js')
const { fetchUserAccount } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')

module.exports = {
  cooldown: 5000,
  name: 'balance',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      fetchUserAccount(client, message.member, message.guild, (user) => {
        const firstMessageSent = new MessageEmbed()
          .setAuthor(message.member.displayName, message.author.displayAvatarURL())
          .setColor('#009FE3')
          .setDescription(`${user.amount || 0} ${message.database.economyCurrency} ${message.database.economyCurrencyIcon}`)

        message.reply({ embeds: [firstMessageSent] })
      })
    } else {
      genericMessages.error.noavaliable(message, locale)
    }
  }
}
