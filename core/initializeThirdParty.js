const Consolex = require('./consolex')

const Statcord = require('statcord.js')
const dbots = require('dbots')

module.exports = () => {
  const apiKeys = {}

  const services = ['bladelist', 'blist', 'botsondiscord', 'carbon', 'dbots', 'discordbotlist', 'discordbotlisteu', 'discordbotsgg', 'discordextremelist', 'discordlabs', 'discordlistology', 'discordlistspace', 'discordscom', 'discordservices', 'disforge', 'fateslist', 'infinitynbotlist', 'listcord', 'motionbotlist', 'spacebotslist', 'topcord', 'topgg', 'voidbots', 'wonderbotlist', 'yabl']

  for (const service of services) {
    if (process.env[`${service.toUpperCase()}`]) {
      apiKeys[service] = process.env[`${service.toUpperCase()}`]
    }
  }

  const poster = new dbots.Poster({ client: process.Client, apiKeys, clientLibrary: 'discord.js' })

  poster.post()

  poster.addHandler('autopostSuccess', (result) => {
    Consolex.debug(`Autoposting to ${result.request.host} successful!`)
  })

  poster.addHandler('autopostFail', (result) => {
    Consolex.error(`Autoposting to ${result.request.host} failed!`)
  })

  poster.addHandler('postSuccess', (result) => {
    Consolex.success(`Posting to ${result.request.host} successful!`)
  })

  poster.addHandler('postFail', (result) => {
    Consolex.error(`Posting to ${result.request.host} error!`)
  })

  poster.startInterval()

  if (process.env.STATCORD_API_KEY) {
    process.Client.statcord = new Statcord.Client({
      Client: process.Client,
      key: process.env.STATCORD_API_KEY,
      postCpuStatistics: true,
      postMemStatistics: true,
      postNetworkStatistics: true
    })

    process.Client.statcord.on('autopost-start', () => {
      Consolex.info('Publicando estadísticas en Statcord...')
    })

    process.Client.statcord.on('post', status => {
      if (status) Consolex.error(status)
      else Consolex.success('Estadísticas publicadas en Statcord')
    })
  }
}
