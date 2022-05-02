
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
          if (Object.prototype.hasOwnProperty.call(command, 'interactionData')) {
            command.interactionData.setName(command.name).setDescription(command.description || 'Description not set')
          } else {
            command.interactionData = new SlashCommandBuilder().setName(command.name).setDescription(command.description || 'Description not set')
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

/* formato de ejemplo
help: {
  name: 'bot',
    description: 'BOT::HELP:DESCRIPTION',
      subcommands: [
        { name: 'updateinteractions', description: 'BOT::HELP:UPDATEINTERACTIONS:DESCRIPTION', parameters: '<configinteractions[true/false]>' },
        { name: 'setprefix', description: 'BOT::HELP:SETPREFIX:DESCRIPTION', parameters: '<prefix>' },
        { name: 'setlanguage', description: 'BOT::HELP:SETLANGUAGE:DESCRIPTION', parameters: '<language[en/es]>' },
        { name: 'modules viewconfig', description: 'BOT::HELP:MODULESVIEWCONFIG:DESCRIPTION' },
        { name: 'modules enable', description: 'BOT::HELP:MODULESENABLE:DESCRIPTION', parameters: '<module>' },
        { name: 'modules disable', description: 'BOT::HELP:MODULESDISABLE:DESCRIPTION', parameters: '<module>' }
      ]
},
*/

module.exports.construirHelpDelComando = (guild, command) => {
  // a través de cada opcion, reemplazar el texto referente a la traducción por la traduccion

  const datosParaConstruirHelp = { name: command.name }

  Object.keys(process.Client.comandos[command].help).forEach(key => {
    if (key !== 'name' && typeof process.Client.comandos[command].help[key] === 'string') datosParaConstruirHelp[key] = i18n(guild.preferredLocale, process.Client.comandos[command].help[key])
    else if (key !== 'name' && typeof process.Client.comandos[command].help[key] === 'object') {
      datosParaConstruirHelp[key] = []
      process.Client.comandos[command].help[key].forEach(subcommand => {
        const subcommandData = { name: subcommand.name }
        Object.keys(subcommand).forEach(key => {
          if (key !== 'name' && typeof subcommand[key] === 'string') subcommandData[key] = i18n(guild.preferredLocale, subcommand[key])
        })
        datosParaConstruirHelp[key].push(subcommandData)
      })
    }
  })

  return ayuda(datosParaConstruirHelp)
}
