const welcome = require('../modules/welcome')

module.exports = {
  name: 'guildMemberAdd',
  execute: async member => { // skipcq: JS-0116
    welcome.doGuildMemberAdd(member)
  }
}
