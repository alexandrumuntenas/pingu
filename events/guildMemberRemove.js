const guildFetchData = require('../modules/guildFetchData')

module.exports = async (client, member) => {
  const gMR = client.Sentry.startTransaction({
    op: 'guildMemberRemove',
    name: 'Guild Member Remove'
  })
  if (member.user.id !== client.user.id) {
    guildFetchData(client, member.guild, (data) => {
      if (data.farewellEnabled !== 0) {
        const mensaje = client.channels.cache.find(channel => channel.id === data.farewellChannel)
        if (mensaje) {
          mensaje.send(data.farewellMessage.replace('{member}', `${member.user.tag}`).replace('{guild}', `${member.guild.name}`))
        }
      }
    })
    client.pool.query('DELETE FROM `guildLevelsData` WHERE member = ? AND guild = ?', [member.user.id, member.guild.id])
    client.pool.query('DELETE FROM `guildEconomyUserBank` WHERE member = ? AND guild = ?', [member.user.id, member.guild.id])
  }
  gMR.finish()
}
