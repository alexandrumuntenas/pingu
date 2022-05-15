const Consolex = require('./consolex')
const { inyectarEnEventoFuncionesDeTerceros } = require('./eventManager')

const modulos = []

/**
 * Registra un módulo en el listado de módulos
 * @param {Object} modulo - Objeto con la información del módulo
 * @param {String} modulo.nombre - Nombre del módulo
 * @param {?String} modulo.descripcion - Descripción del módulo
 * @param {Array} modulo.comandos - Comandos del módulo
 * @param {Array} modulo.hooks - Array de objetos con la información de los hooks
 */

module.exports.registrarModulo = (modulo) => {
  // eslint-disable-next-line no-constant-condition
  if (!typeof modulo === 'object') throw new Error('El módulo debe ser un objeto')

  if (!Object.prototype.hasOwnProperty.call(modulo, 'nombre') &&
  !Object.prototype.hasOwnProperty.call(modulo, 'descripcion') &&
  !Object.prototype.hasOwnProperty.call(modulo, 'comandos')) throw new Error('El módulo no tiene nombre, descripción o comandos')

  if (!process.Client.comandos) throw new Error('Debe ejecutar esta función después de que el cliente haya cargado los comandos.')

  modulo.comandos = process.Client.comandos.filter(command => command.module === modulo.nombre) || []
  Consolex.info(`ModuleManager: El módulo ${modulo.nombre} acoge los comandos ${modulo.comandos.map(command => command.name).join(', ')}`)

  if (!modulos.find(m => m.nombre === modulo.nombre)) {
    Consolex.success(`ModuleManager: Módulo ${modulo.nombre} registrado`)
    modulos.push(modulo)
    if (modulo.hooks) {
      modulo.hooks.forEach(hook => {
        Consolex.info(`ModuleManager: Registrando hook en evento ${hook.evento} para módulo ${modulo.nombre}`)
        inyectarEnEventoFuncionesDeTerceros(hook.event, hook.function, hook.type)
      })
    }
  } else {
    Consolex.error(`ModuleManager: Módulo ${modulo.nombre} ya registrado`)
  }
}

const { readdirSync } = require('fs')

module.exports.registrarModulos = () => {
  const directorioDeModulos = readdirSync('./modules')
  directorioDeModulos.forEach(modulo => {
    if (modulo.endsWith('.js') && !modulo.endsWith('dev.js')) {
      const { nombre, descripcion, hooks, modeloDeConfiguracion } = require(`../modules/${modulo}`)
      module.exports.registrarModulo({ nombre: nombre || modulo.replace('.js', ''), descripcion, hooks, modeloDeConfiguracion })
    }
  })

  return modulos
}

module.exports.modulosDisponibles = modulos

module.exports.comprobarSiElModuloExiste = (modulo) => {
  if (!modulos.find(m => m.nombre === modulo)) return false
  return true
}
