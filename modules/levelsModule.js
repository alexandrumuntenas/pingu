const talkedRecently = new Set()

module.exports = {
  fetchConfig: (client, guild, callback) => {
    const lfC = client.Sentry.startTransaction({
      op: 'levelsModule.fetchConfig',
      name: 'LevelsModule (Fetch Config)'
    })
    client.pool.query('SELECT * FROM `guildLevelsConfig` WHERE guild = ?', [guild.id], (err, result) => {
      if (err) client.Sentry.captureException(err)
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        callback(result[0])
      } else {
        client.pool.query('INSERT INTO `guildLevelsConfig` (`guild`) VALUES (?)', [guild.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          callback()
        })
      }
    })
    lfC.finish()
  },
  fetchMember: (client, member, callback) => {
    const lfM = client.Sentry.startTransaction({
      op: 'levelsModule.fetchMember',
      name: 'LevelsModule (Fetch Member)'
    })
    client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? AND member = ?', [member.guild.id, member.id], (err, result) => {
      if (err) client.Sentry.captureException(err)
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        callback(result[0])
      } else {
        client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          callback()
        })
      }
    })
    lfM.finish()
  },
  updateMember: (client, member, newData, callback) => {
    const luM = client.Sentry.startTransaction({
      op: 'levelsModule.updateMember',
      name: 'LevelsModule (Update Member)'
    })
    client.pool.query('UPDATE `guildLevelsData` SET `memberExperience` = ?, `memberLevel` = ? WHERE `guild` = ? AND `member` = ?', [newData.memberExperience, newData.memberLevel, member.guild.id, member.id], (err, result) => {
      let status
      if (err) {
        status = 500
        client.Sentry.captureException(err)
      } else {
        status = 200
      }
      callback(status)
    })
    luM.finish()
  },
  rankUp: function (client, message) {
    const lRU = client.Sentry.startTransaction({
      op: 'levelsModule.rankup',
      name: 'LevelsModule (Rank Up)'
    })
    if (!message.content.startsWith(message.database.guild_prefix)) {
      if (!talkedRecently.has(`${message.author.id}_${message.guild.id}`)) {
        talkedRecently.add(`${message.author.id}_${message.guild.id}`)
        setTimeout(() => {
          talkedRecently.delete(`${message.author.id}_${message.guild.id}`)
        }, 60000)
        module.exports.fetchConfig(client, message.guild, (config) => {
          module.exports.fetchMember(client, message.member, (userData) => {
            if (userData) {
              let exp = parseInt(userData.memberExperience) + Math.round(Math.random() * (25 - 15) + 15)
              let niv = parseInt(userData.memberLevel)
              const dif = parseInt(config.levelsDifficulty)
              if (exp >= (((niv * niv) * dif) * 100)) {
                exp = exp - (((niv * niv) * dif) * 100)
                niv++
                const messageToSend = config.levelsMessage.replace('{user}', `<@${message.author.id}>`).replace('{nivel-antiguo}', `${niv - 1}`).replace('{nivel-nuevo}', `${niv}`)
                if (config.levelsChannel === '0') {
                  message.channel.send(messageToSend)
                } else {
                  const customChannel = client.channels.cache.find(channel => channel.id === config.levelsChannel)
                  if (customChannel) {
                    customChannel.send(messageToSend)
                  } else {
                    message.channel.send(messageToSend)
                  }
                }
              }
              module.exports.updateMember(client, message.member, { memberExperience: exp, memberLevel: niv }, () => { })
            } else {
              client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [message.member.guild.id, message.member.id], (err) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
              })
            }
          })
        })
      }
    }
    lRU.finish()
  }
}
