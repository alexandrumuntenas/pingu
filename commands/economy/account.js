const { MessageEmbed } = require('discord.js')
const unixTime = require('unix-time')
const { fetchUserAccount, fetchLatestTransactions } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'account',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      fetchUserAccount(client, message.member, message.guild, (user) => {
        const firstMessageSent = new MessageEmbed()
          .setAuthor(getLocales(locale, 'MYBANK_ACCOUNT_OF', { USER: message.author.username }), message.author.displayAvatarURL())
          .setThumbnail(message.database.economyBankLogo)
          .setFooter(message.database.economyBankName)
          .setColor('#009FE3')
          .addField(getLocales(locale, 'MYBANK_ACCOUNT_MONEY'), `\`${user.amount || 0} ${message.database.economyCurrency}\``, true)
          .addField(getLocales(locale, 'MYBANK_ACCOUNT_EBAN'), `\`${user.eban}\``, true)

        const secondMessageSent = new MessageEmbed()
          .setTitle(getLocales(locale, 'MYBANK_LATESTTRANSACTIONS'))
          .setColor('#009FE3')
          .setAuthor(getLocales(locale, 'MYBANK_ACCOUNT_OF', { USER: message.author.username }), message.author.displayAvatarURL())
          .setThumbnail(message.database.economyBankLogo)
          .setFooter(message.database.economyBankName)

        fetchLatestTransactions(client, message.guild, message.member, (latestTransactions) => {
          latestTransactions.forEach((transaction) => {
            let emisor = ''
            if (client.guilds.cache.get(transaction.emisor)) {
              emisor = getLocales(locale, 'SERVER')
            } else {
              emisor = client.users.cache.get(transaction.emisor).tag
            }
            secondMessageSent.addField(`:stopwatch: <t:${unixTime(transaction.timeStamp)}>`, `:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_ID', { TRANSACTION_ID: `\`${transaction.transactionID.substring(0, 9)}\`` })}\n:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_EMISOR', { TRANSACTION_EMISOR: emisor })}\n:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_TYPE', { TRANSACTION_TYPE: getLocales(locale, `TRANSACTION_TYPE_${transaction.type}`) })}\n:moneybag: ${getLocales(locale, 'MYBANK_TRANSACTION_QUANTITY', { TRANSACTION_QUANTITY: `\`${parseInt(transaction.newQuantity) - parseInt(transaction.previousQuantity)} ${message.database.economyCurrency}\`` })}`)
          })
          message.channel.send({ embeds: [firstMessageSent, secondMessageSent] })
        })
      })
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
