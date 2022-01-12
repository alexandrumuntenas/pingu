const { SlashCommandBuilder } = require('@discordjs/builders')
const { getMemberInventoryAndBalance, getShopProduct, checkIfMemberHasProduct, addItemToMemberInventory, updateMemberBalance, updateMemberInventory, checkIfTheProductShouldOnlyBePurchasedOnce, executeItemFunctions } = require('../../modules/economy')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'buy',
  description: '💳 Buy a shop product',
  cooldown: 5000,
  interactionData: new SlashCommandBuilder()
    .setName('buy').setDescription('💳 Buy a shop product')
    .addStringOption(option => option.setName('productname').setDescription('Enter the product name you want to buy')),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (interaction.options.getString('productname')) {
        getMemberInventoryAndBalance(client, interaction.member, (memberInventoryAndBalance) => {
          getShopProduct(client, interaction.guild, interaction.options.getString('productname'), (shopProduct) => {
            if (shopProduct) {
              if (memberInventoryAndBalance >= shopProduct.productPrice) {
                checkIfTheProductShouldOnlyBePurchasedOnce(client, shopProduct.productName, interaction.guild, (shouldBeOnlyPurchasedOnce) => {
                  checkIfMemberHasProduct(client, interaction.member, shopProduct.productId, (memberHasProduct) => {
                    if (shouldBeOnlyPurchasedOnce && memberHasProduct) return interaction.editReply({ embeds: [Error(i18n(locale, 'BUY::ALREADYOWN'))] })
                    executeItemFunctions(client, interaction.member, shopProduct, (err, functionType) => {
                      if (err) return interaction.editReply({ embeds: [Error(i18n(locale, `BUY::${err.message}`))] })
                      shopProduct.functionType = functionType
                      addItemToMemberInventory(memberInventoryAndBalance.inventory, shopProduct, (newInventory) => {
                        updateMemberInventory(client, interaction.member, newInventory)
                      })
                      updateMemberBalance(client, interaction.member, (parseInt(memberInventoryAndBalance.balance) - shopProduct.productPrice))
                      interaction.editReply({ embeds: [Success(i18n(locale, 'BUY::SUCCESS', { ITEM: interaction.options.getString('productname') }))] })
                    })
                  })
                })
              } else {
                interaction.editReply({ embeds: [Error(i18n(locale, 'BUY::NOMONEY', { ITEM: interaction.options.getString('productname') }))] })
              }
            } else {
              interaction.editReply({ embeds: [Error(i18n(locale, 'BUY::NOTFOUND', { ITEM: interaction.options.getString('productname') }))] })
            }
          })
        })
      } else {
        client.commands.get('shop').executeInteraction(client, locale, interaction)
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
