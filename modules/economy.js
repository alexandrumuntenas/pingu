const StringPlaceholder = require('string-placeholder')
const getLocales = require('../i18n/getLocales')

module.exports = {
  getMoney: async (client, member, guild, callback) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getMoney',
      name: 'Economy (getMoney)'
    })
    const plusNumber = Math.round(Math.random() * (100 - 5) + 5)

    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [guild.id, member.id], (err, result) => {
      if (err) {
        client.Sentry.captureException(err)
        client.log.error(err)
      }
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [(parseInt(result[0].amount) + plusNumber), member.id, guild.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
        })
      } else {
        client.pool.query('INSERT INTO `guildEconomyUserBank` (`member`, `guild`, `amount`) VALUES (?, ?, ?)', [member.id, guild.id, plusNumber], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
        })
      }
    })

    if (callback) callback(plusNumber)
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
  fetchInventory: (client, member, guild, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyUserInventory` WHERE guild = ? AND member = ?', [guild.id, member.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.hasOwnProperty.call(rows, '0')) {
        callback(rows[0])
      } else {
        client.pool.query('INSERT INTO `guildEconomyUserInventory` (`guild`, `member`, `data`) VALUES (?, ?, ?)', [guild.id, member.id, '[]'])
        module.exports.fetchInventory(client, member, guild, callback)
      }
    })
  },
  getLeaderboard: (client, message) => {

  },
  makeMoneyTransferToUser: (client, message) => {

  },
  fetchShopProducts: (client, guild, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ?', [guild.id], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows)
      } else {
        callback(null)
      }
    })
  },
  fetchShopProduct: (client, guild, product, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productName = ?', [guild.id, product], (err, rows) => {
      if (err) client.Sentry.captureException(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productId = ?', [guild.id, product], (err, rows) => {
          if (err) client.Sentry.captureException(err)
          if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
            callback(rows[0])
          } else {
            callback(null)
          }
        })
      }
    })
  },
  buyItem: (client, member, guild, productData, isInteraction, callback) => {
    module.exports.fetchUserAccount(client, member, guild, (userAccount) => {
      const status = []
      if (parseInt(productData.productPrice) <= parseInt(userAccount.amount)) {
        if (isInteraction) {
          module.exports.itemActivate(client, member, guild, productData, (iaData, continueBuying) => {
            status.ia = iaData
            if (continueBuying) module.exports.updateUserAccount(client, member, guild, parseInt(userAccount.amount) - parseInt(productData.productPrice), () => { })
            if (continueBuying) status.code = true
            status.code = status.code || false
            callback(status)
          })
        } else {
          module.exports.updateUserAccount(client, member, guild, parseInt(userAccount.amount) - parseInt(productData.productPrice), () => { })
          module.exports.addItemToUser(client, member, guild, productData.productId, productData.productQuantity)
          status.code = status.code || false
          callback(status)
        }
      } else {
        callback(status.code || false)
      }
    })
  },
  updateUserAccount: (client, member, guild, amount, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [amount, member.id, guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
      callback()
    })
  },
  addItemToUser: (client, member, guild, productId, productQuantity, callback) => {
    module.exports.fetchInventory(client, member, guild, (inventory) => {
      if (inventory) {
        const inventoryData = JSON.parse(inventory.data)
        if (inventoryData[productId]) {
          inventoryData[productId] = { productId: productId, productQuantity: parseInt(inventoryData[productId].productQuantity) + (productQuantity || 1) }
        } else {
          inventoryData[productId] = { productId: productId, productQuantity: productQuantity || 1 }
        }
        client.pool.query('UPDATE `guildEconomyUserInventory` SET data = ? WHERE guild = ? AND member = ?', [JSON.stringify(inventoryData.filter(product => product !== null)), guild.id, member.id])
        if (callback) callback()
      }
    })
  },
  itemActivate: (client, member, guild, item, callback) => {
    if (Object.prototype.hasOwnProperty.call(item, 'productMeta')) {
      item.productMeta = JSON.parse(item.productMeta)

      const actions = item.productMeta.actions
      const userInputRequirements = item.productMeta.properties
      const userInputs = {}
      Object.keys(actions).forEach(action => {
        const actionToExecute = actions[action]
        if (Object.prototype.hasOwnProperty.call(actionToExecute, 'type')) {
          switch (actionToExecute.type) {
            case 'sendMessage': {
              let propertiesString = ''

              if (userInputRequirements.length > 0) {
                if (item.userInput) {
                  userInputRequirements.forEach(userInputRequirement => {
                    userInputs[userInputRequirement] = 1
                  })
                  item.userInput.forEach(property => {
                    property = property.split(':')
                    if (userInputs[property[0].trim()] && property[1]) {
                      userInputs[property[0]] = property[1].trim()
                    }
                  })
                  Object.keys(userInputs).forEach(userInput => {
                    if (!userInputs[userInput] || userInputs[userInput] === 1) {
                      delete userInputs[userInput]
                      propertiesString += ` ${userInput}`
                    }
                  })
                  if (propertiesString) {
                    callback(getLocales(guild.locale, 'BUYPRODUCT_MISSING_PROPERTY', { PROPERTY: propertiesString }), false)
                    return
                  }
                } else {
                  userInputRequirements.forEach(userInputRequirement => { propertiesString += ` ${userInputRequirement}` })
                  callback(getLocales(guild.locale, 'BUYPRODUCT_MISSING_PROPERTY', { PROPERTY: propertiesString }), false)
                  return
                }
              }
              if (Object.prototype.hasOwnProperty.call(actionToExecute, 'message')) {
                if (Object.prototype.hasOwnProperty.call(actionToExecute, 'channel')) {
                  actionToExecute.message = StringPlaceholder(actionToExecute.message, userInputs, { before: '#', after: '#' })
                  guild.channels.fetch(actionToExecute.channel).then(channel => {
                    if (channel) {
                      channel.send(actionToExecute.message || 'Nothing', true)
                      callback(null, true)
                    } else {
                      callback(getLocales(guild.locale, 'BUYPRODUCT_SENDMESSAGE_ERROR'), false)
                    }
                  })
                } else {
                  callback(actionToExecute.message, true)
                }
              }
              break
            }
            case 'giveRole': {
              if (Object.prototype.hasOwnProperty.call(actionToExecute, 'role')) {
                guild.roles.fetch(actionToExecute.role).then(role => {
                  if (role) {
                    member.roles.add(role)
                    callback(getLocales(guild.locale, 'BUYPRODUCT_GIVEROLE', { ROLE: role }), true)
                  } else {
                    callback(getLocales(guild.locale, 'BUYPRODUCT_GIVEROLE_ERROR'), false)
                  }
                })
              } else {
                callback(getLocales(guild.locale, 'BUYPRODUCT_GIVEROLE_ERROR'), false)
              }
            }
          }
        }
        if (Object.prototype.hasOwnProperty.call(actionToExecute, 'remove_on_buy') && actionToExecute.remove_on_buy !== '1') module.exports.addItemToUser(client, member, guild, item.productId, item.productQuantity)
      })
    } else {
      module.exports.addItemToUser(client, member, guild, item.productId, item.productQuantity, () => {
        callback(null, true)
      })
    }
  }
}
