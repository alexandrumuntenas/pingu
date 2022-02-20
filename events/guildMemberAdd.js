const welcome = require('../modules/welcome')

module.exports = {
  name: 'guildMemberAdd',
  execute: async member => {
    welcome.doGuildMemberAdd(member)
  }
}
