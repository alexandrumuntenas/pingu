const Consolex = require('../functions/consolex')
const { REST } = require('@discordjs/rest')
const { eliminadorArchivosTemporales } = require('../functions/clientTools')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') rest.setToken(process.env.INSIDER_TOKEN)
else rest.setToken(process.env.PUBLIC_TOKEN)

const initializeThirdParty = require('../functions/initializeThirdParty')

module.exports = {
  name: 'ready',
  execute: () => {
    Consolex.info(`Conectado como ${process.Client.user.tag}!`)

    if (process.Client.statcord) process.Client.statcord.autopost()
    if (process.env.ENTORNO === 'public') initializeThirdParty()

    eliminadorArchivosTemporales()
    process.Client.user.setActivity(`${process.Client.guilds.cache.size} guilds`, { type: 'WATCHING' })

    setInterval(() => {
      process.Client.user.setActivity(`${process.Client.guilds.cache.size} guilds`, { type: 'WATCHING' })
    }, 600000)
  }
}
