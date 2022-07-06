import stringPlaceholder from 'string-placeholder'
import { existsSync } from 'fs'
import Consolex from './consolex'

function obtenerTraduccion (traduccion: string, idioma?: string, parametros?: Object): string {
  let idiomaAUsar = idioma || 'es-ES'
  if (!existsSync(`./core/locales/${idiomaAUsar}.json`)) {
    Consolex.gestionarError(`No se encontró el archivo de idioma ${idiomaAUsar}.json`)
    idiomaAUsar = 'es-ES'
  }

  let textoTraducido = require(`./locales/${idiomaAUsar}.json`)[traduccion] // skipcq: JS-0359

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

const avaliableLocales: string[] = []

export { obtenerTraduccion, avaliableLocales }
