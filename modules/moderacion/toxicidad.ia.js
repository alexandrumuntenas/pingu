const modeloToxicidad = require('@tensorflow-models/toxicity')

module.exports.analizarMensaje = (message, callback) => {
  modeloToxicidad.load(0.9).then(modelo => modelo.classify(message.content)).then(prediccion => {
    prediccion.forEach(prediccion => {
      console.log(prediccion)
      console.log('\n\n\n')
    })
  })
}
