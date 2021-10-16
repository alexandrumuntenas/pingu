const makeId = require('./makeId')
const talkedRecently = new Set()

module.exports = {
  getMoney: (client, message) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getMoney',
      name: 'Economy (getMoney)'
    })
    if (!message.content.startsWith(message.database.guildPrefix)) {
      if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
        talkedRecently.add(`${message.author.id}_${message.guild.id}`)
        setTimeout(() => {
          talkedRecently.delete(`${message.author.id}_${message.guild.id}`)
        }, 60000)
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
      }
    }
    EgM.finish()
  },
  fetchConfig: (client, guild, callback) => {
    const EfC = client.Sentry.startTransaction({
      op: 'economy.fetchConfig',
      name: 'Economy (fetchConfig)'
    })
    client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        const data = { economyBankName: rows[0].economyBankName, economyBankLogo: rows[0].economyBankLogo, economyUseGlobalBank: rows[0].economyUseGlobalBank, economyCurrency: rows[0].economyCurrency }
        callback(data)
      } else {
        callback(new Error('NO_DATA'))
      }
    })
    EfC.finish()
  },
  fetchUserAccount: (client, message, callback) => {
    const EfM = client.Sentry.startTransaction({
      op: 'economy.fetchUserAccount',
      name: 'Economy (fetchUserAccount)'
    })
    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [message.guild.id, message.author.id], (err, rows) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      callback(rows[0] || null)
    })
    EfM.finish()
  },
  fetchLatestTransactions: (client, message, callback) => {
    const EfLT = client.Sentry.startTransaction({
      op: 'economy.fetchLatestTransactions',
      name: 'Economy (fetchLatestTransactions)'
    })
    client.pool.query('SELECT * FROM `guildEconomyBankTransferBook` WHERE `emisor` LIKE ? AND `member` LIKE ? ORDER BY `timeStamp` DESC LIMIT 5', [message.guild.id, message.author.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows.length > 0) {
        callback(rows)
      } else {
        callback(new Error('NO_DATA'))
      }
    })
    EfLT.finish()
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
