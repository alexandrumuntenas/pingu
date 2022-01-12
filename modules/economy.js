/* eslint-disable node/no-callback-literal */

module.exports.getDailyMoney = async (client, member, callback) => {
  const EgM = client.console.sentry.startTransaction({
    op: 'economy.getDailyMoney',
    name: 'Economy (getDailyMoney)'
  })
  const dailyMoney = Math.round(Math.random() * (100 - 5) + 5)

  module.exports.getMemberInventoryAndBalance(client, member, (memberInventoryAndBalance) => {
    module.exports.updateMemberBalance(client, member, (parseInt(memberInventoryAndBalance.amount) + dailyMoney), () => {
      if (callback) callback(dailyMoney)
    })
  })
  EgM.finish()
}

module.exports.getWorkMoney = async (client, member, callback) => {
  const EgM = client.console.sentry.startTransaction({
    op: 'economy.getWorkMoney',
    name: 'Economy (getWorkMoney)'
  })
  const workMoney = Math.floor(Math.random() * 1500) + 1000

  module.exports.getMemberInventoryAndBalance(client, member, (memberInventoryAndBalance) => {
    module.exports.updateMemberBalance(client, member, (parseInt(memberInventoryAndBalance.amount) + workMoney), () => {
      if (callback) callback(workMoney)
    })
  })
  EgM.finish()
}

module.exports.getMemberInventoryAndBalance = async (client, member, callback) => {
  const EfM = client.console.sentry.startTransaction({
    op: 'economy.getMemberInventoryAndBalance',
    name: 'Economy (getMemberInventoryAndBalance)'
  })
  client.pool.query('SELECT * FROM `guildEconomyUserBank` WHERE guild = ? AND member = ?', [member.guild.id, member.id], (err, rows) => {
    if (err) client.logError(err)
    if (err) throw new Error('DB_ERROR')
    if (Object.prototype.hasOwnProperty.call(rows, 0)) {
      callback(rows[0])
    } else {
      client.pool.query('INSERT INTO `guildEconomyUserBank` (`member`, `guild`) VALUES (?, ?)', [member.id, member.guild.id], (err) => {
        if (err) client.logError(err)
        if (err) throw new Error('DB_ERROR')
        module.exports.getMemberInventoryAndBalance(client, member, callback)
      })
    }
  })
  EfM.finish()
}

module.exports.getLeaderboard = (client, message) => {
  // TODO: Hacer la función getLeaderboard
}

module.exports.fetchShopProducts = (client, guild, callback) => {
  client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ?', [guild.id], (err, shopProducts) => {
    if (err) client.logError(err)
    if (shopProducts && Object.prototype.hasOwnProperty.call(shopProducts, 0)) {
      callback(shopProducts)
    } else {
      throw new Error('ECO_XX02')
    }
  })
}

module.exports.getShopProduct = (client, guild, productname, callback) => {
  client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productName = ? OR productId = ? LIMIT 1', [guild.id, productname, productname], (err, rows) => {
    if (err) client.logError(err)
    if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
      if (callback) callback(rows[0])
    } else {
      if (callback) callback()
    }
  })
}

module.exports.updateMemberBalance = (client, member, newBalance, callback) => {
  client.pool.query('UPDATE `guildEconomyUserBank` SET `balance` = ? WHERE `member` = ? AND `guild` = ?', [newBalance, member.id, member.guild.id], (err) => {
    if (err) client.logError(err)
    if (callback) callback()
  })
}

module.exports.updateMemberInventory = (client, member, newInventory, callback) => {
  client.pool.query('UPDATE `guildEconomyUserBank` SET `inventory` = ? WHERE `member` = ? AND `guild` = ?', [newInventory, member.id, member.guild.id], (err) => {
    if (err) client.logError(err)
    if (callback) callback()
  })
}

module.exports.addItemToMemberInventory = (inventoryFromDB, productToAdd, callback) => {
  let productQuantity = 1

  if (productToAdd.buyOnlyOne) productQuantity = -1

  const parsedInventoryFromDB = JSON.parse(inventoryFromDB)

  if (parsedInventoryFromDB[productToAdd.productId]) {
    if (!productToAdd.buyOnlyOne) {
      if (productToAdd.functionType !== 'giveRole' && productToAdd.functionType !== 'sendMessage') { if (callback) return callback(inventoryFromDB) }
      parsedInventoryFromDB[productToAdd.productId] = parseInt(parsedInventoryFromDB[productToAdd.productId]) + productQuantity
    }
    if (productToAdd.buyOnlyOne) parsedInventoryFromDB[productToAdd.productId] = parseInt(parsedInventoryFromDB[productToAdd.productId])
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
}

module.exports.checkIfMemberHasProduct = (client, member, productId, callback) => {
  module.exports.getMemberInventoryAndBalance(client, member, (memberInventoryAndBalance) => {
    if (memberInventoryAndBalance.inventory) {
      const inventory = JSON.parse(memberInventoryAndBalance.inventory)
      if (Object.prototype.hasOwnProperty.call(inventory, productId)) {
        return callback(true)
      } else {
        return callback(false)
      }
    } else {
      return callback(false)
    }
  })
}

module.exports.checkIfTheProductShouldOnlyBePurchasedOnce = (client, productNameOrId, guild, callback) => {
  module.exports.getShopProduct(client, guild, productNameOrId, (shopProduct) => {
    const { buyOnlyOne } = JSON.parse(shopProduct.productMeta)
    if (buyOnlyOne) {
      return callback(true)
    } else {
      return callback(false)
    }
  })
}

module.exports.executeItemFunctions = (client, member, shopProduct, callback) => {
  const { action } = JSON.parse(shopProduct.productProperties)

  if (action && Object.prototype.hasOwnProperty.call(action, 'type')) {
    switch (action.type) {
      case 'sendMessage': {
        if (Object.prototype.hasOwnProperty.call(action, 'message') && Object.prototype.hasOwnProperty.call(action, 'channel')) {
          member.guild.channels.fetch(action.channel).then(channel => {
            if (channel) {
              channel.send(action.message)
              if (callback) callback(null, 'sendMessage')
            } else {
              if (callback) callback(Error('PRODUCT:INVALIDCHANNEL'))
            }
          })
        } else {
          if (callback) callback(Error('PRODUCT:INVALIDCONFIGURATION'))
        }
        break
      }
      case 'giveRole': {
        if (Object.prototype.hasOwnProperty.call(action, 'role')) {
          member.guild.roles.fetch(action.role).then(role => {
            if (role) {
              member.roles.add(role)
              if (callback) callback(null, 'giveRole')
            } else {
              if (callback) callback(Error('PRODUCT:INVALIDROLE'))
            }
          })
        } else {
          if (callback) callback(Error('PRODUCT:INVALIDCONFIGURATION'))
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
