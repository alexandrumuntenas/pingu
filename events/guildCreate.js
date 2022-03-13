const Consolex = require('../functions/consolex')

const { getGuildConfig } = require('../functions/guildDataManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async guild => {
    const gC = Consolex.Sentry.startTransaction({
      op: 'guildCreate',
      name: 'Guild Create'
    })
    getGuildConfig(guild)
    gC.finish()
  }
}
