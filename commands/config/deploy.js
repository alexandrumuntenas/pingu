const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const genericMessages = require('../../functions/genericMessages')

const rest = new REST({ version: '9' }).setToken(process.env.INSIDER_TOKEN)

module.exports = {
  name: 'deploy',
  description: 'Deploys the Pingu\'s Slash Commands to the server.',
  executeInteraction (client, locale, interaction) {
    if (interaction.user.id === interaction.guild.ownerId) {
      rest.put(Routes.applicationGuildCommands(client.user.id, interaction.guild.id), { body: client.interactions.map(command => command.toJSON()) })
        .then(() => genericMessages.success(interaction, 'Successfully registered application commands.'))
        .catch(console.error)
    } else {
      genericMessages.error.permissionerror(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
    if (message.member.id === message.guild.ownerId) {
      rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: client.interactions.map(command => command.toJSON()) })
        .then(() => genericMessages.legacy.success(message, 'Successfully registered application commands.'))
        .catch(console.error)
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}
