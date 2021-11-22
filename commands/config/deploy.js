const { Permissions } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const genericMessages = require('../../functions/genericMessages')

const rest = new REST({ version: '9' }).setToken(process.env.INSIDER_TOKEN)

module.exports = {
  name: 'deploy',
  description: 'Deploys the Pingu\'s Slash Commands to the server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    rest.put(Routes.applicationGuildCommands(client.user.id, interaction.guild.id), { body: client.interactions.map(command => command.toJSON()) })
      .then(() => genericMessages.success(interaction, 'Successfully registered application commands.'))
      .catch(console.error)
  },
  executeLegacy (client, locale, message) {
    rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: client.interactions.map(command => command.toJSON()) })
      .then(() => genericMessages.legacy.success(message, 'Successfully registered application commands.'))
      .catch(console.error)
  }
}
