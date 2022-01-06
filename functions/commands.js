const { Collection } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('fs')

module.exports.loadCommands = (client) => {
  const commands = new Collection()

  load('./commands')

  async function load (directory) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const path = `${directory}/${file}`

      if (file.endsWith('.js') && !file.endsWith('dev.js')) {
        const command = require(`.${path}`)
        if (command.name) {
          if (!command.interactionData) command.interactionData = new SlashCommandBuilder().setName(command.name).setDescription(command.description || 'Description not set')
          if (!command.isConfigCommand) command.isConfigCommand = false
          commands.set(command.name, command)
          client.console.success(`Comando ${file} cargado`)
        } else {
          client.console.warn(`Command ${file} is missing a help.name, or help.name is not a string.`)
          continue
        }
      } else if (fs.lstatSync(path).isDirectory()) {
        load(path)
      }
    }
  }
  return commands
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
  return (cooldown.get(`${command.name}${member.id}${guild.id}`) - Date.now())
}
