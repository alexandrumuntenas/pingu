import Module from './classes/Module'
import Consolex from './consolex'

import { ClientCommandsManager, ClientEventManager } from '../client'
import { readdirSync } from 'fs'
class ModuleManager {
  modulosDisponibles: Array<Module>

  constructor () {
    if (!ClientCommandsManager) throw new Error('¡Se ha ejecutado el constructor de ModuleManager antes de CommandsManager!')

    this.modulosDisponibles = []

    const directorioDeModulos = readdirSync('./modules')
    directorioDeModulos.forEach((modulo) => {
      if (modulo.endsWith('.js') && !modulo.endsWith('dev.js')) {
        this.registrarModulo(require(`../modules/${modulo}`)) // skipcq: JS-0359
      }
    })
  }

  registrarModulo (modulo: Module): Array<Module> {
    modulo.asignarComandos(ClientCommandsManager.toArray().filter((command) => command.module === modulo.nombre) || [])
    Consolex.info(`ModuleManager: El módulo ${modulo.nombre} acoge los comandos ${modulo.comandos.map((command) => command.name).join(', ')}`)

    if (!this.modulosDisponibles.find((m) => m.nombre === modulo.nombre)) {
      Consolex.success(`ModuleManager: Módulo ${modulo.nombre} registrado`)
      this.modulosDisponibles.push(modulo)
      if (modulo.hooks) {
        modulo.hooks.forEach((hook) => {
          Consolex.info(`ModuleManager: Registrando hook en evento ${hook.evento} para módulo ${modulo.nombre}`)
          ClientEventManager.inyectarEnEventoFuncionDeTercero(hook)
        })
      }
    } else {
      Consolex.error(`ModuleManager: Módulo ${modulo.nombre} ya registrado`)
    }

    return this.modulosDisponibles
  }

  getModulosDisponibles (): Array<Module> {
    return this.modulosDisponibles
  }

  getModulo (modulo: string): Module {
    return this.modulosDisponibles.find((m) => m.nombre === modulo)
  }

  comprobarSiElModuloExiste (modulo: string): Boolean {
    if (!this.modulosDisponibles.find((m) => m.nombre === modulo)) return false
    return true
  }
}

export default ModuleManager
