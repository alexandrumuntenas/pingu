const { analizarMensaje } = require("./moderation/ia_toxicity")

module.exports.GestorIncializadorDeAccionesEnmessageCreate = (message) => {
  analizarMensaje(message)
}
