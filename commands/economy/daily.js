const { MessageEmbed } = require('discord.js')
const { getMoney } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'daily',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      getMoney(client, message.member, message.guild, (money) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor(message.member.displayName, message.author.displayAvatarURL())
          .setColor('#633bdf')
          .setDescription(getLocales(locale, 'DAILY', { DAILY: `${money} ${message.database.economyCurrencyIcon}` }))
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
        message.reply({ embeds: [inventoryEmbed] })
      })
    } else {
      genericMessages.error.noavaliable(message, locale)
    }
  }
}
