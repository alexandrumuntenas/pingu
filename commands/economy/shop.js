const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { fetchShopProduct, fetchShopProducts } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  module: 'economy',
  name: 'shop',
  description: '🛍️ Check the server shop.',
  cooldown: 5000,
  interactionData: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('🛍️ Check the server shop.')
    .addStringOption(option => option.setName('productname').setDescription('Enter the product name you want to checkout')),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (!interaction.options.getString('productname')) {
        const shopEmbed = new MessageEmbed()
          .setTitle(`${interaction.guild.name} Shop`)
          .setDescription('Use `/shop <item name>` or `/shop <item id>` to get more details about an item.\n Use `/buy <item name>` or `/buy <item id>` to buy an item.')
          .setColor('#633bdf')
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

        let productList = ''
        fetchShopProducts(client, interaction.guild, (shopProductsData) => {
          if (shopProductsData) {
            shopProductsData.forEach(shopProduct => {
              productList += `\`${shopProduct.productName}\` [${shopProduct.productPrice} ${interaction.database.economyCurrencyIcon} ${interaction.database.economyCurrency}]\n`
            })
            shopEmbed.addField('Products', productList)
            interaction.editReply({ embeds: [shopEmbed] })
          } else {
            interaction.editReply({ embeds: [shopEmbed] })
          }
        })
      } else {
        fetchShopProduct(client, interaction.guild, interaction.options.getString('productname'), (productData) => {
          if (productData) {
            const productEmbed = new MessageEmbed()
              .setColor('#633bdf')
              .setAuthor(`${interaction.guild.name} Shop`, interaction.guild.iconURL())
              .setTitle(productData.productName)
              .setImage(productData.productImage)
              .addField(`${interaction.database.economyCurrencyIcon} ${getLocales(locale, 'SHOP_PRODUCTPRICE')}`, `${productData.productPrice} ${interaction.database.economyCurrency}`, true)
              .addField(`:robot: ${getLocales(locale, 'SHOP_COMMANDTOBUY')}`, `\`/buy ${productData.productName}\``, true)
              .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

            if (productData.productDescription) productEmbed.setDescription(productData.productDescription)

            interaction.editReply({ embeds: [productEmbed] })
          } else {
            genericMessages.error(interaction, getLocales(locale, 'SHOP_PRODUCTNOTFOUND'))
          }
        })
      }
    } else {
      genericMessages.error.noavaliable(interaction, locale)
    }
  }
}
