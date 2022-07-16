import Consolex from './consolex.js'
import { Collection, SlashCommandBuilder } from 'discord.js'
import { lstatSync, readdirSync } from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { ClientGuildManager, ClientInternationalizationManager, ClientUser } from '../client.js'
const rest = new REST({ version: '9' })
if (!process.env.CLIENT_TOKEN) { throw new Error('GTW000: CLIENT_TOKEN not declared.') }
rest.setToken(process.env.CLIENT_TOKEN)
class CommandsManager {
  commands
  constructor (commandsDirectory) {
    this.commands = new Collection()
    this.loadCommands(commandsDirectory)
  }

  add (command) {
    this.commands.set(command.name, command)
  }

  remove (command) {
    this.commands.delete(command.name)
  }

  loadCommands (directory) {
    if (!directory.startsWith('./')) {
      throw new Error('CMD007: Directory does not start with "./"')
    }
    readdirSync(directory).forEach((file) => {
      const path = `${directory}/${file}`
      if (file.endsWith('.js')) {
        import(`.${path}`).then((command) => {
          command = command.default
          if (Object.prototype.hasOwnProperty.call(command, 'name')) {
            if (Object.prototype.hasOwnProperty.call(command, 'interaction')) {
              command.interaction?.setName(command.name)
            } else {
              command.interaction = new SlashCommandBuilder().setName(command.name)
            }
            ClientInternationalizationManager.idiomasDisponibles.forEach((idioma) => {
              // TODO: IDIOMA DINÁMICO
              command.interaction?.setDescriptionLocalization('es-ES', ClientInternationalizationManager.obtenerTraduccion({ clave: `COMMANDS:${command.name}_DESCRIPTION`, idioma }))
            })
            this.add(command)
            Consolex.success(`CommandsManager: Comando ${file} cargado`)
          } else {
            Consolex.warn(`CommandsManager: ${file} no se ha cargado porque no tiene una propiedad "name"`)
          }
        })
      } else if (lstatSync(path).isDirectory()) { this.loadCommands(path) }
    })
  }

  getCommand (name) {
    return this.commands.get(name)
  }

  getCommands () {
    return this.commands
  }

  getCommandsByModule (module) {
    return this.commands.filter((command) => command.module === module)
  }

  getCommandsByModuleAndName (module, name) {
    return this.commands.filter((command) => command.module === module && command.name === name)
  }

  has (name) {
    return this.commands.has(name)
  }

  toArray () {
    return [...this.commands.values()]
  }

  createInteractionList (configuration) {
    const interactionList = []
    this.commands.forEach((command) => {
      if (((command.module && Object.prototype.hasOwnProperty.call(configuration, command.module) && configuration[command.module].enabled) || !command.module) && command.interaction) {
        interactionList.push(command.interaction?.toJSON())
      }
    })
    return interactionList
  }

  uploadInteractions (guild) {
    ClientGuildManager.obtenerConfiguracionDelServidor(guild).then((configuracion) => {
      rest
        .put(Routes.applicationGuildCommands(ClientUser.user?.id || '', guild.id), {
          body: this.createInteractionList(configuracion)
        })
        .catch((err) => {
          return Consolex.gestionarError(err)
        })
        .then(() => {
          return null
        })
    }).catch(Consolex.gestionarError)
  }
}
export default CommandsManager
