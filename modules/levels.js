const { getMember, updateMember } = require('./memberManager')
const talkedRecently = new Set()

module.exports = {
  rankUp: function (client, message) {
    const lRU = client.console.sentry.startTransaction({
      op: 'levels.rankup',
      name: 'levels (Rank Up)'
    })
    if (!message.content.startsWith(message.database.guildPrefix)) {
      if (!talkedRecently.has(`${message.member.id}_${message.guild.id}`)) {
        talkedRecently.add(`${message.member.id}_${message.guild.id}`)
        setTimeout(() => {
          talkedRecently.delete(`${message.member.id}_${message.guild.id}`)
        }, 60000)
        getMember(client, message.member, (memberData) => {
          if (memberData) {
            let lvlExperience =
              parseInt(memberData.lvlExperience) +
              Math.round(Math.random() * (25 - 15) + 15)
            let lvlLevel = parseInt(memberData.lvlLevel)
            const dif = parseInt(message.database.levelsDifficulty)
            if (lvlExperience >= lvlLevel * lvlLevel * dif * 100) {
              lvlExperience = lvlExperience - lvlLevel * lvlLevel * dif * 100
              lvlLevel++
              const messageToSend = message.database.levelsMessage
                .replace('{member}', `<@${message.member.id}>`)
                .replace('{oldlevel}', `${lvlLevel - 1}`)
                .replace('{newlevel}', `${lvlLevel}`)
              if (message.database.levelsChannel === '1') {
                message.channel.send(messageToSend)
              } else {
                const customChannel = client.channels.cache.find(
                  (channel) => channel.id === message.database.levelsChannel
                )
                if (customChannel) {
                  customChannel.send(messageToSend)
                } else {
                  message.channel.send(messageToSend)
                }
              }
            }
            updateMember(client, message.member, {
              lvlLevel: lvlLevel,
              lvlExperience: lvlExperience
            })
          }
        })
      }
    }
    lRU.finish()
  },
  getLeaderboard (client, guild, callback) {
    client.pool.query(
      'SELECT * FROM `memberData` WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC LIMIT 25',
      [guild.id],
      (err, members) => {
        if (err) client.logError(err)
        if (
          callback &&
          members &&
          Object.prototype.hasOwnProperty.call(members, '0')
        ) { callback(members) } else callback()
      }
    )
  }
}
