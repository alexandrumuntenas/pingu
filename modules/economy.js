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
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productName = ? LIMIT 1', [guild.id, productname], (err, rows) => {
      if (err) client.logError(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        throw new Error('ECO_XX03')
      }
    })
  },
  updateMemberBalance: (client, member, guild, newBalance, callback) => {
    // TODO: Update column name from "amount" to "balance"
    client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [newBalance, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      callback()
    })
  },
  updateMemberInventory: (client, member, guild, newInventory, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `inventory` = ? WHERE `member` = ? AND `guild` = ?', [newInventory, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      callback()
    })
  },
  addItemToMemberInventory: (client, inventoryFromDB, productToAdd, callback) => {
    // TODO: Replace the property "singlebuy" with "buyOnlyOne".

    let productQuantity = 1

    if (productToAdd.singlebuy) productQuantity = -1

    const parsedInventoryFromDB = JSON.parse(inventoryFromDB)

    if (parsedInventoryFromDB[productToAdd.productId]) {
      if (!productToAdd.singlebuy) parsedInventoryFromDB[productToAdd.productId] = parseInt(parsedInventoryFromDB[productToAdd.productId]) + productQuantity
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
  buyItem: (client, member, guild, productname, buyproperties, callback) => {
    module.exports.getMemberInventoryAndBalance(client, member, guild, (memberInventoryAndBalance) => {
      module.exports.getShopProduct(client, guild, productname, (shopProduct) => {
        if (memberInventoryAndBalance >= shopProduct.productPrice) {
          module.exports.updateMemberBalance(client, member, guild, (parseInt(memberInventoryAndBalance.amount) - shopProduct.productPrice))
          module.exports.addItemToMemberInventory(client, memberInventoryAndBalance.inventory, shopProduct, (newInventory) => module.exports.updateMemberInventory(client, member, guild, newInventory))
          module.exports.executeItemFunctions()
        } else {
          throw new Error('ECO_XX01')
        }
      })
    })
  }/* WTF IS GOING HERE?
  executeItemFunctions: (client, member, guild, shopProduct, callback) => {
    const productMeta = JSON.parse(shopProduct.productMeta)

    const { action, properties } = productMeta
    const userInputs = {}
    if ((Object.prototype.hasOwnProperty.call(shopProduct.productMeta, 'singlebuy') && shopProduct.productMeta.singlebuy)) {
      let propertiesString = ''

      if (properties && properties.length > 0) {
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
            callback(i18n(guild.locale, 'BUYPRODUCT_MISSING_PROPERTY', { PROPERTY: propertiesString }), false)
          } else {

          }
        } else {
          userInputRequirements.forEach(userInputRequirement => { propertiesString += ` ${userInputRequirement}` })
          callback(i18n(guild.locale, 'BUYPRODUCT_MISSING_PROPERTY', { PROPERTY: propertiesString }), false)
        }
      }
    }
  }*/
}
