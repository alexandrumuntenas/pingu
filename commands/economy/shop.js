const { MessageEmbed } = require('discord.js')
const { fetchShopProduct, fetchShopProducts } = require('../../modules/economy')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 5000,
  name: 'shop',
  executeLegacy (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      if (!Object.prototype.hasOwnProperty.call(message.args, 0)) {
        const shopEmbed = new MessageEmbed()
          .setTitle(`${message.guild.name} Shop`)
          .setDescription('Use `/shop <item name>` or `/shop <item id>` to get more details about an item.\n Use `/buy <item name>` or `/buy <item id>` to buy an item.')
          .setColor('#633bdf')
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

        let productList = ''
        fetchShopProducts(client, message.guild, (shopProductsData) => {
          if (shopProductsData) {
            shopProductsData.forEach(shopProduct => {
              productList += `\`${shopProduct.productName}\` [${shopProduct.productPrice} ${message.database.economyCurrencyIcon} ${message.database.economyCurrency}]\n`
            })
            shopEmbed.addField('Products', productList)
            message.channel.send({ embeds: [shopEmbed] })
          } else {
            message.channel.send({ embeds: [shopEmbed] })
          }
        })
      } else {
        fetchShopProduct(client, message.guild, message.content.replace(`${message.database.guildPrefix}shop `, '').trim(), (productData) => {
          if (productData) {
            const productEmbed = new MessageEmbed()
              .setColor('#633bdf')
              .setAuthor(`${message.guild.name} Shop`, message.guild.iconURL())
              .setTitle(productData.productName)
              .setImage(productData.productImage)
              .addField(`${message.database.economyCurrencyIcon} ${getLocales(locale, 'SHOP_PRODUCTPRICE')}`, `${productData.productPrice} ${message.database.economyCurrency}`, true)
              .addField(`:robot: ${getLocales(locale, 'SHOP_COMMANDTOBUY')}`, `\`${message.database.guildPrefix}buy ${productData.productName}\``, true)
              .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

            if (productData.productDescription) productEmbed.setDescription(productData.productDescription)

            message.channel.send({ embeds: [productEmbed] })
          } else {
            genericMessages.legacy.error(message, getLocales(locale, 'SHOP_PRODUCTNOTFOUND'))
          }
        })
      }
    } else {
      genericMessages.legacy.error.noavaliable(message, locale)
    }
  }
}
