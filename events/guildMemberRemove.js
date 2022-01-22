const { getGuildConfigNext } = require('../modules/guildDataManager.js')

module.exports = {
  name: 'guildMemberRemove',
  execute: async (client, member) => {
    const gMR = client.console.sentry.startTransaction({
      op: 'guildMemberRemove',
      name: 'Guild Member Remove'
    })
    if (member.user.id !== client.user.id) {
      getGuildConfigNext(client, member.guild, (data) => {
        if (data.farewellEnabled !== 0) {
          const mensaje = client.channels.cache.find(channel => channel.id === data.farewellChannel)
          if (mensaje) {
            mensaje.send(data.farewellMessage.replace('{member}', `${member.user.tag}`).replace('{guild}', `${member.guild.name}`))
          }
        }
      })
      client.pool.query('DELETE FROM `memberData` WHERE member = ? AND guild = ?', [member.user.id, member.guild.id])
    }
    gMR.finish()
  }
}
