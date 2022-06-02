const consolex = require('./consolex')

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

  const poster = new dbots.Poster({ client: Client, apiKeys, clientLibrary: 'discord.js' })

  poster.post()

  poster.addHandler('autopostSuccess', (result) => {
    consolex.debug(`Autoposting to ${result.request.host} successful!`)
  })

  poster.addHandler('autopostFail', (result) => {
    consolex.error(`Autoposting to ${result.request.host} failed!`)
  })

  poster.addHandler('postSuccess', (result) => {
    consolex.success(`Posting to ${result.request.host} successful!`)
  })

  poster.addHandler('postFail', (result) => {
    consolex.error(`Posting to ${result.request.host} error!`)
  })

  poster.startInterval()

  if (process.env.STATCORD_API_KEY) {
    Client.statcord = new Statcord.Client({
      Client: Client,
      key: process.env.STATCORD_API_KEY,
      postCpuStatistics: true,
      postMemStatistics: true,
      postNetworkStatistics: true
    })

    Client.statcord.on('autopost-start', () => {
      consolex.info('Publicando estadísticas en Statcord...')
    })

    Client.statcord.on('post', status => {
      if (status) consolex.error(status)
      else consolex.success('Estadísticas publicadas en Statcord')
    })
  }
}
