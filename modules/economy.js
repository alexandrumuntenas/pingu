/* eslint-disable node/no-callback-literal */
const StringPlaceholder = require('string-placeholder')

module.exports = {
  getDailyMoney: async (client, member, guild, callback) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getDailyMoney',
      name: 'Economy (getDailyMoney)'
    })
    const dailyMoney = Math.round(Math.random() * (100 - 5) + 5)

    module.exports.getMemberInventoryAndBalance(client, member, guild, (memberInventoryAndBalance) => {
      client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [(parseInt(memberInventoryAndBalance.amount) + dailyMoney), member.id, guild.id], (err) => {
        if (err) client.logError(err)
        if (err) throw new Error('DB_ERROR')
        if (callback && !err) callback(dailyMoney)
      })
    })
    EgM.finish()
  },
  getWorkMoney: async (client, member, guild, callback) => {
    const EgM = client.Sentry.startTransaction({
      op: 'economy.getWorkMoney',
      name: 'Economy (getWorkMoney)'
    })
    const workMoney = Math.floor(Math.random() * 1500) + 1000

    module.exports.getMemberInventoryAndBalance(client, member, guild, (memberInventoryAndBalance) => {
      client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [(parseInt(memberInventoryAndBalance.amount) + workMoney), member.id, guild.id], (err) => {
        if (err) client.logError(err)
        if (err) throw new Error('DB_ERROR')
        if (callback && !err) callback(workMoney)
      })
    })
    EgM.finish()
  },
  getMemberInventoryAndBalance: async (client, member, guild, callback) => {
    const EfM = client.Sentry.startTransaction({
      op: 'economy.getMemberInventoryAndBalance',
      name: 'Economy (getMemberInventoryAndBalance)'
    })
    client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [guild.id, member.id], (err, rows) => {
      if (err) client.logError(err)
      if (err) throw new Error('DB_ERROR')
      if (Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        client.pool.query('INSERT INTO `guildEconomyUserBank` (`member`, `guild`) VALUES (?, ?)', [member.id, guild.id], (err) => {
          if (err) client.logError(err)
          if (err) throw new Error('DB_ERROR')
          module.exports.getMemberInventoryAndBalance(client, member, guild, callback)
        })
      }
    })
    EfM.finish()
  },
  getLeaderboard: (client, message) => {

  },
  makeMoneyTransferToUser: (client, guild, fromUser, toUser, moneyToTransfer, callback) => {
    module.exports.getMemberInventoryAndBalance(client, fromUser, guild, (fromUserInventoryAndBalance) => {
      if (fromUserInventoryAndBalance.amount >= moneyToTransfer) {
        module.exports.getMemberInventoryAndBalance(client, toUser, guild, (toUserInventoryAndBalance) => {
          try {
            module.exports.updateMemberBalance(client, fromUser, guild, (parseInt(fromUserInventoryAndBalance.amount) - moneyToTransfer))
            module.exports.updateMemberBalance(client, fromUser, guild, (parseInt(toUserInventoryAndBalance.amount) + moneyToTransfer))
          } catch (err) {
            client.logError(err)
          }
        })
      } else {
        throw new Error('ECO_XX01')
      }
    })
  },
  fetchShopProducts: (client, guild, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ?', [guild.id], (err, shopProducts) => {
      if (err) client.logError(err)
      if (shopProducts && Object.prototype.hasOwnProperty.call(shopProducts, 0)) {
        callback(shopProducts)
      } else {
        throw new Error('ECO_XX02')
      }
    })
  },
  getShopProduct: (client, guild, productname, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productName = ? OR productId = ? LIMIT 1', [guild.id, productname, productname], (err, rows) => {
      if (err) client.logError(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        if (callback) callback(rows[0])
      } else {
        if (callback) callback()
      }
    })
  },
  updateMemberBalance: (client, member, guild, newBalance, callback) => {
    // TODO: Update column name from "amount" to "balance"
    client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [newBalance, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      if (callback) callback()
    })
  },
  updateMemberInventory: (client, member, guild, newInventory, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `inventory` = ? WHERE `member` = ? AND `guild` = ?', [newInventory, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      if (callback) callback()
    })
  },
  addItemToMemberInventory: (inventoryFromDB, productToAdd, callback) => {
    // TODO: Replace the property "singlebuy" with "buyOnlyOne".

    let productQuantity = 1

    if (productToAdd.singlebuy) productQuantity = -1

    const parsedInventoryFromDB = JSON.parse(inventoryFromDB)

    if (parsedInventoryFromDB[productToAdd.productId]) {
      if (!productToAdd.singlebuy) parsedInventoryFromDB[productToAdd.productId] = parseInt(parsedInventoryFromDB[productToAdd.productId]) + productQuantity
      if (productToAdd.singlebuy) parsedInventoryFromDB[productToAdd.productId] = parseInt(parsedInventoryFromDB[productToAdd.productId])
    } else {
      parsedInventoryFromDB[productToAdd.productId] = productQuantity
    }

    Object.keys(parsedInventoryFromDB).forEach(product => {
      if (parsedInventoryFromDB[product] === null) {
        delete parsedInventoryFromDB[product]
      }
    })

    const newInventory = JSON.stringify(parsedInventoryFromDB)

    if (callback) callback(newInventory)
  },
  checkIfMemberHasProduct: (client, member, guild, productId) => {
    module.exports.getMemberInventoryAndBalance(client, member, guild, (memberInventoryAndBalance) => {
      if (memberInventoryAndBalance.inventory) {
        const inventory = JSON.parse(memberInventoryAndBalance.inventory)
        if (Object.prototype.hasOwnProperty.call(inventory, productId)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })
  },
  executeItemFunctions: (client, member, guild, shopProduct, callback) => {
    // TODO: Change the column name from "productMeta" to "productProperties". The code changes will be commented and highlighted.

    const productProperties = JSON.parse(shopProduct.productMeta)
    // * const productProperties = JSON.parse(shopProduct.productProperties)

    const { action, properties } = productProperties
    // * const { action, memberInputRequirements } = productProperties

    // Properties are the placeholders for the values that are passed to the function. In the future will have a better name.

    const memberInputRequirements = properties
    let memberInput
    if (member.inputs) memberInput = member.inputs.split(',')

    if (Array.isArray(memberInputRequirements) && memberInputRequirements.length >= 0 && Array.isArray(memberInput)) {
      module.exports.processMemberInputs(memberInput, memberInputRequirements, (processedInputs) => {
        if (Object.prototype.hasOwnProperty.call(processedInputs, 'code')) { if (callback) callback(processedInputs) }
        processAndExecuteAction(processedInputs)
      })
    } else {
      processAndExecuteAction()
    }

    function processAndExecuteAction (processedInputs) {
      if (action && Object.prototype.hasOwnProperty.call(action, 'type')) {
        switch (action.type) {
          case 'sendMessage': {
            if (Object.prototype.hasOwnProperty.call(action, 'message') && Object.prototype.hasOwnProperty.call(action, 'channel')) {
              guild.channels.fetch(action.channel).then(channel => {
                if (channel) {
                  channel.send(StringPlaceholder(action.message, processedInputs, { before: '#', after: '#' }) || 'Nothing')
                  if (callback) callback()
                } else {
                  if (callback) callback(Error('ECO_ATI05'))
                }
              })
            } else {
              if (callback) callback(Error('ECO_ATI07'))
            }
            break
          }
          case 'giveRole': {
            if (Object.prototype.hasOwnProperty.call(action, 'role')) {
              guild.roles.fetch(action.role).then(role => {
                if (role) {
                  member.roles.add(role)
                  if (callback) callback()
                } else {
                  if (callback) callback(Error('ECO_ATI06'))
                }
              })
            } else {
              if (callback) callback(Error('ECO_ATI07'))
            }
            break
          }
          default: {
            if (callback) callback()
            break
          }
        }
      }
    }
  },
  processMemberInputs: (memberInput, memberInputRequirements, callback) => {
    const memberInputOrganized = {}
    const missingInputs = []

    let count = 0
    memberInputRequirements.forEach(userInputRequirement => {
      count++
      memberInputOrganized[userInputRequirement] = 'null'
      if (memberInputRequirements.length === count) asignValuesToMemberInputOrganized()
    })

    function asignValuesToMemberInputOrganized () {
      count = 0
      memberInput.forEach(input => {
        count++
        const getPropertyAndItsValue = input.split(':')
        if (memberInputOrganized[getPropertyAndItsValue[0]]) memberInputOrganized[getPropertyAndItsValue[0]] = getPropertyAndItsValue[1]

        if (memberInput.length === count) removePropertiesNoExistents()
      })
    }

    function removePropertiesNoExistents () {
      const memberInputOrganizedKeys = Object.keys(memberInputOrganized)
      count = 0
      memberInputOrganizedKeys.forEach(input => {
        count++
        if (memberInputOrganized[input] === 'null') {
          delete memberInputOrganized[input]
          missingInputs.push(input)
        }
        if (memberInputOrganizedKeys.length === count) {
          if (Array.isArray(missingInputs) && missingInputs.length > 0) {
            if (callback) callback({ code: 'ECO_BU05', missingInputs: missingInputs })
          } else {
            if (callback) callback(memberInputOrganized)
          }
        }
      })
    }
  }
}
