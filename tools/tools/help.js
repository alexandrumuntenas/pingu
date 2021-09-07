const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'help',
  execute (client, locale, message, result) {
    const options = [
      'about',
      'all-warns',
      'anime',
      'ban',
      'clear',
      'clear-user-warns',
      'config',
      'delwarn',
      'dog',
      'duck',
      'flip',
      'goose',
      'kick',
      'levels',
      'lizard',
      'lock',
      'lockdown',
      'nasa',
      'noMoreUsers',
      'randint',
      'rank',
      'server-info',
      'slowmode',
      'unbanall',
      'unlock',
      'user-info',
      'vwarns',
      'warn'
    ]
    genericMessages.Info.help(message, locale, `${result[0].guild_prefix}<comando>`, options, false)
  }
}
