const { MessageEmbed } = require('discord.js')
const { codeBlock } = require('@discordjs/builders')

module.exports.Status = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_null:876103457860370442> ${message}`)
}

module.exports.Loader = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<a:loader:927223896330084412> ${message}`)
}

module.exports.Success = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_on:876103503561502730> ${message}`)
}

module.exports.Error = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_null:876103457860370442> ${message}`)
}

module.exports.Info = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`:information_source: ${message}`)
}

/**
* Devuelve un mensaje enriquecido con información del comando
* @param {String} commandName Nombre del comando
* @param {String} commandDescription Descripción del comando
* @param {Array} commandOptions Opciones del comando
* @param {String} commandModule Opciones del comando
* @return {MessageEmbed} Mensaje enriquecido
*/

module.exports.Help = (commandName, commandDescription, commandOptions, commandModule) => {
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
