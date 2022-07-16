// evento: string, funcion: Function, tipo: string | number
class EventHook {
  evento
  funcion
  tipo
  constructor (evento, funcion, tipo) {
    this.evento = evento
    this.funcion = funcion
    this.tipo = tipo
  }

  execute (...args) {
    this.funcion(...args)
  }
}
export default EventHook
