import Consolex from './consolex.js'
import Command from './classes/Command.js'

import { Collection, Guild, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { lstatSync, readdirSync } from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { ClientGuildManager, ClientInternationalizationManager, ClientUser } from '../client.js'

const rest = new REST({ version: '9' })

if (!process.env.CLIENT_TOKEN) throw new Error('GTW000: CLIENT_TOKEN not declared.')
rest.setToken(process.env.CLIENT_TOKEN)
class CommandsManager {
  commands: Collection<string, Command>

  constructor (commandsDirectory: string) {
    this.commands = new Collection()
    this.loadCommands(commandsDirectory)
  }

  add (command: Command): void {
    this.commands.set(command.name, command)
  }

  remove (command: Command): void {
    this.commands.delete(command.name)
  }

  loadCommands (directory: string): void {
    if (!directory.startsWith('./')) throw new Error('CMD007: Directory does not start with "./"')

    readdirSync(directory).forEach((file) => {
      const path = `${directory}/${file}`

      if (file.endsWith('.js') && !file.endsWith('dev.js')) {
        import(`.${path}`).then((command) => {
          if (Object.prototype.hasOwnProperty.call(command, 'name')) {
            if (Object.prototype.hasOwnProperty.call(command, 'interaction')) {
              command.interaction.setName(command.name)
            } else {
              command.interaction = new SlashCommandBuilder().setName(command.name)
            }

            ClientInternationalizationManager.idiomasDisponibles.forEach((idioma) => {
              command.interaction.setDescriptionLocalized(idioma, ClientInternationalizationManager.obtenerTraduccion({ clave: `COMMANDS:${command.name}_DESCRIPTION`, idioma }))
            })

            this.add(
              new Command({
                name: command.name,
                description: command.description,
                module: command.module,
                cooldown: command.cooldown,
                parameters: command.parameters,
                interaction: command.interaction,
                runInteraction: command.runInteraction,
                runCommand: command.runCommand
              })
            )

            Consolex.success(`CommandsManager: Comando ${file} cargado`)
          } else {
            Consolex.warn(`CommandsManager: ${file} no se ha cargado porque no tiene una propiedad "name"`)
          }
        })
      } else if (lstatSync(path).isDirectory()) this.loadCommands(path)
    })
  }

  getCommand (name: string) {
    return this.commands.get(name)
  }

  getCommands (): Collection<string, Command> {
    return this.commands
  }

  getCommandsByModule (module: string) {
    return this.commands.filter((command) => command.module === module)
  }

  getCommandsByModuleAndName (module: string, name: string) {
    return this.commands.filter(
      (command) => command.module === module && command.name === name
    )
  }

  has (name: string) {
    return this.commands.has(name)
  }

  toArray () {
    return [...this.commands.values()]
  }

  createInteractionList (configuration: { [index: string]: any }): Array<Object> {
    const interactionList: RESTPostAPIApplicationCommandsJSONBody[] = []

    this.commands.forEach((command) => {
      if (((command.module && Object.prototype.hasOwnProperty.call(configuration, command.module) && configuration[command.module].enabled) || !command.module) && command.interaction) {
        interactionList.push(command.interaction?.toJSON())
      }
    })

    return interactionList
  }

  uploadInteractions (guild: Guild): void {
    ClientGuildManager.obtenerConfiguracionDelServidor(guild).then(
      (configuracion) => {
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
      }
    ).catch(Consolex.gestionarError)
  }
}

export default CommandsManager
