/**
 * Generar Identificador Único
 * @param {number} longitud La longitud del identificador generado
 */
module.exports = function (length) {
  let generatedID = ''

  const charactersAvaliable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    generatedID += charactersAvaliable.charAt(Math.floor(Math.random() * charactersAvaliable.length))
  }

  return generatedID
}
