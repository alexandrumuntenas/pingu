const { deleteGuildData } = require('../functions/guildDataManager')

module.exports = {
  name: 'guildDelete',
  execute: async guild => {
    deleteGuildData(guild)
  }
}
