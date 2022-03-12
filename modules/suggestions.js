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

    module.exports.afterCreatingSuggestion(member, suggestionId)

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
 * @param {Function} callback - The callback function.
 * @returns {?Error} - Error
 */

module.exports.approveSuggestion = (member, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')
  Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['approved', suggestionId, member.guild.id], err => {
    if (err) {
      Consolex.handleError(err)
      return callback(err)
    }

    module.exports.afterSuggestionApproval(member, suggestionId)
    return callback(err)
  })
}

/**
 * Reject a suggestion.
 * @param {GuildMember} member - The member who is rejecting the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 * @param {Function} callback - The callback function.
 * @returns {?Error} - Error
 */

module.exports.rejectSuggestion = (member, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')
  Database.query('UPDATE `guildSuggestions` SET `status` = ? WHERE `id` = ? AND `guild` = ?', ['rejected', suggestionId, member.guild.id], err => {
    if (err) {
      Consolex.handleError(err)
      return callback(err)
    }
    return callback(err)
  })
}

/**
 * Add a note to a suggestion
 * @param {Member} member - The member who is adding a note to the suggestion
 * @param {String} suggestionId - The suggestion ID.
 * @param {String} note - The note to add.
 * @param {Function} callback - The callback function.
 * @returns {?Error} - Error
 */

module.exports.addNoteToSuggestion = (member, suggestionId, note, callback) => {
  module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
    suggestion.notes.push({ user: member.id, note, timestamp: new Date() })
    Database.query('UPDATE `guildSuggestions` SET `notes` = ? WHERE `id` = ? AND `guild` = ?', [JSON.stringify(suggestion.notes), suggestionId, member.guild.id], err => {
      if (err) {
        Consolex.handleError(err)
        return callback(err)
      }
      return callback()
    })
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

const { getGuildConfigNext } = require('../functions/guildDataManager')
const { MessageEmbed } = require('discord.js')
const unixTime = require('unix-time')
const i18n = require('../i18n/i18n')

/** The actions taken after creating the suggestion */

module.exports.afterCreatingSuggestion = (member, suggestionId) => {
  getGuildConfigNext(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          const suggestionNotification = new MessageEmbed()
            .setColor('#dd9323')
            .setThumbnail(member.user.displayAvatarURL())
            .addField(':bulb: Submitter', member.user.tag, true)
            .addField(':pencil: Suggestion', suggestion.suggestion)
            .addField(':clock2: Creation Date', `<t:${unixTime(suggestion.timestamp)}>`, true)
            .addField(':id: Identificador', `${suggestion.id}`, true)
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
          channel.send({ embeds: [suggestionNotification] })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
          .setColor('#dd9323')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::REGISTEREDSUCCESSFULLY', { AUTHOR: member, SUGGESTIONID: `\`${suggestion.id}\`` }))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

        try {
          member.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}

/**
 * Actions taken after a suggestion is approved.
 * @param {GuildMember} member - The member who approved the suggestion.
 * @param {String} suggestionId - The suggestion ID.
 */

module.exports.afterSuggestionApproval = (member, suggestionId) => {
  getGuildConfigNext(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      const author = member.guild.members.cache.get(suggestion.author)
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          const suggestionNotification = new MessageEmbed()
            .setColor('#05d43f')
            .setThumbnail(member.user.displayAvatarURL())
            .addField(':bulb: Submitter', `${author.user.username}#${author.user.discriminator}`, true)
            .addField(':pencil: Suggestion', suggestion.suggestion)
            .addField(':clock2: Creation Date', `<t:${unixTime(suggestion.timestamp)}>`, true)
            .addField(':id: Identificador', `${suggestion.id}`, true)
            .addField(':white_check_mark: Reviewer', `${member.user.tag}`, false)
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
          channel.send({ embeds: [suggestionNotification] })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
          .setColor('#05d43f')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::APPROVEDSUCCESSFULLY', { AUTHOR: author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

        try {
          member.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}

/*
module.exports.logSuggestionStatus = (member, suggestionId, status) => {

}
*/
