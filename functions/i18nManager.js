const stringPlaceholder = require('string-placeholder')
const { gestionarError } = require('./consolex')
const { existsSync } = require('fs')

/**
 * Solicitar la traducción para la i18n a través de string-placeholder
 * @param {String} language El idioma del servidor
 * @param {String} key La clave del array de los idiomas
 * @param {Array<Object>} placeholders Los datos para reemplazar los placeholders
 */
module.exports = (language, key, placeholders) => {
  let languageToUse = language || 'es-ES'
  if (!existsSync(`./i18n/locales/${languageToUse}.json`)) {
    gestionarError(`No se encontró el archivo de idioma ${languageToUse}.json`)
    languageToUse = 'es-ES'
  }

  let translation = require(`./locales/${languageToUse}.json`)[key]

  if (placeholders) {
    try {
      translation = stringPlaceholder(translation, placeholders, { before: '%', after: '%' })
    } catch (err) {
      if (err) {
        translation = 'Error al intentar obtener la traducción para este mensaje (╯°□°）╯︵ ┻━┻'
        gestionarError(err)
      }
    }
  }

  if (!translation) translation = 'Error al intentar obtener la traducción para este mensaje (╯°□°）╯︵ ┻━┻'

  return translation
}
