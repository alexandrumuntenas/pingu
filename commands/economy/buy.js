const { buyItem, fetchShopProduct } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'buy',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      if (message.args && Object.prototype.hasOwnProperty.call(message.args, 0)) {
        const product = message.content.replace(`${message.database.guildPrefix}buy `, '').trim()
        fetchShopProduct(client, message.guild, product, (productData) => {
          if (productData) {
            buyItem(client, message.member, message.guild, productData, (status) => {
              if (status) {
                genericMessages.success(message, getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.error(message, getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
              }
            })
          } else {
            genericMessages.error(message, getLocales(locale, 'BUYPRODUCT_NOTFOUND', { PRODUCT_NAME: product }))
          }
        })
      } else {
        client.commands.get('shop').execute(client, locale, message)
      }
    } else {
      genericMessages.error.noavaliable(message, locale)
    }
  }
}
