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

  Database.query('SELECT * FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], async (err, rows) => {
    if (err) return Consolex.handleError(err)

    if (Object.prototype.hasOwnProperty.call(rows, '0')) {
      try {
        rows[0].notes = JSON.parse(rows[0].notes)
      } catch {
        rows[0].notes = []
      }

      rows[0].author = await guild.members.cache.get(rows[0].author) // skipcq: JS-0040
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

    module.exports.events.afterSuggestionApproval(member, suggestionId)
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

const { getGuildConfig, updateGuildConfig } = require('../functions/guildDataManager')
const { MessageEmbed } = require('discord.js')
const i18n = require('../i18n/i18n')

module.exports.events = {}

/** Estructura prederminada de los mensajes enviados a través de los canales */

const defaultEmbed = (member, suggestion) => {
  const embed = new MessageEmbed()
    .setAuthor({ name: member.user.tag || 'Mysterious User#0000', iconURL: member.user.displayAvatarURL() || 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png' })
    .addField(':bulb: Submitter', `${suggestion.author.user.username || 'Mysterious User'}#${suggestion.author.user.discriminator || '0000'}`, true)
    .addField(':pencil: Suggestion', suggestion.suggestion)
    .setFooter({ text: `sID: ${suggestion.id}`, iconURL: member.guild.iconURL() }).setTimestamp()
  return embed
}

/** Estructura prederminada de los mensajes enviados a través de MD */

const defaultDMEmbed = (guild) => {
  const embed = new MessageEmbed()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
    .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

  return embed
}

const messageManager = require('../functions/messageManager')

/** The actions taken after creating the suggestion */

module.exports.events.afterCreatingSuggestion = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.channel) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.channel, {
          embeds: [defaultEmbed(member, suggestion)
            .setColor('#dd9323')
            .setTitle(i18n(guildConfig.common.language, 'SUGGESTIONS_EVENTS::CREATED'))
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n(guildConfig.common.language, 'SUGGESTIONS::REGISTEREDSUCCESSFULLY', { AUTHOR: suggestion.author, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

/** Actions taken after a suggestion is approved. */

module.exports.events.afterSuggestionApproval = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion).setColor('#05d43f')
            .setTitle(i18n(guildConfig.common.language, 'SUGGESTIONS_EVENTS::APPROVED'))
            .addField(`:white_check_mark: ${i18n(guildConfig.common.language, 'APPROVEDBY')}`, `${member} \`[${member.id}]\``, false)
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#05d43f')
              .setDescription(i18n(guildConfig.common.language, 'SUGGESTIONS::APPROVEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

/** Actions taken after a suggestion is rejected. */

module.exports.events.afterSuggestionRejection = (member, suggestionId) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion).setColor('#cf000f')
            .setTitle(i18n(guildConfig.common.language, 'SUGGESTIONS_EVENTS::REJECTED'))
            .addField(`:x: ${i18n(guildConfig.common.language, 'REJECTEDBY')}`, `${member} \`[${member.id}]\``, false)
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n(guildConfig.common.language, 'SUGGESTIONS::REJECTEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

/** Actions taken after adding a note to a suggestion */

module.exports.events.afterAddingANoteToASuggestion = (member, suggestionId, note) => {
  getGuildConfig(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion)
            .setColor('#dd9323')
            .setTitle(i18n(guildConfig.common.language, 'SUGGESTIONS_EVENTS::NOTEADDED'))
            .addField(`:clipboard: ${i18n(guildConfig.common.language, 'STAFFNOTE')}`, note)
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n(guildConfig.common.language, 'SUGGESTIONS::NOTEADDEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\``, NOTE: note }))
          ]
        })
      }
    })
  })
}

/**
 * Prohibe que un usuario pueda crear sugerencias en el servidor
 * @param {Guild} guild
 * @param {User} user
 */

module.exports.addUserToBlacklist = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  getGuildConfig(guild, guildConfig => {
    Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist') && typeof guildConfig.suggestions.blacklist === 'object' ? guildConfig.suggestions.blacklist.push(user.id) : guildConfig.suggestions.blacklist = [user.id]

    updateGuildConfig(guild, { column: 'suggestions', newconfig: { blacklist: JSON.stringify(guildConfig.suggestions.blacklist) } }, err => {
      if (err) return callback(err)
      return callback()
    })
  })
}

/**
 * Comprueba si el usuario está en la lista negra
 * @param {Guild} guild
 * @param {User} user
 * @param {Function} callback
 * @returns {Boolean}
 */

module.exports.checkIfUserIsBlacklisted = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  getGuildConfig(guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist') && typeof guildConfig.suggestions.blacklist === 'object') {
      return callback(guildConfig.suggestions.blacklist.includes(user.id))
    }
    // eslint-disable-next-line node/no-callback-literal
    return callback(false)
  })
}

/**
 * Elimina un usuario de la lista negra
 * @param {Guild} guild
 * @param {User} user
 * @param {Function} callback
 * @returns {Error}
 */

module.exports.removeUserFromBlacklist = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  getGuildConfig(guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist') && typeof guildConfig.suggestions.blacklist === 'object') {
      delete guildConfig.suggestions.blacklist[guildConfig.suggestions.blacklist.indexOf(user.id)]
    }

    updateGuildConfig(guild, { column: 'suggestions', newconfig: { blacklist: JSON.stringify(guildConfig.suggestions.blacklist) } }, err => {
      if (err) return callback(err)
      return callback()
    })
  })
}
