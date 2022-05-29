/* eslint-disable valid-typeof */
const { modulosDisponibles } = require('../moduleManager')

function loopDeComprobacion (modeloDeConfiguracion, configuracionAComparar) {
  const errores = []
  const configuracionProcesada = {}
  const propiedadesModeloConfiguracion = Object.keys(modeloDeConfiguracion)
  const propiedadesConfiguracionAComparar = Object.keys(configuracionAComparar || {})

  let posicionArray = 0

  propiedadesModeloConfiguracion.forEach(propiedad => {
    if (propiedadesConfiguracionAComparar.includes(propiedad)) {
      if (typeof modeloDeConfiguracion[propiedad] === 'object') {
        const procesado = loopDeComprobacion(modeloDeConfiguracion[propiedad], configuracionAComparar[propiedad])
        if (procesado.error) errores.push(procesado.error)
        else configuracionProcesada[propiedad] = procesado.configuracionProcesada
        posicionArray++
      } else {
        if (typeof configuracionAComparar[propiedad] === modeloDeConfiguracion[propiedad]) configuracionProcesada[propiedad] = configuracionAComparar[propiedad]
        else errores.push(`La propiedad ${propiedad} no es del tipo ${modeloDeConfiguracion[propiedad]}`)
        posicionArray++
      }
    } else {
      errores.push(`La propiedad ${propiedad} no existe en la configuración`)
      posicionArray++
    }

    if (posicionArray === propiedadesModeloConfiguracion.length) {
      return { configuracionProcesada, errores: errores.length ? errores : [] }
    }
  })
}

module.exports = (configuracionImportada) => {
  const errores = []
  const configuracionProcesada = {}

  let posicionArray = 0

  modulosDisponibles.forEach(module => {
    if (Object.prototype.hasOwnProperty.call(configuracionImportada, module.nombre)) {
      loopDeComprobacion(module.modeloDeConfiguracion, configuracionImportada[module.nombre], procesado => {
        if (procesado.error) errores.concat(procesado.error)
        configuracionProcesada[module.nombre] = procesado.configuracionProcesada
      })
    } else {
      errores.push(`El módulo ${module.nombre} no existe en la configuración`)
    }

    posicionArray++
    if (posicionArray === modulosDisponibles.length) {
      return { configuracionProcesada, errores: errores.length ? errores : [] }
    }
  })
}
