const Consolex = require('./consolex')

const { Collection } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { readdirSync, lstatSync } = require('fs')

/**
 * Carga los comandos e interacciones del bot.
 * @returns {Collection} - Colección con los comandos y las interacciones.
 */

module.exports.cargarComandoseInteracciones = () => {
  const commands = new Collection()

  function load (directory) {
    readdirSync(directory).forEach(file => {
      const path = `${directory}/${file}`

      if (file.endsWith('.js') && !file.endsWith('dev.js')) {
        const command = require(`.${path}`)
        if (Object.prototype.hasOwnProperty.call(command, 'name')) {
          if (Object.prototype.hasOwnProperty.call(command, 'interaction')) {
            command.interaction.setName(command.name).setDescription()
          } else {
            command.interaction = new SlashCommandBuilder().setName(command.name).setDescriptionLocalization()
          }


          commands.set(command.name, command)
          Consolex.success(`Comando ${file} cargado`)
        } else {
          Consolex.warn(`Command ${file} no tiene una propiedad name. Este comando no podrá ser utilizado por el usuario.`)
        }
      } else if (lstatSync(path).isDirectory()) load(path)
    })
  }

  load('./commands')

  return commands
}

const { ayuda } = require('./messageManager').plantillas
const i18n = require('./i18nManager')

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
