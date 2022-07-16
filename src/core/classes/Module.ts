import Command from './Command.js'
import EventHook from './EventHook.js'

class Module {
  nombre: string
  descripcion: string
  hooks: Array<EventHook>
  comandos?: Array<Command>
  modeloDeConfiguracion: Object
  configuracionPredeterminada: Object

  constructor (nombre: string, descripcion: string, hooks: Array<EventHook>, modeloDeConfiguracion: Object, configuracionPredeterminada: Object) {
    this.nombre = nombre
    this.descripcion = descripcion
    this.hooks = hooks
    this.modeloDeConfiguracion = modeloDeConfiguracion
    this.configuracionPredeterminada = configuracionPredeterminada
  }

  asignarComandos (comandos: Array<Command>): void {
    this.comandos = comandos
  }

  obtenerComandos (): Array<Command> {
    return this.comandos || []
  }
}

export default Module
