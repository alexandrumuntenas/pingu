const Consolex = require('../functions/consolex')
const Database = require('../functions/databaseConnection')

/**
 * Create a new suggestion in the guild.
 * @param {GuildMember} member
 * @param {String} suggestion
 * @returns {String} The suggestion id.
 */

const makeId = require('../functions/makeId')

module.exports.createSuggestion = (member, suggestion) => {
  const suggestionId = makeId(5)
  Database.query('INSERT INTO `guildSuggestions` (`id`, `guild`, `author`, `suggestion`) VALUES (?, ?, ?, ?)', [suggestionId, member.guild.id, member.id, suggestion], err => {
    if (err) return Consolex.handleError(err)

    return suggestionId
  })
}

/**
 * Delete a suggestion.
 * @param {GuildMember} member
 * @param {String} suggestionId The suggestion id.
 */

module.exports.deleteSuggestion = (member, suggestionId) => {
  Database.query('DELETE FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, member.guild.id], err => {
    if (err) Consolex.handleError(err)
  })
}

/**
 * Get all the suggestions in the guild.
 * @param {GuildMember} member
 * @param {Function} callback
 * @returns {Array} Suggestions
 */

module.exports.getSuggestions = (member, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `guildSuggestions` WHERE `guild` = ?', [member.guild.id], (err, rows) => {
    if (err) return Consolex.handleError(err)

    const suggestions = []

    if (Object.prototype.hasOwnProperty.call(rows, '0')) {
      for (let i = 0; i < rows.length; i++) {
        suggestions.push(rows[i])
      }
    }

    return callback(suggestions)
  })
}

/**
 * Get a suggestion by id from the guild.
 * @param {Guild} guild
 * @param {String} suggestionId
 * @param {Function} callback
 * @returns {Object} Suggestionb
 */

module.exports.getSuggestion = (guild, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], (err, rows) => {
    if (err) return Consolex.handleError(err)

    if (Object.prototype.hasOwnProperty.call(rows, '0')) return callback(rows[0])
    return callback()
  })
}

/**
 * Approve a suggestion.
 * @param {GuildMember} member - The member who is approving the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.approveSuggestion = (member, suggestionId) => {
  module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
    Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['approved', suggestionId, member.guild.id], err => {
      if (err) Consolex.handleError(err)
    })
  })
}

/**
 * Reject a suggestion.
 * @param {GuildMember} member - The member who is rejecting the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.rejectSuggestion = (member, suggestionId) => {
  module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
    Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['approved', suggestionId, member.guild.id], err => {
      if (err) Consolex.handleError(err)
    })
  })
}

/**
 * Add a note to a suggestion
 * @param {Member} member - The member who is adding a note to the suggestion
 * @param {String} suggestionId
 * @param {String} note
 */

module.exports.addNoteToSuggestion = (member, suggestionId, note) => {

}
