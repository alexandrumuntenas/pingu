const Consolex = require('./consolex')
const i18n = require('./i18nManager')

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
            command.interaction.setName(command.name)
          } else {
            command.interaction = new SlashCommandBuilder().setName(command.name)
          }

          i18n.avaliableLocales.forEach(locale => {
            command.interaction.setDescriptionLocalized(locale, i18n(locale, command.name))
          })

          commands.set(command.name, command)
          Consolex.success(`Comando ${file} cargado`)
        } else {
          Consolex.warn(`${file} no se ha cargado porque no tiene una propiedad "name"`)
        }
      } else if (lstatSync(path).isDirectory()) load(path)
    })
  }

  load('./commands')

  return commands
}

const { ayuda } = require('./messageManager').plantillas

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
