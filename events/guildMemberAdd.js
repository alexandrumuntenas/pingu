const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')

module.exports = {
  name: 'guildMemberAdd',
  execute: member => {
    ejecutarFuncionesDeTerceros('guildMemberAdd', null, member)
  }
}
