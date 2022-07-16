class Event {
  nombre
  funcion
  constructor (nombre, funcion) {
    this.nombre = nombre
    this.funcion = funcion
  }

  execute (...args) {
    this.funcion(...args)
  }
}
export default Event
