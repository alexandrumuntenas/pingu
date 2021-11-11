const { buyItem, fetchShopProduct } = require('../../modules/economyModule')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'buy',
  execute (client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      if (message.args && Object.prototype.hasOwnProperty.call(message.args, 0)) {
        fetchShopProduct(client, message.args[0], (productData) => {
          if (productData) {
            buyItem(client, message.member, message.guild, productData, (status) => {
              if (status) {
                genericMessages.Success(message, getLocales(locale, 'BUYPRODUCT_SUCCESS', { PRODUCT_NAME: productData.productName }))
              } else {
                genericMessages.Error.customerror(message, getLocales(locale, 'BUYPRODUCT_NOMONEY', { PRODUCT_NAME: productData.productName }))
              }
            })
          } else {
            genericMessages.Error.customerror(message, getLocales(locale, 'BUYPRODUCT_NOTFOUND', { PRODUCT_NAME: message.args[0] }))
          }
        })
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
