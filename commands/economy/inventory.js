const { MessageEmbed } = require('discord.js')
const { getShopProduct, getMemberInventoryAndBalance } = require('../../modules/economy')
const { Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'inventory',
  description: '📦 Check your inventory.',
  cooldown: 1000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getMemberInventoryAndBalance(client, interaction.member, interaction.guild, (account) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor({ name: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL() })
          .setTitle(i18n(locale, 'INVENTORY::EMBED:TITLE'))
          .setColor('#2F3136')
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
        if (account) {
          let inventoryString = ''
          const inventoryData = JSON.parse(account.inventory)
          const inventoryDataProducts = Object.keys(inventoryData)
          if (inventoryDataProducts.length > 0) {
            try {
              let inventoryDataProductsIndex = 0
              inventoryDataProducts.forEach((productId) => {
                const product = inventoryData[productId]
                getShopProduct(client, interaction.guild, productId, (productData) => {
                  inventoryDataProductsIndex++
                  if (productData && product !== -1) inventoryString += `${productData.productName || 'Non existent item'} - ${productData.productId} (x${product})\n`
                  if (inventoryDataProductsIndex === inventoryDataProducts.length) {
                    inventoryEmbed
                      .setImage('https://cdn.discordapp.com/attachments/908413370665938975/927155718115688488/empty_inventory.png')
                      .setDescription(inventoryString || i18n(locale, 'INVENTORY::EMBED:EMPTY'))
                    interaction.editReply({ embeds: [inventoryEmbed] })
                  }
                })
              })
            } catch (error) {
              client.Sentry.captureException(error)
            }
          } else {
            inventoryEmbed.setDescription(i18n(locale, 'INVENTORY::EMBED:EMPTY')).setImage('https://cdn.discordapp.com/attachments/908413370665938975/927155718115688488/empty_inventory.png')
            interaction.editReply({ embeds: [inventoryEmbed] })
          }
        }
      })
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND:NOAVALIABLE'))] })
    }
  }
}
