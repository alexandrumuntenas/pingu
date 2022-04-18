const { analizarMensaje } = require("./moderacion/toxicidad.ia")

module.exports.GestorIncializadorDeAccionesEnmessageCreate = (message) => {
  analizarMensaje(message)
}
