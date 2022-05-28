const consolex = require('../core/consolex')
const { REST } = require('@discordjs/rest')
const { eliminadorArchivosTemporales } = require('../core/clientManager')

const rest = new REST({ version: '9' })
if (process.env.ENTORNO === 'desarrollo') rest.setToken(process.env.INSIDER_TOKEN)
else rest.setToken(process.env.PUBLIC_TOKEN)

const statisticsManager = require('../core/statisticsManager')
const { comenzarActualizarDatosDeLosServidores } = require('../modules/mcsrvstatus')

module.exports = {
  name: 'ready',
  execute: () => {
    consolex.info(`Conectado como ${process.Client.user.tag}!`)

    if (process.Client.statcord) process.Client.statcord.autopost()
    if (process.env.ENTORNO === 'public') statisticsManager()

    eliminadorArchivosTemporales()
    process.Client.user.setActivity(`${process.Client.guilds.cache.size} guilds`, { type: 'WATCHING' })

    comenzarActualizarDatosDeLosServidores()

    setInterval(() => {
      process.Client.user.setActivity(`${process.Client.guilds.cache.size} guilds`, { type: 'WATCHING' })
    }, 600000)
  }
}
