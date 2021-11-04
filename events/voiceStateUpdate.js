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
    timeInChannel.set(`${oldState.member.id}_${oldState.guild.id}`, Date.now())
    client.log.info('voiceStateUpdate ha registrado un nuevo evento')
  } else if (oldUserChannel !== null && newUserChannel === null) {
    let sessionTime = timeInChannel.get(`${oldState.member.id}_${oldState.guild.id}`)
    if (sessionTime) {
      sessionTime = Math.abs((sessionTime - Date.now()) / 1000)
      getMoney(client, oldState.member, oldState.guild, sessionTime)
    }
  }
  vSU.finish()
}
