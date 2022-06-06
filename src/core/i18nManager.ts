import stringPlaceholder from 'string-placeholder'
import { existsSync, statSync } from 'fs'
import Consolex from './consolex'

function obtenerTraduccion (idioma: string, traduccion: string, parametros?: Array<object>) {
  let idiomaAUsar = idioma || 'es-ES'
  if (!existsSync(`./core/locales/${idiomaAUsar}.json`)) {
    Consolex.gestionarError(`No se encontró el archivo de idioma ${idiomaAUsar}.json`)
    idiomaAUsar = 'es-ES'
  }

  let textoTraducido = require(`./locales/${idiomaAUsar}.json`)[traduccion]

  if (parametros) {
    try {
      textoTraducido = stringPlaceholder(textoTraducido, parametros, { before: '%', after: '%' })
    } catch (err) {
      if (err) {
        textoTraducido = 'Error al intentar ajustar la traducción'
        Consolex.gestionarError(err)
      }
    }
  }

  if (!textoTraducido) textoTraducido = 'Error al intentar obtener la traducción'

  return textoTraducido
}

const avaliableLocales = []

function registrarIdioma (locale: string) {
  if (statSync(`./core/locales/${locale}.json`).isFile()) return avaliableLocales.push(locale)
  throw new Error(`Se ha intentado registrar un idioma que no existe o no está disponible: ${locale}`)
}

module.exports.avaliableLocales = avaliableLocales

export { obtenerTraduccion, registrarIdioma, avaliableLocales }
