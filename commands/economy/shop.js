const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { getShopProduct, fetchShopProducts } = require('../../modules/economy')
const { Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

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
          .setDescription(i18n(locale, 'SHOP::EMBED:DESCRIPTION'))
          .setColor('#2F3136')
          .setFooter({ text: 'Powered by Pingu', iconURL: client.user.displayAvatarURL() })

        let productList = ''
        fetchShopProducts(client, interaction.guild, (shopProductsData) => {
          if (shopProductsData) {
            shopProductsData.forEach(shopProduct => {
              productList += `\`${shopProduct.productName}\` [${shopProduct.productPrice} ${interaction.database.economyCurrencyIcon} ${interaction.database.economyCurrency}]\n`
            })
            shopEmbed.addField(i18n(locale, 'PRODUCTS'), productList)
            interaction.editReply({ embeds: [shopEmbed] })
          } else {
            interaction.editReply({ embeds: [shopEmbed] })
          }
        })
      } else {
        getShopProduct(client, interaction.guild, interaction.options.getString('productname'), (productData) => {
          if (productData) {
            const productEmbed = new MessageEmbed()
              .setColor('#2F3136')
              .setAuthor({ name: `${interaction.guild.name} Shop`, iconURL: interaction.guild.iconURL() })
              .setTitle(productData.productName)
              .setImage(productData.productImage)
              .addField(`${interaction.database.economyCurrencyIcon} ${i18n(locale, 'PRICE')}`, `${productData.productPrice} ${interaction.database.economyCurrency}`, true)
              .addField(`:robot: ${i18n(locale, 'BUY')}`, `\`/buy ${productData.productName}\``, true)
              .setFooter({ text: 'Powered by Pingu', iconURL: client.user.displayAvatarURL() })

            if (productData.productDescription) productEmbed.setDescription(productData.productDescription)

            interaction.editReply({ embeds: [productEmbed] })
          } else {
            interaction.editReply({ embeds: [Error(i18n(locale, 'SHOP::NOTFOUND'))] })
          }
        })
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOTAVALIABLE'))] })
    }
  }
}
