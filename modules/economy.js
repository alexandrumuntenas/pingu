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
  getShopProduct: (client, guild, product, callback) => {
    client.pool.query('SELECT * FROM `guildEconomyProducts` WHERE guild = ? AND productName = ? LIMIT 1', [guild.id, product], (err, rows) => {
      if (err) client.logError(err)
      if (rows && Object.prototype.hasOwnProperty.call(rows, 0)) {
        callback(rows[0])
      } else {
        throw new Error('ECO_XX03')
      }
    })
  },
  updateMemberBalance: (client, member, guild, amount, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `amount` = ? WHERE `member` = ? AND `guild` = ?', [amount, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      callback()
    })
  },
  updateMemberInventory: (client, member, guild, inventory, callback) => {
    client.pool.query('UPDATE `guildEconomyUserBank` SET `inventory` = ? WHERE `member` = ? AND `guild` = ?', [inventory, member.id, guild.id], (err) => {
      if (err) client.logError(err)
      callback()
    })
  }
  /*
  buyItem: (client, member, guild, productData, callback) => { // WTF IS GOING HERE?
    module.exports.getMemberInventoryAndBalance(client, member, guild, (memberInventoryAndBalance) => {
      const status = []
      if (parseInt(memberInventoryAndBalance.amount) >= parseInt(productData.productPrice)) {
        module.exports.itemActivate(client, member, guild, productData, (iaData, continueBuying) => {
          status.ia = iaData
          if (continueBuying) module.exports.updateMemberBalance(client, member, guild, parseInt(memberInventoryAndBalance.amount) - parseInt(productData.productPrice), () => { })
          if (continueBuying) status.code = true
          status.code = status.code || false
          callback(status)
        })
      } else {
        callback(status.code || false)
      }
    })
  },
  addItemToUser: (client, member, guild, productId, singlebuy, callback) => {
    module.exports.getMemberInventoryAndBalance(client, member, guild, (account) => {
      if (account) {
        let productQuantity = 1

        singlebuy = singlebuy || false
        if (singlebuy) productQuantity = -1

        const inventoryData = JSON.parse(account.inventory)
        if (inventoryData[productId]) {
          if (!singlebuy) {
            inventoryData[productId] = parseInt(inventoryData[productId]) + productQuantity
            if (callback) callback()
          } else {
            if (callback) callback('error')
          }
        } else {
          inventoryData[productId] = productQuantity
          if (callback) callback()
        }
        Object.keys(inventoryData).forEach(key => {
          if (inventoryData[key] === null) {
            delete inventoryData[key]
          }
        })
        client.pool.query('UPDATE `guildEconomyUserBank` SET inventory = ? WHERE guild = ? AND member = ?', [JSON.stringify(inventoryData), guild.id, member.id])
      }
    })
  },
  itemActivate: (client, member, guild, item, callback) => {
    item.productMeta = JSON.parse(item.productMeta)

    const action = item.productMeta.action
    const userInputRequirements = item.productMeta.properties
    const userInputs = {}
    if ((Object.prototype.hasOwnProperty.call(item.productMeta, 'singlebuy') && item.productMeta.singlebuy)) {
      let propertiesString = ''

      if (userInputRequirements && userInputRequirements.length > 0) {
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
            module.exports.addItemToUser(client, member, guild, item.productId, item.productMeta.singlebuy, (status) => {
              if (status === 'error') {
                callback(i18n(guild.locale, 'BUYPRODUCT_ALREADYOWN', { PRODUCT: item.productName }), false)
              } else {
                if (action && Object.prototype.hasOwnProperty.call(action, 'type')) {
                  switch (action.type) {
                    case 'sendMessage': {
                      if (Object.prototype.hasOwnProperty.call(action, 'message')) {
                        if (Object.prototype.hasOwnProperty.call(action, 'channel')) {
                          action.message = StringPlaceholder(action.message, userInputs, { before: '#', after: '#' })
                          guild.channels.fetch(action.channel).then(channel => {
                            if (channel) {
                              channel.send(action.message || 'Nothing', true)
                              callback(null, true)
                            } else {
                              callback(i18n(guild.locale, 'BUYPRODUCT_SENDMESSAGE_ERROR'), false)
                            }
                          })
                        } else {
                          callback(i18n(guild.locale, 'BUYPRODUCT_SENDMESSAGE_ERROR'), false)
                        }
                      }
                      break
                    }
                    case 'giveRole': {
                      if (Object.prototype.hasOwnProperty.call(action, 'role')) {
                        guild.roles.fetch(action.role).then(role => {
                          if (role) {
                            member.roles.add(role)
                            callback(i18n(guild.locale, 'BUYPRODUCT_GIVEROLE', { ROLE: role }), true)
                          } else {
                            callback(i18n(guild.locale, 'BUYPRODUCT_GIVEROLE_ERROR'), false)
                          }
                        })
                      } else {
                        callback(i18n(guild.locale, 'BUYPRODUCT_GIVEROLE_ERROR'), false)
                      }
                    }
                  }
                }
              }
            })
          }
        } else {
          userInputRequirements.forEach(userInputRequirement => { propertiesString += ` ${userInputRequirement}` })
          callback(i18n(guild.locale, 'BUYPRODUCT_MISSING_PROPERTY', { PROPERTY: propertiesString }), false)
        }
      }
    }
  } */
}
