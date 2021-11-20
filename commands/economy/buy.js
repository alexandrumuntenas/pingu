const { SlashCommandBuilder } = require('@discordjs/builders')
const { buyItem, fetchShopProduct } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 5000,
  name: 'buy',
  description: 'Buy a shop product',
  data: new SlashCommandBuilder()
    .setName('buy').setDescription('Buy a shop product')
    .addStringOption(option => option.setName('productname').setDescription('Enter the product name you want to buy')),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (interaction.options.getString('productname')) {
        fetchShopProduct(client, interaction.guild, interaction.options.getString('productname'), (productData) => {
          if (productData) {
            buyItem(client, interaction.member, interaction.guild, productData, (status) => {
              if (status) {
                genericMessages.success(interaction, getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.error(interaction, getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
              }
            })
          } else {
            genericMessages.error(interaction, getLocales(locale, 'BUYPRODUCT_NOTFOUND', { PRODUCT_NAME: interaction.options.getString('productname') }))
          }
        })
      } else {
        client.commands.get('shop').executeInteraction(client, locale, interaction)
      }
    } else {
      genericMessages.error.noavaliable(interaction, locale)
    }
  },
  executeLegacy (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (interaction.args && Object.prototype.hasOwnProperty.call(interaction.args, 0)) {
        const product = interaction.content.replace(`${interaction.database.guildPrefix}buy `, '').trim()
        fetchShopProduct(client, interaction.guild, product, (productData) => {
          if (productData) {
            buyItem(client, interaction.member, interaction.guild, productData, (status) => {
              if (status) {
                genericMessages.legacy.success(interaction, getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.legacy.error(interaction, getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
              }
            })
          } else {
            genericMessages.legacy.error(interaction, getLocales(locale, 'BUYPRODUCT_NOTFOUND', { PRODUCT_NAME: product }))
          }
        })
      } else {
        client.commands.get('shop').executeLegacy(client, locale, interaction)
      }
    } else {
      genericMessages.legacy.error.noavaliable(interaction, locale)
    }
  }
}
