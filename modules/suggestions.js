const Consolex = require('../functions/consolex')
const Database = require('../functions/databaseConnection')

/**
 * Create a new suggestion in the guild.
 * @param {GuildMember} member - The member who created the suggestion.
 * @param {String} suggestion - The suggestion to be made.
 * @param {Function} callback - The callback function.
 * @returns {String} - The suggestion id.
 */

const makeId = require('../functions/makeId')

module.exports.createSuggestion = (member, suggestion, callback) => {
  if (!callback) throw new Error('Callback is required.')

  const suggestionId = makeId(5)
  Database.query('INSERT INTO `guildSuggestions` (`id`, `guild`, `author`, `suggestion`) VALUES (?, ?, ?, ?)', [suggestionId, member.guild.id, member.id, suggestion], err => {
    if (err) {
      Consolex.handleError(err)
      return callback()
    }

    return callback(suggestionId)
  })
}

/**
 * Delete a suggestion.
 * @param {Guild} guild - The member who is deleting the suggestion.
 * @param {String} suggestionId - The suggestion id.
 */

module.exports.deleteSuggestion = (guild, suggestionId) => {
  Database.query('DELETE FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], err => {
    if (err) Consolex.handleError(err)
  })
}

/**
 * Get all the suggestions in the guild.
 * @param {Guild} guild - The guild.
 * @param {Function} callback - The callback function.
 * @returns {Array} - Suggestions
 */

module.exports.getSuggestions = (guild, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `guildSuggestions` WHERE `guild` = ?', [guild.id], (err, rows) => {
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
 * @param {Guild} guild - The guild.
 * @param {String} suggestionId - The suggestion id.
 * @param {Function} callback - The callback.
 * @returns {{id: Integer, suggestion: String, notes: Array[{user: User.Id, note: String, timestamp: Date}], status: String(approved, pending, reviewed, rejected), timestamp: Date, reviewer: User.Id, ?votingresults: {yes: Integer, no: Integer, abstain: Guild.Member_Count}}} Suggestion
 */

module.exports.getSuggestion = (guild, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], (err, rows) => {
    if (err) return Consolex.handleError(err)

    if (Object.prototype.hasOwnProperty.call(rows, '0')) {
      try {
        rows[0].notes = JSON.parse(rows[0].notes)
      } catch {
        rows[0].notes = []
      }
      return callback(rows[0])
    }
    return callback()
  })
}

/**
 * Approve a suggestion.
 * @param {GuildMember} member - The member who is approving the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.approveSuggestion = (member, suggestionId) => {
  Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['approved', suggestionId, member.guild.id], err => {
    if (err) Consolex.handleError(err)
  })
}

/**
 * Reject a suggestion.
 * @param {GuildMember} member - The member who is rejecting the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.rejectSuggestion = (member, suggestionId) => {
  Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['rejected', suggestionId, member.guild.id], err => {
    if (err) Consolex.handleError(err)
  })
}

/**
 * Add a note to a suggestion
 * @param {Member} member - The member who is adding a note to the suggestion
 * @param {String} suggestionId - The suggestion ID.
 * @param {String} note - The note to add.
 */

module.exports.addNoteToSuggestion = (member, suggestionId, note) => {
  module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
    suggestion.notes.push({ user: member.id, note, timestamp: new Date() })
  })
}

/**
 * Get all the suggestions a member has done in a guild.
 * @param {GuildMember} member - The member we are checking for.
 * @param {Function} callback - The callback function.
 */

module.exports.getMemberSuggestions = (member, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `guildSuggestions` WHERE `author` = ? AND `guild` = ? ORDER BY `timestamp` DESC LIMIT 10', [member.id, member.guild.id], (err, rows) => {
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
