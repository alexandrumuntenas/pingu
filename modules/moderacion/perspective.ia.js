const Perspective = require('perspective-api-client')
const perspective = new Perspective({ apiKey: process.env.PERSPECTIVE_API_KEY })

module.exports.analizarMensaje = (message, callback) => {
  perspective.analyze(message.content).then(resultado => {
    callback(resultado)
  })
}

module.exports.interpretarResultados = (resultado, callback) => {

}
