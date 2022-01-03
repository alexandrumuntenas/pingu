const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const guildFetchData = require('../functions/guildFetchData')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN)
} else {
  rest.setToken(process.env.PUBLIC_TOKEN)
}

module.exports = {
  name: 'ready',
  execute: async (client) => {
    client.log.info(`Conectado como ${client.user.tag}!`)
    updateStatus(client)
    setInterval(() => {
      updateStatus(client)
      client.log.info('Presencia refrescada')
    }, 3600000)
    if (client.statcord) client.statcord.autopost()
    setInterval(() => {
      client.guilds.cache.forEach(async (guild) => {
        guildFetchData(client, guild.id, (data) => {
          client.log.info(`Deploying commands to ${guild.id}`)
          let welcome, joinroles, farewell, levels, economy, suggestions, nomodule, bodyToSend
          if (data.welcomeEnabled !== 0) welcome = client.interactions.filter(command => command.module === 'welcome') || []
          if (data.farewellEnabled !== 0) farewell = client.interactions.filter(command => command.module === 'farewell') || []
          if (data.joinRolesEnabled !== 0) joinroles = client.interactions.filter(command => command.module === 'joinroles') || []
          if (data.levelsEnabled !== 0) levels = client.interactions.filter(command => command.module === 'levels') || []
          if (data.suggestionsEnabled !== 0) suggestions = client.interactions.filter(command => command.module === 'suggestions') || []
          if (data.economyEnabled !== 0) economy = client.interactions.filter(command => command.module === 'economy') || []
          nomodule = client.interactions.filter(command => !command.module)

          bodyToSend = []

          bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [], nomodule || [])

          if (data.guildViewCnfCmdsEnabled === 0) {
            bodyToSend = bodyToSend.filter(command => command.isConfigCommand === false)
          }

          bodyToSend = bodyToSend.map(command => command.interaction.toJSON())

          rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: bodyToSend })
            .then(() => {
              client.log.success(`Commands deployed to ${guild.id}`)
            })
            .catch(console.error)
        })
      })
    }, 86400000)
  }
}

function updateStatus (client) {
  const date = new Date()
  let currentHours = date.getHours()
  currentHours = ('0' + currentHours).slice(-2)

  // Se ajusta a las horas españolas de la península. Para obtener la hora española
  // se debe sumar a las horas +5
  if (currentHours >= 1 && currentHours <= 13) {
    client.user.setPresence({
      status: 'online'
    })
  } else {
    client.user.setPresence({
      status: 'idle'
    })
  }
}
