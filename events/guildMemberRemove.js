const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')
const { deleteMember } = require('../core/memberManager')

module.exports = {
  name: 'guildMemberRemove',
  execute: member => { // skipcq: JS-0116
    if (member.user.id !== process.Client.user.id) {
      ejecutarFuncionesDeTerceros('guildMemberRemove', null, member)
      deleteMember(member)
    }
  }
}
