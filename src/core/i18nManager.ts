import stringPlaceholder from 'string-placeholder'
import { existsSync } from 'fs'
import Consolex from './consolex'

function obtenerTraduccion (traduccionSolicitada: { clave: string, idioma?: string, placeholders?: Array<string> }): string {
  if (traduccionSolicitada?.idioma && !existsSync(`-/core/locales/${traduccionSolicitada?.idioma}.json`)) {
    Consolex.gestionarError(`[i18n Utils] INE001: The requested translation file ${traduccionSolicitada?.idioma} has not been found. Using es-ES as fallback.`)
  }

  let textoTraducido = require(`./locales/${traduccionSolicitada?.idioma || 'es-ES'}.json`)[traduccionSolicitada.clave]

  if (!textoTraducido) {
    Consolex.gestionarError(`[i18n Utils] INE002: The key specified "${traduccionSolicitada.clave}" to obtain your translation does not exist. Returning error to the requester.`)
    return `INE002: The key specified "${traduccionSolicitada.clave}" to obtain your translation does not exist. Returning error to the requester.`
  }

  if (traduccionSolicitada?.placeholders) {
    traduccionSolicitada?.placeholders.forEach((parametro, posicion) => {
      const placeholder: { [index: string]: string } = {}
      placeholder[posicion.toString()] = parametro

      try {
        textoTraducido = stringPlaceholder(textoTraducido, placeholder, { before: '{', after: '}' })
      } catch (error) {
        Consolex.gestionarError('[i18n Utils] INE003: Error when trying to adjust the translation.')
      }
    })
  }

  return textoTraducido
}

const avaliableLocales: string[] = []

export { obtenerTraduccion, avaliableLocales }
