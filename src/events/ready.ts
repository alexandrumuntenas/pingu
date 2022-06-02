const consolex = require('../core/consolex')
const { REST } = require('@discordjs/rest')
const { eliminadorArchivosTemporales } = require('../core/clientManager')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') rest.setToken(process.env.INSIDER_TOKEN)
else rest.setToken(process.env.PUBLIC_TOKEN)

const statisticsManager = require('../core/statisticsManager')
const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')

module.exports = {
  name: 'ready',
  execute: () => {
    consolex.info(`Conectado como ${Client.user.tag}!`)

    if (Client.statcord) Client.statcord.autopost()
    if (process.env.ENTORNO === 'public') statisticsManager()

    eliminadorArchivosTemporales()
    Client.user.setActivity(`${Client.guilds.cache.size} guilds`, { type: 'WATCHING' })

    ejecutarFuncionesDeTerceros('guildMemberAdd')

    setInterval(() => {
      Client.user.setActivity(`${Client.guilds.cache.size} guilds`, { type: 'WATCHING' })
    }, 600000)
  }
}
