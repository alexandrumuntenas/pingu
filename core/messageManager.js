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
  .setDescription(`<:system_information:970715198509965342> ${message}`)
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

module.exports.plantillas.precargador = message => new MessageEmbed()
  .setColor('#FEE75C')
  .setDescription(`<a:core_loading:970712845429903461> ${message}`)
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
  .setDescription(`<:system_check:968432962716713010> ${message}`)
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
  .setDescription(`<:system_cross:968432962653782067> ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

/**
 * Plantilla para los mensajes que solo devuelven una info.
 * @param {String} message
 * @returns MessageEmbed
 */

module.exports.plantillas.informacion = message => new MessageEmbed()
  .setColor('#5865F2')
  .setDescription(`<:system_information:970715198509965342>    ${message}`)
  .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
  .setTimestamp()

const timeoutEmojis = ['<:system_timeout:970715618938617856>', '<:system_wait:970715593563078707>']

/**
 * Plantilla para los mensajes que solo devuelven una imagen.
 * @param {URL} imageURL
 * @param {String} imageProvider
 * @returns MessageEmbed
 */

module.exports.plantillas.imagen = (imageURL, imageProvider) => new MessageEmbed()
  .setColor('#2F3136')
  .setImage(imageURL)
  .setDescription(`<:system_image:968433418935361576> Image via ${imageProvider} API.`)
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
  .setDescription(`${timeoutEmojis[Math.floor(Math.random() * (timeoutEmojis.length))]} ${message}`)
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
    .setTitle(`<:system_support:968434674634473493> ${command.name} • Options`)
    .setDescription(`${command.description || 'No description'}\n\n${timeoutEmojis[Math.floor(Math.random() * (timeoutEmojis.length))]} Cooldown: ${command.cooldown || '10'}\n<:system_settings:968435053963145266> Module: ${command.module || 'No category'}\n${command.parameters ? codeBlock(`${command.name} ${command.parameters}`) : ''}`)
    .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
    .setTimestamp()

  if (command.subcommands) {
    const subcommands = command.subcommands.filter(subcommand => !subcommand.isNSFW)
    const subcommandsNSFW = command.subcommands.filter(subcommand => subcommand.isNSFW)

    if (subcommands) {
      subcommands.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `<:system_slashcommand:970718607199846450> Command:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true))
    }

    if (subcommandsNSFW) {
      subcommandsNSFW.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `<:channel_nsfw:970717952024379462> Command:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true))
    }
  }

  return embedOptions
}

module.exports.acciones = {}

const Consolex = require('./consolex')

/**
 * Envía un mensaje directo a un usuario.
 * @param {User} user
 * @param {Message} message
 */

module.exports.acciones.enviarMD = (user, message) => {
  try {
    user.send(message)
  } catch {
    Consolex.error(`Error al enviar el mensaje privado a ${user.id}.`)
  }
}

/**
 * Envia un mensaje a un determinado canal.
 * @param {Guild} guild
 * @param {Channel.id} channel
 * @param {Message} message
 */

module.exports.acciones.enviarMensajeACanal = (guild, channel, message) => {
  const channelToSend = guild.channels.cache.get(channel)
  try {
    channelToSend.send(message)
  } catch {
    Consolex.error(`Error al enviar el mensaje a ${channelToSend.id}. El canal no existe o no tengo permisos para enviar mensajes.`)
  }
}
