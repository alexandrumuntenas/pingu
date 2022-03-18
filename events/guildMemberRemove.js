const { deleteMember } = require('../functions/memberManager')
const farewell = require('../modules/farewell.js')

module.exports = {
  name: 'guildMemberRemove',
  execute: async member => {
    if (member.user.id !== process.Client.user.id) {
      farewell.doGuildMemberRemove(member)
      deleteMember(member)
    }
  }
}
