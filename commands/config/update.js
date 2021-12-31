const { Permissions } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Loader, Success } = require('../../modules/constructor/messageBuilder')
const guildFetchData = require('../../functions/guildFetchData')

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
    if (interaction.member.id === '722810818823192629') {
      interaction.editReply({ embeds: [Loader('Deploying commands...')] })
      client.guilds.cache.forEach((guild) => {
        guildFetchData(client, guild, (data) => {
          client.log.info(`Deploying commands to ${guild.id}`)
          let bodyToSend = []
          let welcome, joinroles, farewell, levels, economy, suggestions
          if (data.welcomeEnabled !== 0) welcome = client.interactions.filter(command => command.module === 'welcome').map(command => command.interaction.toJSON()) || []
          if (data.farewellEnabled !== 0) farewell = client.interactions.filter(command => command.module === 'farewell').map(command => command.interaction.toJSON()) || []
          if (data.joinRolesEnabled !== 0) joinroles = client.interactions.filter(command => command.module === 'joinroles').map(command => command.interaction.toJSON()) || []
          if (data.levelsEnabled !== 0) levels = client.interactions.filter(command => command.module === 'levels').map(command => command.interaction.toJSON()) || []
          if (data.suggestionsEnabled !== 0) suggestions = client.interactions.filter(command => command.module === 'suggestions').map(command => command.interaction.toJSON()) || []
          if (data.economyEnabled !== 0) economy = client.interactions.filter(command => command.module === 'economy').map(command => command.interaction.toJSON()) || []
          bodyToSend = client.interactions.filter(command => !command.module).map(command => command.interaction.toJSON())

          bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [])

          rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: bodyToSend })
            .then(() => client.log.success(`Commands deployed to ${guild.id}`))
            .catch(console.error)
        })
      })
      interaction.editReply({ embeds: [Success('Successfully deployed commands!')] })
    } else {
      interaction.editReply({ embeds: [Loader('Deploying commands...')] })
      client.log.info(`Deploying commands to ${interaction.guild.id}`)
      let bodyToSend = []
      let welcome, joinroles, farewell, levels, economy, suggestions
      if (interaction.database.welcomeEnabled !== 0) welcome = client.interactions.filter(command => command.module === 'welcome').map(command => command.interaction.toJSON()) || []
      if (interaction.database.farewellEnabled !== 0) farewell = client.interactions.filter(command => command.module === 'farewell').map(command => command.interaction.toJSON()) || []
      if (interaction.database.joinRolesEnabled !== 0) joinroles = client.interactions.filter(command => command.module === 'joinroles').map(command => command.interaction.toJSON()) || []
      if (interaction.database.levelsEnabled !== 0) levels = client.interactions.filter(command => command.module === 'levels').map(command => command.interaction.toJSON()) || []
      if (interaction.database.suggestionsEnabled !== 0) suggestions = client.interactions.filter(command => command.module === 'suggestions').map(command => command.interaction.toJSON()) || []
      if (interaction.database.economyEnabled !== 0) economy = client.interactions.filter(command => command.module === 'economy').map(command => command.interaction.toJSON()) || []
      bodyToSend = client.interactions.filter(command => !command.module).map(command => command.interaction.toJSON())

      bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [])

      rest.put(Routes.applicationGuildCommands(client.user.id, interaction.guild.id), { body: bodyToSend })
        .then(() => interaction.editReply({ embeds: [Success('Successfully registered application commands.')] }))
        .catch(console.error)
    }
  },
  executeLegacy (client, locale, message) {
    client.log.info(`Deploying commands to ${message.guild.id}`)
    let bodyToSend = []
    let welcome, joinroles, farewell, levels, economy, suggestions
    if (message.database.welcomeEnabled !== 0) welcome = client.interactions.filter(command => command.module === 'welcome').map(command => command.interaction.toJSON()) || []
    if (message.database.farewellEnabled !== 0) farewell = client.interactions.filter(command => command.module === 'farewell').map(command => command.interaction.toJSON()) || []
    if (message.database.joinRolesEnabled !== 0) joinroles = client.interactions.filter(command => command.module === 'joinroles').map(command => command.interaction.toJSON()) || []
    if (message.database.levelsEnabled !== 0) levels = client.interactions.filter(command => command.module === 'levels').map(command => command.interaction.toJSON()) || []
    if (message.database.economyEnabled !== 0) suggestions = client.interactions.filter(command => command.module === 'economy').map(command => command.interaction.toJSON()) || []
    if (message.database.suggestionsEnabled !== 0) economy = client.interactions.filter(command => command.module === 'suggestions').map(command => command.interaction.toJSON()) || []
    bodyToSend = client.interactions.filter(command => !command.module).map(command => command.interaction.toJSON())

    bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [])

    rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: bodyToSend })
      .then(() => message.reply({ embeds: [Success('Successfully registered application commands.')] }))
      .catch(console.error)
  }
}
