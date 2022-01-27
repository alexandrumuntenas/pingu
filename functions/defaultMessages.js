const { MessageEmbed } = require('discord.js')
const { codeBlock } = require('@discordjs/builders')

module.exports.status = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_null:876103457860370442> ${message}`)

module.exports.loader = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<a:loader:927223896330084412> ${message}`)

module.exports.success = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_on:876103503561502730> ${message}`)

module.exports.error = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_null:876103457860370442> ${message}`)

module.exports.info = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`:information_source: ${message}`)

module.exports.image = (imageURL, imageProvider) => new MessageEmbed()
    .setImage(imageURL)
    .setDescription(`:frame_photo: Image via ${imageProvider} API.`)

module.exports.timer = (message) => new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:wait:928374551182721044> ${message}`)

/**
* Devuelve un mensaje enriquecido con información del comando
* @param {String} commandName Nombre del comando
* @param {String} commandDescription Descripción del comando
* @param {Array} commandOptions Opciones del comando
* @param {String} commandModule Opciones del comando
* @return {MessageEmbed} Mensaje enriquecido
*/

module.exports.help = (commandName, commandDescription, commandOptions) => {
  const embed = new MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`${commandName} • Help Tray`)
    .setDescription(`${commandDescription || 'No description'}`)

  if (commandOptions) {
    const optionsNoNSFW = commandOptions.filter(option => !option.isNsfw)
    const optionsNSFW = commandOptions.filter(option => option.isNsfw)

    if (optionsNoNSFW) optionsNoNSFW.forEach(option => embed.addField(`${option.option}`, `${option.description || 'No description'}\n\n:gear: Syntax:\n${codeBlock(option.syntax || 'No syntax')}`, true))
    if (optionsNSFW) optionsNSFW.forEach(option => embed.addField(`:underage: ${option.option}`, `${option.description || 'No description'}\n\n:gear: Syntax:\n${codeBlock(option.syntax || 'No syntax')}`, true))
  }

  return embed
}
