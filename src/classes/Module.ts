import Command from './Command'
import EventHook from './EventHook'

class Module {
  nombre: string
  descripcion: string
  hooks: Array<EventHook>
  comandos?: Array<Command>
  modeloDeConfiguracion: Object

  constructor (nombre: string, descripcion: string, hooks: Array<EventHook>, modeloDeConfiguracion: Object) {
    this.nombre = nombre
    this.descripcion = descripcion
    this.hooks = hooks
    this.modeloDeConfiguracion = modeloDeConfiguracion
  }

  asignarComandos (comandos: Array<Command>): void {
    this.comandos = comandos
  }

  obtenerComandos (): Array<Command> {
    return this.comandos
  }
}

export default Module
