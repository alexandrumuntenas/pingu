const { SlashCommandBuilder } = require('@discordjs/builders')
const { buyItem, fetchShopProduct } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'buy',
  description: '💳 Buy a shop product',
  cooldown: 5000,
  interactionData: new SlashCommandBuilder()
    .setName('buy').setDescription('💳 Buy a shop product')
    .addStringOption(option => option.setName('productname').setDescription('Enter the product name you want to buy'))
    .addStringOption(option => option.setName('properties').setDescription('Additional properties needed to buy the product')),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (interaction.options.getString('productname')) {
        interaction.guild.locale = locale
        fetchShopProduct(client, interaction.guild, interaction.options.getString('productname'), (productData) => {
          if (productData) {
            if (interaction.options.getString('properties')) productData.userInput = interaction.options.getString('properties').split(',')
            buyItem(client, interaction.member, interaction.guild, productData, true, (status) => {
              if (status.code) {
                genericMessages.success(interaction, status.ia || getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.error(interaction, status.ia || getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
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
            buyItem(client, interaction.member, interaction.guild, productData, false, (status) => {
              if (status.code) {
                genericMessages.legacy.success(interaction, status.ia || getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.legacy.error(interaction, status.ia || getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
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
