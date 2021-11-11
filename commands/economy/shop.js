const { MessageEmbed } = require('discord.js')
const { fetchShop, fetchShopProduct, fetchShopProducts, fetchShops } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'shop',
  execute (client, locale, message) {
    if (Object.prototype.hasOwnProperty.call(message.args, '0')) {
      const shopFriendlyId = message.args[0]
      fetchShop(client, message.guild, shopFriendlyId, (shopData) => {
        // View product directly, no category module
        if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
          const productFriendlyId = message.args[1]
          fetchShopProduct(client, productFriendlyId, (productData) => {
            if (productData) {
              const productEmbed = new MessageEmbed()
                .setColor(shopData.shopColor || '#633bdf')
                .setAuthor(shopData.shopName, shopData.shopLogo)
                .setTitle(productData.productName)
                .setImage(productData.productImage)
                .addField(':coin: Coste', `\`${productData.productPrice} ${message.database.economyCurrency}\``, true)
                .addField(':robot: Comando para comprar', `\`${message.database.guildPrefix}buyproduct ${productData.productId}\``, true)
                .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

              if (productData.productDescription) productEmbed.setDescription(productData.productDescription)

              message.channel.send({ embeds: [productEmbed] })
            } else {
              genericMessages.Error.customerror(message, getLocales(locale, 'SHOP_PRODUCTNOTFOUND'))
            }
          })
        } else {
          if (shopData) {
            const shopEmbed = new MessageEmbed()
              .setTitle(shopData.shopName)
              .setThumbnail(shopData.shopLogo)
              .setColor(shopData.shopColor || '#633bdf')
              .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
            if (shopData.shopDescription) shopEmbed.setDescription(shopData.shopDescription)
            fetchShopProducts(client, shopData.shopId, (shopProductsData) => {
              if (shopProductsData) {
                shopProductsData.forEach(shopProduct => {
                  shopEmbed.addField(`${shopProduct.productName} (${shopProduct.productId})`, `:coin: \`${shopProduct.productPrice} ${message.database.economyCurrency}\`\n:frame_photo: [\`Ver imagen\`](${shopProduct.productImage || 'about:blank'})\n\n` + (shopProduct.productDescription || getLocales(locale, 'SHOP_NODESCRIPTION')))
                })
                message.channel.send({ embeds: [shopEmbed] })
              } else {
                message.channel.send({ embeds: [shopEmbed] })
              }
            })
          } else {
            genericMessages.Error.customerror(message, getLocales(locale, 'SHOP_NOTFOUND'))
          }
        }
      })
    } else {
      fetchShops(client, message.guild, (shopsData) => {
        if (shopsData) {
          let shopList
          shopsData.forEach(shop => { shopList = `${shopList || ''}・${shop.shopName} (\`${shop.shopFriendlyId}\`)\n` })
          const shopsAvaliable = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor('#633bdf')
            .setTitle(getLocales(locale, 'SHOP_AVALIABLE_TITLE'))
            .setDescription(shopList)
            .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')

          message.channel.send({ embeds: [shopsAvaliable] })
        } else {
          genericMessages.Error.customerror(message, getLocales(locale, 'SHOP_NOEXIST'))
        }
      })
    }
  }
}
