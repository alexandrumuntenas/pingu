const modeloToxicidad = require('@tensorflow-models/toxicity')

const threshold = 0.9

const modelo = modeloToxicidad.load(threshold)

module.exports.analizarMensaje = (message, callback) => {
  modelo.classify(message.content).then(predictions => {
    console.log(predictions)
  })
  callback()
}
