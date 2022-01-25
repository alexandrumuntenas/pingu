const welcome = require("../modules/welcome")

module.exports = {
  name: 'guildMemberAdd',
  execute: async (client, member) => {
    welcome.doGuildMemberAdd(member)
  }
}
