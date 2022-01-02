const talkedRecently = new Set()

module.exports = {
  fetchMember: (client, member, callback) => {
    const lfM = client.Sentry.startTransaction({
      op: 'levels.fetchMember',
      name: 'levels (Fetch Member)'
    })
    client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? AND member = ?', [member.guild.id, member.id], (err, result) => {
      if (err) client.logError(err)
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        const adata = result[0]
        client.pool.query('SELECT member, ROW_NUMBER() OVER (ORDER BY memberLevel DESC, memberExperience DESC) AS rnk FROM guildLevelsData WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC', [member.guild.id], (err, result) => {
          if (err) client.logError(err)
          if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
            result.filter(r => r.member === member.id).forEach(r => { adata.rank = r.rnk })
            callback(adata)
          } else {
            client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
              if (err) {
                client.logError(err)
                client.log.error(err)
              }
              module.exports.fetchMember(client, member, callback)
            })
          }
        })
      } else {
        client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
          if (err) {
            client.logError(err)
            client.log.error(err)
          }
          module.exports.fetchMember(client, member, callback)
        })
      }
    })
    lfM.finish()
  },
  updateMember: (client, member, newData, callback) => {
    const luM = client.Sentry.startTransaction({
      op: 'levels.updateMember',
      name: 'levels (Update Member)'
    })
    client.pool.query('UPDATE `guildLevelsData` SET `memberExperience` = ?, `memberLevel` = ? WHERE `guild` = ? AND `member` = ?', [newData.memberExperience, newData.memberLevel, member.guild.id, member.id], (err, result) => {
      let status
      if (err) {
        status = 500
        client.logError(err)
      } else {
        status = 200
      }
      callback(status)
    })
    luM.finish()
  },
  rankUp: function (client, message) {
    const lRU = client.Sentry.startTransaction({
      op: 'levels.rankup',
      name: 'levels (Rank Up)'
    })
    if (!message.content.startsWith(message.database.guildPrefix)) {
      if (!talkedRecently.has(`${message.member.id}_${message.guild.id}`)) {
        talkedRecently.add(`${message.member.id}_${message.guild.id}`)
        setTimeout(() => {
          talkedRecently.delete(`${message.member.id}_${message.guild.id}`)
        }, 60000)
        module.exports.fetchMember(client, message.member, (userData) => {
          if (userData) {
            let exp = parseInt(userData.memberExperience) + Math.round(Math.random() * (25 - 15) + 15)
            let niv = parseInt(userData.memberLevel)
            const dif = parseInt(message.database.levelsDifficulty)
            if (exp >= (((niv * niv) * dif) * 100)) {
              exp = exp - (((niv * niv) * dif) * 100)
              niv++
              const messageToSend = message.database.levelsMessage.replace('{member}', `<@${message.member.id}>`).replace('{oldlevel}', `${niv - 1}`).replace('{newlevel}', `${niv}`)
              if (message.database.levelsChannel === '1') {
                message.channel.send(messageToSend)
              } else {
                const customChannel = client.channels.cache.find(channel => channel.id === message.database.levelsChannel)
                if (customChannel) {
                  customChannel.send(messageToSend)
                } else {
                  message.channel.send(messageToSend)
                }
              }
            }
            module.exports.updateMember(client, message.member, { memberExperience: exp, memberLevel: niv }, () => { })
          }
        })
      }
    }
    lRU.finish()
  }
}