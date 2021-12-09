const { Collection } = require('discord.js')

const fs = require('fs')
const Ascii = require('ascii-table')

const table = new Ascii('Commands')
table.setHeading('Command', 'Load status')

module.exports.loadCommands = (client) => {
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

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports.loadInteractions = (client) => {
  const interactions = []

  load('./commands')

  /**
   * Load Pingu Interactions
   * @param {collection} collection Discord Collection for Interactions
   * @param {directory} directory The Directory Where Interactions are stored
   */
  async function load (directory) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const path = `${directory}/${file}`

      if (file.endsWith('.js')) {
        const interaction = require(`.${path}`)
        if (interaction.name) {
          interactions.push({ module: interaction.module, interaction: interaction.interactionData || new SlashCommandBuilder().setName(interaction.name).setDescription(interaction.description || 'Description not set') })
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

  return interactions
}

const cooldown = new Collection()

module.exports.cooldown = {}

module.exports.cooldown.add = (member, guild, command) => {
  cooldown.set(`${command.name}${member.id}${guild.id}`, (Date.now() + (parseInt(command.cooldown) || 10000)))
  setTimeout(() => {
    cooldown.delete(`${command.name}${member.id}${guild.id}`)
  }, command.cooldown || 10000)
}

module.exports.cooldown.check = (member, guild, command) => {
  if (cooldown.has(`${command.name}${member.id}${guild.id}`)) return false
  return true
}

module.exports.cooldown.ttl = (member, guild, command) => {
  return cooldown.get(`${command.name}${member.id}${guild.id}`)
}
