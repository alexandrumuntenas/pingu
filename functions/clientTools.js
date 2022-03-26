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

          if (!command.isConfigCommand) command.isConfigCommand = false

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

const { unlinkSync, stat, readdirSync, mkdirSync } = require('fs')
const consolex = require('./consolex')

/** Función que elimina los archivos temporales */

function eliminarArchivos (files) {
  for (const file of files) {
    stat(`./modules/temp/${file}`, (err, stats) => {
      if (err) consolex.handleError(err)

      const fileDate = new Date(stats.birthtime)
      const now = new Date()

      if (now - fileDate >= 600000) {
        consolex.info(`Eliminador de Archivos temporales ha eliminado ${file}`)
        unlinkSync(`./modules/temp/${file}`)
      }
    })
  }
}

/**
 * Comprobar si existe directorio de archivos temporales y si no existe crearlo; luego ejecutar la función eliminarArchivos
 */

module.exports.eliminadorArchivosTemporales = () => {
  try {
    eliminarArchivos(readdirSync('./modules/temp'))
  } catch {
    mkdirSync('./modules/temp')
    consolex.info('Eliminador de Archivos temporales ha creado el directorio de archivos temporales')
    eliminarArchivos(readdirSync('./modules/temp'))
  }
}

/** Establecer intervalo en el cual se ejecutará el eliminador de archivos temporales */

setInterval(() => {
  module.exports.eliminadorArchivosTemporales()
}, 300000)
