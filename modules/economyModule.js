const makeId = require('./makeId')

module.exports = {
  getMoney: (client, message) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getMoney',
      name: 'Economy (getMoney)'
    })
    const plusNumber = Math.round(Math.random() * (25 - 15) + 15)
    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [message.guild.id, message.author.id], (err, result) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        const money = parseInt(result[0].amount) + plusNumber
        client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [money, message.author.id, message.guild.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          client.pool.query('INSERT INTO `guildEconomyBankTransferBook` (`transactionID`, `emisor`, `member`, `previousQuantity`, `newQuantity`, `type`) VALUES (?, ?, ?, ?, ?, 1)', [makeId(64), message.guild.id, message.author.id, parseInt(result[0].amount), money])
        })
      } else {
        client.pool.query('INSERT INTO `guildEconomyUserBank` (`eban`, `member`, `guild`, `amount`) VALUES (?, ?, ?, ?)', [makeId(27), message.author.id, message.guild.id, plusNumber], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          client.pool.query('INSERT INTO `guildEconomyBankTransferBook` (`transactionID`, `emisor`, `member`, `newQuantity`, `type`) VALUES (?, ?, ?, ?, 1)', [makeId(64), message.guild.id, message.author.id, plusNumber])
        })
      }
    })
    EgM.finish()
  },
  getBankTransferBook: (client, message) => {

  },
  getTranstactionInformation: (client, message) => {

  },
  getInventory: (client, message) => {

  },
  getLeaderboard: (client, message) => {

  },
  makeMoneyTransfer: (client, message) => {

  },
  buyItem: (client, message) => {

  }
}
