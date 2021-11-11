const makeId = require('./makeId')
const talkedRecently = new Set()

const transactionTypeReference = { income: 1, outcome: 2, buy: 3, transfer: 4 }

module.exports = {
  getMoney: async (client, member, guild, timeFromVC) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getMoney',
      name: 'Economy (getMoney)'
    })
    if (!talkedRecently.has(`${member.id}_${guild.id}`)) {
      talkedRecently.add(`${member.id}_${guild.id}`)
      setTimeout(() => {
        talkedRecently.delete(`${member.id}_${guild.id}`)
      }, 60000)
      let plusNumber
      if (timeFromVC) {
        plusNumber = Math.round(Math.random() * (25 - 15) + 15) * (timeFromVC / 60)
      } else {
        plusNumber = Math.round(Math.random() * (10 - 5) + 5)
      }

      client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [guild.id, member.id], (err, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (Object.prototype.hasOwnProperty.call(result, 0)) {
          const money = parseInt(result[0].amount) + plusNumber
          client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [money, member.id, guild.id], (err) => {
            if (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
          })
        } else {
          client.pool.query('INSERT INTO `guildEconomyUserBank` (`eban`, `member`, `guild`, `amount`) VALUES (?, ?, ?, ?)', [makeId(27), member.id, guild.id, plusNumber], (err) => {
            if (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
            client.pool.query('INSERT INTO `guildEconomyBankTransferBook` (`transactionID`, `emisor`, `member`, `newQuantity`, `type`) VALUES (?, ?, ?, ?, 1)', [makeId(64), guild.id, member.id, plusNumber])
          })
        }
      })
    }
    EgM.finish()
  },
  fetchConfig: async (client, guild, callback) => {
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
  fetchUserAccount: async (client, member, guild, callback) => {
    const EfM = client.Sentry.startTransaction({
      op: 'economy.fetchUserAccount',
      name: 'Economy (fetchUserAccount)'
    })
    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [guild.id, member.id], (err, rows) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      if (Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        module.exports.getMoney(client, member, guild, false)
        module.exports.fetchUserAccount(client, member, guild, callback)
      }
    })
    EfM.finish()
  },
  fetchLatestTransactions: async (client, guild, member, callback) => {
    const EfLT = client.Sentry.startTransaction({
      op: 'economy.fetchLatestTransactions',
      name: 'Economy (fetchLatestTransactions)'
    })
    client.pool.query('SELECT * FROM `guildEconomyBankTransferBook` WHERE `guild` LIKE ? AND `member` LIKE ? ORDER BY `timeStamp` DESC LIMIT 5', [guild.id, member.id], (err, rows) => {
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
  fetchInventory: (client, member, guild, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyUserInventory` WHERE guild = ? AND member = ?', [member.id, guild.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.hasOwnProperty.call(rows, '0')) {
        callback(rows)
      }
    })
  },
  getLeaderboard: (client, message) => {

  },
  makeMoneyTransferToUser: (client, message) => {

  },
  fetchShop: (client, guild, shopFriendlyId, callback) => {
    const EfS = client.Sentry.startTransaction({
      op: 'economy.fetchShop',
      name: 'Economy (fetchShop)'
    })
    client.pool.query('SELECT * FROM `guildEconomyShops` WHERE guild = ? AND shopFriendlyId = ?', [guild.id, shopFriendlyId], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        callback(null)
      }
    })
    EfS.finish()
  },
  fetchShopProducts: (client, shopId, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE shopId = ?', [shopId], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows)
      } else {
        callback(null)
      }
    })
  },
  fetchShopProduct: (client, productId, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE productId = ?', [productId], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        callback(null)
      }
    })
  },
  buyItem: (client, member, guild, productId) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productId = ?', [guild.id, productId], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        const product = rows[0]

        module.exports.fetchUserAccount(client, member, guild, (userAccount) => {
          if (product.productPrice >= userAccount.amount) {
            const transactionData = {}
            transactionData.transactionOldAmount = userAccount.amount
            transactionData.transactionNewAmount = userAccount.amount - product.productPrice
            transactionData.transactionType = 'buy'
            transactionData.metadata = { productId: product.productId, productName: product.productName, productPrice: product.productPrice }

            module.exports.updateUserAccount(client, member, guild, () => { })
            module.exports.doTransaction(client, member, guild, guild, transactionData, 'buy')
            module.exports.addItemToUser(client, member, guild, product.productId, product.productQuantity, () => { })
          }
        })
      }
    })
  },
  updateUserAccount: (client, member, guild, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [member.id, guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
      callback()
    })
  },
  doTransaction: (client, member, emisor, guild, transactionData, callback) => {
    client.pool.query('INSERT INTO `guildEconomyBankTransferBook` (`transactionID`, `emisor`, `member`, `guild`, `previousQuantity`, `newQuantity`, `type`, metadata) VALUES (?, ?, ?, ?, ?, ?, 1)', [makeId(64), emisor, member.id, guild.id, parseInt(transactionData.transactionOldAmount || 0), transactionData.transactionNewAmount, transactionTypeReference[transactionData.transactionType], transactionData.metadata || null], (err) => {
      if (err) client.Sentry.captureException(err)
    })
  },
  addItemToUser: (client, member, guild, productId, productQuantity, callback) => {
    module.exports.fetchInventory(client, member, guild, (inventory) => {
      if (inventory) {
        const inventoryData = JSON.parse(inventory.data)
        inventoryData[productId] = inventoryData[productId].productQuantity + productQuantity || 0
        console.log(inventoryData)
      }
    })
  }
}
