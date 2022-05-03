
const { Collection } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const Consolex = require('./consolex')
const fs = require('fs')

/**
 * Carga los comandos e interacciones del bot.
 * @returns {Collection} - Colección con los comandos y las interacciones.
 */

module.exports.cargarComandoseInteracciones = () => {
  const commands = new Collection()

  /**
  * Carga los comandos del bot.
   */
  function load (directory) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const path = `${directory}/${file}`

      if (file.endsWith('.js') && !file.endsWith('dev.js')) {
        const command = require(`.${path}`)
        if (Object.prototype.hasOwnProperty.call(command, 'name')) {
          if (Object.prototype.hasOwnProperty.call(command, 'interaction')) {
            command.interaction.setName(command.name).setDescription(command.description || 'Description not set')
          } else {
            command.interaction = new SlashCommandBuilder().setName(command.name).setDescription(command.description || 'Description not set')
          }

          if (!command.isConfigurationCommand) command.isConfigurationCommand = false

          if (!(command.runCommand || command.runInteraction)) throw new Error(`El comando ${command.name} no tiene una propiedad runInteraction o runCommand. Este comando no podrá ser utilizado por el usuario.`)

          commands.set(command.name, command)
          Consolex.success(`Comando ${file} cargado`)
        } else {
          Consolex.warn(`Command ${file} no tiene una propiedad name. Este comando no podrá ser utilizado por el usuario.`)
          continue
        }
      } else if (fs.lstatSync(path).isDirectory()) load(path)
    }
  }

  load('./commands')

  return commands
}

const { ayuda } = require('./messageManager').plantillas
const i18n = require('../i18n/i18n')

module.exports.construirHelpDelComando = (guild, command) => {
  if (!process.Client.comandos.get(command)) return

  const datosParaConstruirHelp = { name: command, parameters: process.Client.comandos.get(command).parameters || '' }
  const clavesAIgnorar = ['name', 'parameters', 'interaction']

  Object.keys(process.Client.comandos.get(command)).forEach(key => {
    if (!clavesAIgnorar.includes(key) && typeof process.Client.comandos.get(command)[key] === 'string') datosParaConstruirHelp[key] = i18n(guild.preferredLocale, process.Client.comandos.get(command)[key])
    else if (!clavesAIgnorar.includes(key) && typeof process.Client.comandos.get(command)[key] === 'object') {
      datosParaConstruirHelp[key] = []
      process.Client.comandos.get(command)[key].forEach(subcommand => {
        const subcommandData = { name: subcommand.name, parameters: subcommand.parameters }
        Object.keys(subcommand).forEach(key => {
          if (!clavesAIgnorar.includes(key) && typeof subcommand[key] === 'string') subcommandData[key] = i18n(guild.preferredLocale, subcommand[key])
        })
        datosParaConstruirHelp[key].push(subcommandData)
      })
    }
  })

  return ayuda(datosParaConstruirHelp)
}
