const { deleteMember } = require('../core/memberManager')
const farewell = require('../modules/farewell.js')

module.exports = {
  name: 'guildMemberRemove',
  execute: async member => { // skipcq: JS-0116
    if (member.user.id !== process.Client.user.id) {
      farewell.doGuildMemberRemove(member)
      deleteMember(member)
    }
  }
}
