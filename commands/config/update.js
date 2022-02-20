const { Permissions } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Loader, Success } = require('../../modules/constructor/messageBuilder')
const generateTheCommandListOfTheGuild = require('../../functions/generateTheCommandListOfTheGuild')
const i18n = require('../../i18n/i18n')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN)
} else {
  rest.setToken(process.env.PUBLIC_TOKEN)
}

module.exports = {
  name: 'update',
  description:
    "⚙️ Deploys and updates the Pingu's Slash Commands of the the server.",
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  executeInteraction (client, locale, interaction) {
    interaction.editReply({
      embeds: [Loader(i18n(locale, 'UPDATE::DEPLOYING'))]
    })
    client.console.info(`Deploying commands to ${interaction.guild.id}`)

    generateTheCommandListOfTheGuild(
      client,
      interaction.database,
      (commandListOfTheGuild) => {
        rest
          .put(
            Routes.applicationGuildCommands(
              client.user.id,
              interaction.guild.id
            ),
            { body: commandListOfTheGuild }
          )
          .then(() => {
            interaction.editReply({
              embeds: [Success(i18n(locale, 'UPDATE::SUCCESS'))]
            })
          })
          .catch(console.error)
      }
    )
  },
  executeLegacy (client, locale, message) {
    client.console.info(`Deploying commands to ${message.guild.id}`)

    generateTheCommandListOfTheGuild(
      client,
      message.database,
      (commandListOfTheGuild) => {
        rest
          .put(
            Routes.applicationGuildCommands(client.user.id, message.guild.id),
            { body: commandListOfTheGuild }
          )
          .then(() => {
            message.reply({
              embeds: [Success(i18n(locale, 'UPDATE::SUCCESS'))]
            })
          })
          .catch(console.error)
      }
    )
  }
}
