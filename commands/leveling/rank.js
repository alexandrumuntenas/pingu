const genericMessages = require('../../modules/genericMessages')
const { fetchMember } = require('../../modules/levelsModule')

module.exports = {
  name: 'rank',
  execute (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      fetchMember(client, message.member, (data) => {
        if (data) {
          message.reply(`:tools: We're currently working in a new and improved rank card. Meanwhile, you will see this message.\n\nYou are at level *${data.memberLevel}* and you have *${data.memberExperience}*xp points`)
        } else {
          genericMessages.Error.customerror(message, locale, 'RANK_NO_CLASSIFIED')
        }
      })
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
