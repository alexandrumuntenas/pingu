const Consolex = require('../functions/consolex')

const { getGuildConfigNext } = require('../functions/guildDataManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async guild => {
    const gC = Consolex.Sentry.startTransaction({
      op: 'guildCreate',
      name: 'Guild Create'
    })
    getGuildConfigNext(guild)
    gC.finish()
  }
}
