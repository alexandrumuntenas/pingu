const { getGuildConfig } = require('../functions/guildDataManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async guild => {
    getGuildConfig(guild)
  }
}
