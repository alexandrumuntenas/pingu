const { Permissions, Collection } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Loader, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN)
} else {
  rest.setToken(process.env.PUBLIC_TOKEN)
}

module.exports = {
  name: 'update',
  description: '⚙️ Deploys and updates the Pingu\'s Slash Commands of the the server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    interaction.editReply({ embeds: [Loader(i18n(locale, 'UPDATE::DEPLOYING'))] })
    client.console.info(`Deploying commands to ${interaction.guild.id}`)
    let welcome, joinroles, farewell, levels, economy, suggestions, bodyToSend
    if (interaction.database.welcomeEnabled !== 0) welcome = client.commands.filter(command => command.module === 'welcome') || []
    if (interaction.database.farewellEnabled !== 0) farewell = client.commands.filter(command => command.module === 'farewell') || []
    if (interaction.database.joinRolesEnabled !== 0) joinroles = client.commands.filter(command => command.module === 'joinroles') || []
    if (interaction.database.levelsEnabled !== 0) levels = client.commands.filter(command => command.module === 'levels') || []
    if (interaction.database.suggestionsEnabled !== 0) suggestions = client.commands.filter(command => command.module === 'suggestions') || []
    if (interaction.database.economyEnabled !== 0) economy = client.commands.filter(command => command.module === 'economy') || []
    const nomodule = client.commands.filter(command => !command.module)

    bodyToSend = new Collection()

    bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [], nomodule || [])

    if (interaction.database.guildViewCnfCmdsEnabled === 0) {
      bodyToSend = bodyToSend.filter(command => command.isConfigCommand === false)
    }

    bodyToSend = bodyToSend.map(command => command.interactionData.toJSON())

    rest.put(Routes.applicationGuildCommands(client.user.id, interaction.guild.id), { body: bodyToSend })
      .then(() => {
        interaction.editReply({ embeds: [Success(i18n(locale, 'UPDATE::SUCCESS'))] })
      })
      .catch(console.error)
  },
  executeLegacy (client, locale, message) {
    client.console.info(`Deploying commands to ${message.guild.id}`)
    let welcome, joinroles, farewell, levels, economy, suggestions, bodyToSend
    if (message.database.welcomeEnabled !== 0) welcome = client.commands.filter(command => command.module === 'welcome') || []
    if (message.database.farewellEnabled !== 0) farewell = client.commands.filter(command => command.module === 'farewell') || []
    if (message.database.joinRolesEnabled !== 0) joinroles = client.commands.filter(command => command.module === 'joinroles') || []
    if (message.database.levelsEnabled !== 0) levels = client.commands.filter(command => command.module === 'levels') || []
    if (message.database.suggestionsEnabled !== 0) suggestions = client.commands.filter(command => command.module === 'suggestions') || []
    if (message.database.economyEnabled !== 0) economy = client.commands.filter(command => command.module === 'economy') || []
    const nomodule = client.commands.filter(command => !command.module)

    bodyToSend = new Collection()

    bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [], nomodule || [])

    if (message.database.guildViewCnfCmdsEnabled === 0) {
      bodyToSend = bodyToSend.filter(command => command.isConfigCommand === false)
    }

    bodyToSend = bodyToSend.map(command => command.interactionData.toJSON())

    rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: bodyToSend })
      .then(() => {
        message.reply({ embeds: [Success(i18n(locale, 'UPDATE::SUCCESS'))] })
      })
      .catch(console.error)
  }
}
