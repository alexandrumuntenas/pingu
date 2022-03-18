const { unlinkSync, stat, readdirSync, mkdirSync } = require('fs')
const consolex = require('./consolex')

/** Función que elimina los archivos temporales */

function eliminarArchivos (files) {
  for (const file of files) {
    stat(`./modules/temp/${file}`, (err, stats) => {
      if (err) consolex.handleError(err)

      const fileDate = new Date(stats.birthtime)
      const now = new Date()

      if (now - fileDate >= 600000) {
        consolex.info(`Eliminador de Archivos temporales ha eliminado ${file}`)
        unlinkSync(`./modules/temp/${file}`)
      }
    })
  }
}

/**
 * Comprobar si existe directorio de archivos temporales y si no existe crearlo; luego ejecutar la función eliminarArchivos
 */

module.exports = () => {
  try {
    eliminarArchivos(readdirSync('./modules/temp'))
  } catch {
    mkdirSync('./modules/temp')
    consolex.info('Eliminador de Archivos temporales ha creado el directorio de archivos temporales')
    eliminarArchivos(readdirSync('./modules/temp'))
  }
}

/** Establecer intervalo en el cual se ejecutará el eliminador de archivos temporales */

setInterval(() => {
  module.exports()
}, 300000)
