const farewellModule = require('../modules/farewellModule')
const welcomerModule = require('../modules/welcomerModule')
const levelsModule = require('../modules/levelsModule')

module.exports = (client, guild) => {
  const gC = client.Sentry.startTransaction({
    op: 'guildCreate',
    name: 'Guild Create'
  })
  welcomerModule.fetchConfig(client, guild, (data) => {})
  farewellModule.fetchConfig(client, guild, (data) => {})
  levelsModule.fetchConfig(client, guild, (data) => {})
  client.pool.query('SELECT * FROM `guildData` WHERE `guild` LIKE ?', [guild.id], (err, result) => {
    if (err) {
      client.Sentry.captureException(err)
      client.log.error(err)
    }
    if (!Object.prototype.hasOwnProperty.call(result, 0)) {
      client.pool.query('INSERT INTO `guildData` (`guild`) VALUES (?)', [guild.id], (err, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
      })
    }
  })
  gC.finish()
}
