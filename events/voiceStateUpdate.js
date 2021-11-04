const { default: Collection } = require('@discordjs/collection')
const { getMoney } = require('../modules/economyModule')
const timeInChannel = new Map()

module.exports = async (client, oldState, newState) => {
  const vSU = client.Sentry.startTransaction({
    op: 'voiceStateUpdate',
    name: 'Voice Status Update'
  })
  const newUserChannel = newState.channel
  const oldUserChannel = oldState.channel
  if (oldUserChannel === null && newUserChannel !== null) {
    timeInChannel.set(oldState.member.id, oldState.guild.id, Date.now())
  } else if (oldUserChannel !== null && newUserChannel === null) {
    const sessionData = timeInChannel.get(oldState.member.id, oldState.guild.id, Date.now())
    if (sessionData) {
      let sessionTime = Math.abs((sessionData.time - Date.now()) / 1000)
      while (sessionTime >= 10) {
        sessionTime = sessionTime - 10
        getMoney(client, oldState.member, oldState.guild)
      }
    }
  }
  vSU.finish()
}
