const { MessageEmbed } = require('discord.js')
const { getMember } = require('../../modules/memberManager')
const { getShopProduct } = require('../../modules/economy')
const { Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'inventory',
  description: '📦 Check your inventory.',
  cooldown: 1000,
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getMember(client, interaction.member, (memberData) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor({ name: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL() })
          .setTitle(i18n(locale, 'INVENTORY::EMBED:TITLE'))
          .setColor('#2F3136')
          .setFooter('Powered by Pingu', client.user.displayAvatarURL())
        if (memberData) {
          let inventoryString = ''
          const inventoryData = JSON.parse(memberData.ecoInventory)
          const inventoryDataProducts = Object.keys(inventoryData)
          if (inventoryDataProducts.length > 0) {
            try {
              let inventoryDataProductsIndex = 0
              inventoryDataProducts.forEach((productId) => {
                const product = inventoryData[productId]
                getShopProduct(client, interaction.guild, productId, (productData) => {
                  inventoryDataProductsIndex++
                  if (productData && product !== -1) inventoryString += `${productData.productName || 'Non existent item'} - (x${product})\n`
                  if (inventoryDataProductsIndex === inventoryDataProducts.length) {
                    if (!inventoryString) inventoryEmbed.setImage('https://cdn.discordapp.com/attachments/908413370665938975/927155718115688488/empty_inventory.png')
                    else { inventoryEmbed.setThumbnail('https://cdn.discordapp.com/attachments/908413370665938975/917086976744767498/inventory_chest.png') }
                    inventoryEmbed
                      .setDescription(inventoryString || i18n(locale, 'INVENTORY::EMBED:EMPTY'))
                    interaction.editReply({ embeds: [inventoryEmbed] })
                  }
                })
              })
            } catch (error) {
              client.console.sentry.captureException(error)
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
