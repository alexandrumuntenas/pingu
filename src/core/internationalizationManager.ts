import stringPlaceholder from 'string-placeholder'
import { readdirSync } from 'fs'
import Consolex from './consolex.js'

class InternationalizationManager {
  idiomasDisponibles: string[]
  traducciones: { [ idioma: string ]: { [ clave: string ]: string } }

  constructor () {
    this.idiomasDisponibles = []
    this.traducciones = {}

    const idiomas = readdirSync('../locales')
    idiomas.forEach((archivoIdioma) => {
      if (archivoIdioma.endsWith('.json')) {
        this.idiomasDisponibles.push(archivoIdioma.replace('.json', '').trim())
        import(`../../locales/${archivoIdioma.replace('.json', '').trim()}`, { assert: { type: 'json' } }).then((contenidos) => {
          this.traducciones[archivoIdioma.replace('.json', '').trim()] = contenidos.default
        })
      }
    })
  }

  obtenerTraduccion (traduccionSolicitada: { clave: string, idioma?: string, placeholders?: Array<string> }): string {
    let textoTraducido: string

    if (traduccionSolicitada?.idioma && !this.idiomasDisponibles.includes(traduccionSolicitada.idioma)) {
      Consolex.error(`[i18n Utils] INE001: The requested translation file ${traduccionSolicitada.idioma} has not been found. Using es-ES as fallback.`)
      traduccionSolicitada.idioma = 'es-ES'
    }

    textoTraducido = this.traducciones[traduccionSolicitada.idioma || 'es-ES'][traduccionSolicitada.clave]

    if (!textoTraducido) {
      Consolex.error(`[i18n Utils] INE002: The key specified "${traduccionSolicitada.clave}" to obtain your translation does not exist. Returning error to the requester.`)
      return `INE002: The key specified "${traduccionSolicitada.clave}" to obtain your translation does not exist. Returning error to the requester.`
    }

    if (traduccionSolicitada?.placeholders) {
      traduccionSolicitada?.placeholders.forEach((parametro, posicion) => {
        const placeholder: { [index: string]: string } = {}
        placeholder[posicion.toString()] = parametro

        try {
          textoTraducido = stringPlaceholder(textoTraducido, placeholder, { before: '{', after: '}' })
        } catch (error) {
          Consolex.error('[i18n Utils] INE003: Error when trying to adjust the translation.')
        }
      })
    }

    return textoTraducido
  }
}

export default InternationalizationManager
