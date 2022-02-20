const stringPlaceholder = require('string-placeholder')
const { handleError } = require('../functions/consolex')
const { existsSync } = require('fs')

/**
 * Solicitar la traducción para la i18n a través de string-placeholder
 * @param {String} idioma El idioma del servidor
 * @param {String} key La clave del array de los idiomas
 * @param {Array<Object>} placeholders Los datos para reemplazar los placeholders
 */
module.exports = (language, key, placeholders) => {
  if (!existsSync(`./i18n/locales/${language}.json`)) {
    handleError(`No se encontró el archivo de idioma ${language}.json`)
    language = 'es'
  }

  let translation = require(`./locales/${language}.json`)[key]

  if (placeholders) {
    try {
      translation = stringPlaceholder(translation, placeholders, { before: '%', after: '%' })
    } catch (err) {
      if (err) {
        translation = 'Error al intentar obtener la traducción para este mensaje (╯°□°）╯︵ ┻━┻'
        handleError(err)
      }
    }
  }

  if (!translation) translation = 'Error al intentar obtener la traducción para este mensaje (╯°□°）╯︵ ┻━┻'

  return translation
}
