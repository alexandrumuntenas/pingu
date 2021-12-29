const guildFetchData = require('../functions/guildFetchData')

module.exports = {
  name: 'guildCreate',
  execute: async (client, guild) => {
    const gC = client.Sentry.startTransaction({
      op: 'guildCreate',
      name: 'Guild Create'
    })
    guildFetchData(client, guild, () => { })
    gC.finish()
  }
}
