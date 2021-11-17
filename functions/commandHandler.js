const { Collection } = require('discord.js')
const fs = require('fs')
const Ascii = require('ascii-table')

const table = new Ascii('Commands')
table.setHeading('Command', 'Load status')

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
          if (command.name) {
            commands.set(command.name, command)
            table.addRow(file, '✅')
          } else {
            table.addRow(file, '❌  -> missing a help.name, or help.name is not a string.')
            continue
          }
        } else if (fs.lstatSync(path).isDirectory()) {
          load(path)
        }
      }
    }

    console.log(table.toString())

    return commands
  }
}
