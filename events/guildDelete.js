const { deleteGuildData } = require('../functions/guildManager')

module.exports = {
  name: 'guildDelete',
  execute: async guild => { // skipcq: JS-0116
    deleteGuildData(guild)
  }
}
