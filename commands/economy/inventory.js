const { MessageEmbed } = require('discord.js')
const { fetchInventory, fetchShopProduct } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'inventory',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      message.channel.send(`<a:loader:871389840904695838> ${getLocales(locale, 'INVENTORY_PRELOADER')}`).then((inventoryMessage) => {
        fetchInventory(client, message.member, message.guild, (inventory) => {
          const inventoryEmbed = new MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL())
            .setTitle(getLocales(locale, 'INVENTORY_TITLE'))
            .setColor('#633bdf')
            .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
          if (inventory) {
            let inventoryString = ''
            const inventoryData = JSON.parse(inventory.data)
            const inventoryDataProducts = Object.keys(inventoryData)
            if (inventoryDataProducts.length > 0) {
              try {
                let inventoryDataProductsIndex = 0
                inventoryDataProducts.forEach((productId) => {
                  inventoryDataProductsIndex++
                  const product = inventoryData[productId]
                  fetchShopProduct(client, message.guild, product.productId, (productData) => {
                    inventoryString += `${productData.productName} - ${productData.productId} (x${product.productQuantity})\n`
                    if (inventoryDataProductsIndex === inventoryDataProducts.length) {
                      inventoryEmbed.setDescription(inventoryString)
                      inventoryMessage.edit({ content: 'Loaded!', embeds: [inventoryEmbed] })
                    }
                  })
                })
              } catch (error) {
                client.Sentry.captureException(error)
              }
            } else {
              inventoryEmbed.setDescription(getLocales(locale, 'INVENTORY_EMPTY')).setImage('https://cdn.discordapp.com/attachments/908413370665938975/908414689451597824/empty_inventory.png')
              inventoryMessage.edit({ content: 'Loaded!', embeds: [inventoryEmbed] })
            }
          }
        })
      })
    } else {
      genericMessages.error.noavaliable(message, locale)
    }
  }
}
