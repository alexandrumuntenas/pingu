import Module from '../classes/Module'
import Consolex from './consolex'

import { ClientCommandsManager } from '../client'
import { inyectarEnEventoFuncionDeTercero } from './eventManager'
import { readdirSync } from 'fs'

const modulosDisponibles = []

function registrarModulo (modulo: Module): Array<Module> {
  if (!ClientCommandsManager) throw new Error('Debe ejecutar esta función después de que el cliente haya cargado los comandos.')

  modulo.asignarComandos(ClientCommandsManager.toArray().filter(command => command.module === modulo.nombre) || [])
  Consolex.info(`ModuleManager: El módulo ${modulo.nombre} acoge los comandos ${modulo.comandos.map(command => command.name).join(', ')}`)

  if (!modulosDisponibles.find((m) => m.nombre === modulo.nombre)) {
    Consolex.success(`ModuleManager: Módulo ${modulo.nombre} registrado`)
    modulosDisponibles.push(modulo)
    if (modulo.hooks) {
      modulo.hooks.forEach((hook) => {
        Consolex.info(`ModuleManager: Registrando hook en evento ${hook.evento} para módulo ${modulo.nombre}`)
        inyectarEnEventoFuncionDeTercero(hook)
      })
    }
  } else {
    Consolex.error(`ModuleManager: Módulo ${modulo.nombre} ya registrado`)
  }

  return modulosDisponibles
}

function registrarModulos () {
  const directorioDeModulos = readdirSync('./modules')
  directorioDeModulos.forEach(modulo => {
    if (modulo.endsWith('.js') && !modulo.endsWith('dev.js')) {
      registrarModulo(require(`../modules/${modulo}`))
    }
  })

  return modulosDisponibles
}

function comprobarSiElModuloExiste (modulo: string): Boolean {
  if (!modulosDisponibles.find((m) => m.nombre === modulo)) return false
  return true
}

export { registrarModulo, registrarModulos, comprobarSiElModuloExiste, modulosDisponibles }
