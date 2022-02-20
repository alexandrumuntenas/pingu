const Consolex = require('../functions/consolex')
const { deleteGuildData } = require('../functions/guildDataManager')

module.exports = {
  name: 'guildDelete',
  execute: async guild => {
    const gD = Consolex.Sentry.startTransaction({
      op: 'guildDelete',
      name: 'Guild Delete'
    })

    deleteGuildData(guild)
    gD.finish()
  }
}
