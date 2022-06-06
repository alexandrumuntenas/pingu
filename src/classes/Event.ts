class Event {
  nombre: string
  funcion: Function

  constructor (nombre: string, funcion: Function) {
    this.nombre = nombre
    this.funcion = funcion
  }

  execute (...args: Array<any>) {
    this.funcion(...args)
  }
}

export default Event
