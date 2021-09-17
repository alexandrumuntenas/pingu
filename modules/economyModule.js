const makeId = require('./makeId')

module.exports = {
  getMoney: (client, message) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getMoney',
      name: 'Economy (getMoney)'
    })
    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [message.guild.id, message.author.id], (err, result) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        let money = parseInt(result[0].amount)
        money = money + Math.round(Math.random() * (25 - 15) + 15)
        client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [money, message.author.id, message.guild.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
        })
      } else {
        client.pool.query('INSERT INTO `guildEconomyUserBank` (`eban`, `member`, `guild`, `amount`) VALUES (?, ?, ?, ?)', [makeId(27), message.author.id, message.guild.id, Math.round(Math.random() * (25 - 15) + 15)])
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
