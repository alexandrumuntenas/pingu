const { MessageEmbed } = require('discord.js')
const unixTime = require('unix-time')
const { fetchConfig, fetchUserAccount, fetchLatestTransactions } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'mybank',
  execute (client, locale, message, isInteraction) {
    fetchConfig(client, message.guild, (config) => {
      if (config) {
        fetchUserAccount(client, message, (user) => {
          const firstMessageSent = new MessageEmbed()
            .setAuthor(getLocales(locale, 'MYBANK_ACCOUNT_OF', { USER: message.author.username }), message.author.displayAvatarURL())
            .setThumbnail(config.bankLogo)
            .setFooter(config.bankName)
            .setColor('#009FE3')
            .addField(getLocales(locale, 'MYBANK_ACCOUNT_MONEY'), `\`${user.amount || 0} ${config.currency}\``, true)
            .addField(getLocales(locale, 'MYBANK_ACCOUNT_EBAN'), `\`${user.eban}\``, true)

          const secondMessageSent = new MessageEmbed()
            .setTitle(getLocales(locale, 'MYBANK_LATESTTRANSACTIONS'))
            .setColor('#009FE3')

          fetchLatestTransactions(client, message, (latestTransactions) => {
            latestTransactions.forEach((transaction) => {
              let emisor = ''
              if (client.guilds.cache.get(transaction.emisor)) {
                emisor = getLocales(locale, 'SERVER')
              } else {
                emisor = client.users.cache.get(transaction.emisor).tag
              }
              secondMessageSent.addField(`:stopwatch: <t:${unixTime(transaction.timeStamp)}>`, `:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_ID', { TRANSACTION_ID: `\`${transaction.transactionID.substring(0, 9)}\`` })}\n:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_EMISOR', { TRANSACTION_EMISOR: emisor })}\n:mag_right: ${getLocales(locale, 'MYBANK_TRANSACTION_TYPE', { TRANSACTION_TYPE: getLocales(locale, `TRANSACTION_TYPE_${transaction.type}`) })}\n:moneybag: ${getLocales(locale, 'MYBANK_TRANSACTION_QUANTITY', { TRANSACTION_QUANTITY: `\`${parseInt(transaction.newQuantity) - parseInt(transaction.previousQuantity)} ${config.currency}\`` })}`)
            })
            message.channel.send({ embeds: [firstMessageSent, secondMessageSent] })
          })
        })
      } else {
        genericMessages.Error.no_avaliable(message, locale)
      }
    }
    )
  }
}
