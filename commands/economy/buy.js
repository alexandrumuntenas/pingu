const { SlashCommandBuilder } = require('@discordjs/builders')
const { buyItem, fetchShopProduct } = require('../../modules/economy')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
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
            buyItem(client, interaction.member, interaction.guild, productData, (status) => {
              if (status.code) {
                interaction.editReply({ embeds: [Success(status.ia || i18n(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))] })
              } else {
                interaction.editReply({ embeds: [Error(status.ia || i18n(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))] })
              }
            })
          } else {
            interaction.editReply({ embeds: [Error(i18n(locale, 'BUYPRODUCT_NOTFOUND', { PRODUCT_NAME: interaction.options.getString('productname') }))] })
          }
        })
      } else {
        client.commands.get('shop').executeInteraction(client, locale, interaction)
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND_NO_AVALIABLE'))] })
    }
  }
}
