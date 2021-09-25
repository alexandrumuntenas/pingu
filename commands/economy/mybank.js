const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'mybank',
  execute (client, locale, message, isInteraction) {
    client.pool.query('SELECT * FROM `guildEconomyConfig` WHERE guild = ?', [message.guild.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        const economyConfig = rows[0]
        client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [message.guild.id, message.author.id], (err, rows) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }

          const firstMessageSent = new MessageEmbed()
            .setAuthor(economyConfig.bankName)
            .setThumbnail(economyConfig.bankLogo)
            .setTitle(getLocales(locale, 'MYBANK_ACCOUNT_OF', { USER: message.author.username }))
            .setColor('#009FE3')
            .setDescription(getLocales(locale, 'MYBANK_MONEY', { BANK_NAME: economyConfig.bankName, BANK_CURRENCY: economyConfig.currency, BANK_ACCOUNT_MONEY: rows[0].amount || 0 }))

          /* const secondMessageSent = new MessageEmbed()
            .setTitle('Últimos movimientos')
            .setColor('#009FE3')
            .addField('FETCH HERE DATA', 'A') */

          message.channel.send({ embeds: [firstMessageSent] })
        })
      } else {
        message.channel.send('This guild doesn\'t have the Economy module configured')
      }
    })
  }
}
