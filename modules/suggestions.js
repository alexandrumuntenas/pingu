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

    module.exports.events.afterCreatingSuggestion(member, suggestionId)

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

  Database.query('SELECT * FROM `guildSuggestions` WHERE `guild` = ?', [guild.id], (err, suggestions) => {
    if (err) return Consolex.handleError(err)

    if (Object.prototype.hasOwnProperty.call(suggestions, '0')) return callback(suggestions)

    return callback()
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
  Database.query('UPDATE `guildSuggestions` SET `status` = ?, reviewer = ? WHERE `id` = ? AND `guild` = ?', ['approved', member.id, suggestionId, member.guild.id], err => {
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
  Database.query('UPDATE `guildSuggestions` SET `status` = ?, reviewer = ? WHERE `id` = ? AND `guild` = ?', ['rejected', member.id, suggestionId, member.guild.id], err => {
    if (err) {
      Consolex.handleError(err)
      return callback(err)
    }
    module.exports.events.afterSuggestionRejection(member, suggestionId)
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
      module.exports.events.afterAddingANoteToASuggestion(member, suggestionId, note)
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

const { getGuildConfig } = require('../functions/guildDataManager')
const { MessageEmbed } = require('discord.js')
const i18n = require('../i18n/i18n')

module.exports.events = {}

const defaultEmbed = (member, suggestion) => {
  const author = member.guild.members.cache.get(suggestion.author)

  const embed = new MessageEmbed()
    .setAuthor({ name: member.user.tag || 'Mysterious User#0000', iconURL: member.user.displayAvatarURL() || 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png' })
    .addField(':bulb: Submitter', `${author.user.username || 'Mysterious User'}#${author.user.discriminator || '0000'}`, true)
    .addField(':pencil: Suggestion', suggestion.suggestion)
    .setFooter({ text: `sID: ${suggestion.id}`, iconURL: member.guild.iconURL() }).setTimestamp()
  return embed
}

const defaultDMEmbed = (member, suggestion) => {
  const author = member.guild.members.cache.get(suggestion.author)

  const embed = new MessageEmbed()
    .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
    .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

  return embed
}

/** The actions taken after creating the suggestion */

module.exports.events.afterCreatingSuggestion = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          channel.send({ embeds: [defaultEmbed(member, suggestion).setColor('#dd9323')] })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setColor('#dd9323')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::REGISTEREDSUCCESSFULLY', { AUTHOR: member, SUGGESTIONID: `\`${suggestion.id}\`` }))

        try {
          member.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}

/** Actions taken after a suggestion is approved. */

module.exports.events.afterSuggestionApproval = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          channel.send({
            embeds: [defaultEmbed(member, suggestion).setColor('#05d43f')
              .setTitle('Approved a suggestion')
              .addField(':white_check_mark: Approved by', `${member} \`[${member.id}]\``, false)
            ]
          })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setColor('#05d43f')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::APPROVEDSUCCESSFULLY', { AUTHOR: author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))

        try {
          author.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}

/** Actions taken after a suggestion is rejected. */

module.exports.events.afterSuggestionRejection = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      const author = member.guild.members.cache.get(suggestion.author)
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          channel.send({
            embeds: [defaultEmbed(member, suggestion).setColor('#cf000f')
              .setTitle('Rejected a suggestion')
              .addField(':white_check_mark: Rejected by', `${member} \`[${member.id}]\``, false)
            ]
          })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setColor('#dd9323')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::REJECTEDSUCCESSFULLY', { AUTHOR: author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))

        try {
          member.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}

/** Actions taken after adding a note to a suggestion */

module.exports.events.afterAddingANoteToASuggestion = (member, suggestionId, note) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      const author = member.guild.members.cache.get(suggestion.author)
      if (guildConfig.suggestions.channel) {
        const channel = member.guild.channels.cache.get(guildConfig.suggestions.channel)

        if (channel) {
          channel.send({
            embeds: [defaultEmbed(member, suggestion)
              .setColor('#dd9323')
              .setTitle('Added a new note to a suggestion')
              .addField(':clipboard: Staff Note', note)
            ]
          })
        }
      }

      if (guildConfig.suggestions.dmupdates) {
        const suggestionNotificationForDM = new MessageEmbed()
          .setColor('#dd9323')
          .setDescription(i18n(guildConfig.common.language | 'es', 'SUGGESTIONS::NOTEADDEDSUCCESSFULLY', { AUTHOR: author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\``, NOTE: note }))

        try {
          author.user.send({ embeds: [suggestionNotificationForDM] })
        } catch (err) {
          Consolex.handleError(err)
        }
      }
    })
  })
}
