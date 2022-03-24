const { MessageEmbed } = require('discord.js')
const { codeBlock } = require('@discordjs/builders')

module.exports.plantillas = {}

/**
 * Plantilla para los estados. Se utiliza para mostrar
 * la situación en el cual se encuentra, por ejemplo,
 * la configuración de un módulo,
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.estado = message => new MessageEmbed()
  .setColor('#2F3136')
  .setDescription(`<:pingu_null:876103457860370442> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para mostrar un mensaje temporal en las
 * situaciones en el cual se requiere de más de 2 segundos
 * para devolver la respuesta final al usuario. Así se da
 * la sensación de que el bot está trabajando en su respuesta
 * y que el usuario no ha sido ignorado.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.carga = message => new MessageEmbed()
  .setColor('#FEE75C')
  .setDescription(`<a:loader:927223896330084412> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes que indican que una acción
 * se ha realizado correctamente.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.conexito = message => new MessageEmbed()
  .setColor('#57F287')
  .setDescription(`<:Blurple_verified_plain:938094790132764682> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes que indican que una acción
 * no ha podido ser realizada debido a un error.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.error = message => new MessageEmbed()
  .setColor('#ED4245')
  .setDescription(`<:blurple_employee:939096196801257472> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes que solo devuelven una info.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.informacion = message => new MessageEmbed()
  .setColor('#5865F2')
  .setDescription(`:information_source: ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes que solo devuelven una imagen.
 * @param {URL} imageURL
 * @param {String} imageProvider
 * @returns MessageEmbed
 */

module.exports.plantillas.imagen = (imageURL, imageProvider) => new MessageEmbed()
  .setColor('#2F3136')
  .setImage(imageURL)
  .setDescription(`<:blurple_image:892443053359517696> Image via ${imageProvider} API.`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes relacionados con la espera para una acción.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.contador = message => new MessageEmbed()
  .setColor('#F3375C')
  .setImage('https://cdn.discordapp.com/attachments/908413370665938975/939097943036809247/hearties-daniel-lissing.gif')
  .setDescription(`<:timeout_clock:937404313901359114> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes de ayuda del bot
 * @param {Object} command - Objeto con la información del comando
 * @param {String} command.name - Nombre del comando
 * @param {String} command.description - Descripción del comandp
 * @param {String} command.cooldown - Cooldown del comando
 * @param {String} command.module - Módulo del comando
 * @param {String} command.parameters - Parámetros del comando.
 * @param {Array.<{name:string,description:string,parameters:string,isNSFW:boolean}>} command.subcommands - Subcomandos del comando
 * @returns {Array.<MessageEmbed>}
 */

module.exports.plantillas.ayuda = command => {
  if (!command) {
    throw new Error('No command provided')
  }

  const embedOptions = new MessageEmbed()
    .setColor('#5865F2')
    .setTitle(`${command.name} • Options`)
    .setDescription(`${command.description || 'No description'}\n\n<:timeout_clock:937404313901359114> Cooldown: ${command.cooldown || '10'}\n<:blurple_guide:937404928706617445> Module: ${command.module || 'No category'}\n${command.parameters ? codeBlock(`${command.name} ${command.parameters}`) : ''}`)
    .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
    .setTimestamp()

  if (command.subcommands) {
    const subcommands = command.subcommands.filter(subcommand => !subcommand.isNSFW)
    const subcommandsNSFW = command.subcommands.filter(subcommand => subcommand.isNSFW)

    if (subcommands) {
      subcommands.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `<:blurple_bot:938094998283501569> Syntax:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true))
    }

    if (subcommandsNSFW) {
      subcommandsNSFW.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `:underage: Syntax:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true))
    }
  }

  return [embedOptions]
}
