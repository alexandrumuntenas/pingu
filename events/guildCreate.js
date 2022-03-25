const { getGuildConfig } = require('../functions/guildDataManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async guild => { // skipcq: JS-0116
    getGuildConfig(guild)
  }
}
