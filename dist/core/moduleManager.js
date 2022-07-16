import Consolex from './consolex.js'
import { ClientCommandsManager, ClientEventManager } from '../client.js'
import { readdirSync } from 'fs'
class ModuleManager {
  modulosDisponibles
  nombresModulosDisponibles
  constructor () {
    if (!ClientCommandsManager) { throw new Error('¡Se ha ejecutado el constructor de ModuleManager antes de CommandsManager!') }
    this.modulosDisponibles = []
    this.nombresModulosDisponibles = []
    const directorioDeModulos = readdirSync('./modules')
    directorioDeModulos.forEach(async (modulo) => {
      if (modulo.endsWith('.js') && !modulo.endsWith('dev.js')) {
        this.registrarModulo(await import(`../modules/${modulo}`)) // skipcq: JS-0359
      }
    })
  }

  registrarModulo (modulo) {
    modulo.asignarComandos(ClientCommandsManager.toArray().filter((command) => command.module === modulo.nombre) || [])
    Consolex.info(`ModuleManager: El módulo ${modulo.nombre} acoge los comandos ${modulo.comandos?.map((command) => command.name).join(', ')}`)
    if (!this.modulosDisponibles.find((m) => m.nombre === modulo.nombre)) {
      Consolex.success(`ModuleManager: Módulo ${modulo.nombre} registrado`)
      this.modulosDisponibles.push(modulo)
      this.nombresModulosDisponibles.push(modulo.nombre)
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

  getModulosDisponibles () {
    return this.modulosDisponibles
  }

  getModulo (modulo) {
    return this.modulosDisponibles.find((m) => m.nombre === modulo)
  }

  comprobarSiElModuloExiste (modulo) {
    if (!this.modulosDisponibles.find((m) => m.nombre === modulo)) { return false }
    return true
  }
}
export default ModuleManager
