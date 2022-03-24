const { deleteGuildData } = require('../functions/guildDataManager')

module.exports = {
  name: 'guildDelete',
  execute: async guild => { // skipcq: JS-0116
    deleteGuildData(guild)
  }
}
