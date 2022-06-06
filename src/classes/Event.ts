class Event {
  nombre: string
  funcion: Function

  constructor (nombre: string, funcion: Function) {
    this.nombre = nombre
    this.funcion = funcion
  }

  execute (...args: Array<any>): void {
    this.funcion(...args)
  }
}

export default Event
