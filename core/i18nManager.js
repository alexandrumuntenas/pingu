const stringPlaceholder = require('string-placeholder')
const { gestionarError } = require('./consolex')
const { existsSync, statSync } = require('fs')

/**
 * @param {String} idioma
 * @param {String} traduccion
 * @param {Array<Object>} parametros
 */
module.exports.getTranslation = (idioma, traduccion, parametros) => {
  let idiomaAUsar = idioma || 'es-ES'
  if (!existsSync(`./core/locales/${idiomaAUsar}.json`)) {
    gestionarError(`No se encontró el archivo de idioma ${idiomaAUsar}.json`)
    idiomaAUsar = 'es-ES'
  }

  let textoTraducido = require(`./locales/${idiomaAUsar}.json`)[traduccion]

  if (parametros) {
    try {
      textoTraducido = stringPlaceholder(textoTraducido, parametros, { before: '%', after: '%' })
    } catch (err) {
      if (err) {
        textoTraducido = 'Error al intentar ajustar la traducción'
        gestionarError(err)
      }
    }
  }

  if (!textoTraducido) textoTraducido = 'Error al intentar obtener la traducción'

  return textoTraducido
}

const avaliableLocales = []

module.exports.registerLocale = (locale) => {
  if (statSync(`./core/locales/${locale}.json`).isFile()) return avaliableLocales.push(locale)
  throw new Error(`Se ha intentado registrar un idioma que no existe o no está disponible: ${locale}`)
}

module.exports.avaliableLocales = avaliableLocales
