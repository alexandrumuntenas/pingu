module.exports = {
  name: 'ready',
  execute: async (client) => {
    client.console.info(`Conectado como ${client.user.tag}!`)
    if (client.statcord) client.statcord.autopost()

    // TODO: Autoupdate the guilds slash commands.
    /* setInterval(() => {
      const { REST } = require('@discordjs/rest')
      const { Routes } = require('discord-api-types/v9')
      const getGuildConfig = require('../functions/getGuildConfig')

      const rest = new REST({ version: '9' })
      if (process.env.ENTORNO === 'desarrollo') {
        rest.setToken(process.env.INSIDER_TOKEN)
      } else {
        rest.setToken(process.env.PUBLIC_TOKEN)
      }
    }, 86400000) */
  }
}
