const { Collection } = require('discord.js')
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
    async function load (directory) {
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
  }
}
