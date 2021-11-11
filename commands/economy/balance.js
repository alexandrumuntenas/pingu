const { MessageEmbed } = require('discord.js')
const { fetchUserAccount } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'balance',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      fetchUserAccount(client, message.member, message.guild, (user) => {
        const firstMessageSent = new MessageEmbed()
          .setFooter(`${message.author.username} · ${message.database.economyBankName}`)
          .setColor('#009FE3')
          .addField(getLocales(locale, 'BALANCE_ACCOUNT_MONEY'), `\`${user.amount || 0} ${message.database.economyCurrency}\``, true)
        message.reply({ embeds: [firstMessageSent] })
      })
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
