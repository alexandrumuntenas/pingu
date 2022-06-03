module.exports.modeloDeConfiguracion = {}

const { codeBlock } = require('@discordjs/builders')
const { analizarMensaje } = require('./moderacion/perspective.ia')

module.exports.GestorIncializadorDeAccionesEnmessageCreate = (message) => {
  analizarMensaje(message, resultado => {
    message.reply(codeBlock('json', JSON.stringify(resultado, null, 2)))
  })
}

module.exports.aplicarAcciones = (accion, motivo) => {

}

module.exports.hooks = [{ event: 'messageCreate', function: module.exports.GestorIncializadorDeAccionesEnmessageCreate }]