const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const genericMessages = require('../../functions/genericMessages')

const rest = new REST({ version: '9' }).setToken(process.env.INSIDER_TOKEN)

module.exports = {
  name: 'deploy',
  executeLegacy (client, locale, message) {
    if (message.author.id === '722810818823192629') {
      rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: client.interactions.map(command => command.toJSON()) })
        .then(() => genericMessages.legacy.success(message, 'Successfully registered application commands.'))
        .catch(console.error)
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}
