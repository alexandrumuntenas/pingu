class Module {
  nombre
  descripcion
  hooks
  comandos
  modeloDeConfiguracion
  configuracionPredeterminada
  constructor (nombre, descripcion, hooks, modeloDeConfiguracion, configuracionPredeterminada) {
    this.nombre = nombre
    this.descripcion = descripcion
    this.hooks = hooks
    this.modeloDeConfiguracion = modeloDeConfiguracion
    this.configuracionPredeterminada = configuracionPredeterminada
  }

  asignarComandos (comandos) {
    this.comandos = comandos
  }

  obtenerComandos () {
    return this.comandos || []
  }
}
export default Module
