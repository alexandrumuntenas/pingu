// evento: string, funcion: Function, tipo: string | number

class EventHook {
  evento: string
  funcion: Function
  tipo: string | number

  constructor (evento: string, funcion: Function, tipo?: string | number) {
    this.evento = evento
    this.funcion = funcion
    this.tipo = tipo
  }

  execute (...args: Array<any>): void {
    this.funcion(...args)
  }
}

export default EventHook
