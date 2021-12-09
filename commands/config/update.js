const { Permissions } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const genericMessages = require('../../functions/genericMessages')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN)
} else {
  rest.setToken(process.env.PUBLIC_TOKEN)
}

module.exports = {
  name: 'update',
  description: '⚙️ Deploys and updates the Pingu\'s Slash Commands of all the servers.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    if (interaction.member.id === '722810818823192629') {
      genericMessages.info.loader(interaction, 'Deploying commands...')
      client.guilds.cache.forEach(async (guild) => {
        rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: client.interactions.map(command => command.toJSON()) })
          .then(() => client.log.success(`Commands deployed to ${guild.id}`))
          .catch(console.error)
      })
      genericMessages.success(interaction, 'Successfully deployed commands!')
    } else {
      genericMessages.error(interaction, 'You are not allowed to use this command.')
    }
  }
}
