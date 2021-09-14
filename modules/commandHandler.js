const { Collection } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const chalk = require('chalk')
const fs = require('fs')

module.exports = {
  loadCommands: (client) => {
    const commands = new Collection()

    load('./commands')

    /**
     * Load Pingu Commands
     * @param {collection} collection Discord Collection for Commands
     * @param {directory} directory The Directory Where Commands are stored
     */
    function load (directory) {
      const files = fs.readdirSync(directory)

      for (const file of files) {
        const path = `${directory}/${file}`

        if (file.endsWith('.js')) {
          const command = require(`.${path}`)
          client.log.info(`Cargando ${command.name}`)
          commands.set(command.name, command)
          client.log.success(`Cargado ${command.name}`)
        } else if (fs.lstatSync(path).isDirectory()) {
          load(path)
        }
      }
    }

    return commands
  },
  deploySlashCommands: (client, guild) => {
    client.log.info(`Desplegando comandos slash a ${chalk.yellowBright(guild.name)}`)
    const rest = new REST({ version: '9' }).setToken(client.token)

    const slashCommands = []

    load('./commands')

    function load (directory) {
      const files = fs.readdirSync(directory)

      for (const file of files) {
        const path = `${directory}/${file}`

        if (file.endsWith('.js')) {
          const command = require(`.${path}`)
          if (command.data) {
            client.log.info(`Preparando el comando ${chalk.yellowBright(command.name)} para ser desplegado a ${chalk.yellowBright(guild.name)} `)
            slashCommands.push(command.data.toJSON())
            client.log.success(`Preparado el comando ${chalk.yellowBright(command.name)} para ser desplegado a ${chalk.yellowBright(guild.name)} `)
          }
        } else if (fs.lstatSync(path).isDirectory()) {
          load(path)
        }
      }
    }

    (async () => {
      try {
        client.log.info(`Desplegando a ${chalk.yellowBright(guild.name)} los SlashCommands`)

        await rest.put(
          Routes.applicationGuildCommands(client.application.id, guild.id),
          { body: slashCommands }
        )

        client.log.success(`Desplegado a ${chalk.yellowBright(guild.name)} los SlashCommands`)
      } catch (error) {
        console.error(error)
      }
    })()
  }
}
