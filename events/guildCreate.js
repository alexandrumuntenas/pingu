const { getGuildConfigNext } = require('../modules/guildDataManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async (client, guild) => {
    const gC = client.console.sentry.startTransaction({
      op: 'guildCreate',
      name: 'Guild Create'
    })
    getGuildConfigNext(client, guild, () => { })
    gC.finish()
  }
}
