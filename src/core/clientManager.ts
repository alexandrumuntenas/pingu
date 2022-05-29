const { readdirSync, mkdirSync } = require('fs')

const consolex = require('./consolex')
const eliminarArchivos = require('./utils/eliminarArchivos')

module.exports.eliminadorArchivosTemporales = () => {
  try {
    eliminarArchivos(readdirSync('./temp'))
  } catch {
    mkdirSync('./temp')
    consolex.info('Eliminador de Archivos temporales ha creado el directorio de archivos temporales')
    eliminarArchivos(readdirSync('./temp'))
  }
}

/** Establecer intervalo en el cual se ejecutará el eliminador de archivos temporales */

setInterval(() => {
  module.exports.eliminadorArchivosTemporales()
}, 300000)
