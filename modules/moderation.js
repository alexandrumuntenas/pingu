const { analizarMensaje } = require("./moderacion/toxicidad.ia")

module.exports.GestorIncializadorDeAccionesEnmessageCreate = (message) => {
  analizarMensaje(message)
}

module.exports.aplicarAcciones = (accion, motivo, callback) => {

}
