const guildFetchData = require('../modules/guildFetchData')

module.exports = async (client, guild) => {
  const gC = client.Sentry.startTransaction({
    op: 'guildCreate',
    name: 'Guild Create'
  })
  guildFetchData(client, guild, () => {})
  gC.finish()
}
