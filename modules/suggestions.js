module.exports.modeloDeConfiguracion = {
  enabled: 'boolean',
  blacklist: 'array',
  channel: 'string'
}

const Consolex = require('../core/consolex')
const Database = require('../core/databaseManager')
const randomstring = require('randomstring')

/**
 * @param {GuildMember} member - The member who created the suggestion.
 * @param {String} suggestion - The suggestion to be made.
 * @returns {String} - The suggestion id.
 */

module.exports.createSuggestion = (member, suggestion, callback) => {
  if (!callback) throw new Error('Callback is required.')

  const suggestionId = randomstring.generate({ charset: 'alphabetic', length: 5 })
  Database.execute('INSERT INTO `guildSuggestions` (`id`, `guild`, `author`, `suggestion`) VALUES (?, ?, ?, ?)', [suggestionId, member.guild.id, member.id, suggestion], err => {
    if (err) {
      Consolex.gestionarError(err)
      return callback()
    }

    module.exports.events.afterCreatingSuggestion(member, suggestionId)

    return callback(suggestionId)
  })
}

/**
 * @param {Guild} guild - The member who is deleting the suggestion.
 * @param {String} suggestionId - The suggestion id.
 */

module.exports.deleteSuggestion = (guild, suggestionId) => {
  Database.execute('DELETE FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], err => {
    if (err) Consolex.gestionarError(err)
  })
}

/**
 * @param {Guild} guild - The guild.
 * @returns {Array} - Suggestions
 */

module.exports.getSuggestions = (guild, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.execute('SELECT * FROM `guildSuggestions` WHERE `guild` = ?', [guild.id], (err, suggestions) => {
    if (err) return Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(suggestions, '0')) return callback(suggestions)

    return callback()
  })
}

/**
 * @param {Guild} guild - The guild.
 * @param {String} suggestionId - The suggestion id.
 * @returns {{id: Integer, suggestion: String, notes: Array[{user: User.Id, note: String, timestamp: Date}], status: String(approved, pending, reviewed, rejected), timestamp: Date, reviewer: User.Id, ?votingresults: {yes: Integer, no: Integer, abstain: Guild.Member_Count}}} Suggestion
 */

module.exports.getSuggestion = (guild, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.execute('SELECT * FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionId, guild.id], async (err, rows) => {
    if (err) return Consolex.gestionarError(err)

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
 * @param {GuildMember} member - The member who is approving the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 * @returns {?Error} - Error
 */

module.exports.approveSuggestion = (member, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')
  Database.execute('UPDATE `guildSuggestions` SET `status` = ?, reviewer = ? WHERE `id` = ? AND `guild` = ?', ['approved', member.id, suggestionId, member.guild.id], err => {
    if (err) {
      Consolex.gestionarError(err)
      return callback(err)
    }

    module.exports.events.afterSuggestionApproval(member, suggestionId)
    return callback(err)
  })
}

/**
 * @param {GuildMember} member - The member who is rejecting the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 * @returns {?Error} - Error
 */

module.exports.rejectSuggestion = (member, suggestionId, callback) => {
  if (!callback) throw new Error('Callback is required.')
  Database.execute('UPDATE `guildSuggestions` SET `status` = ?, reviewer = ? WHERE `id` = ? AND `guild` = ?', ['rejected', member.id, suggestionId, member.guild.id], err => {
    if (err) {
      Consolex.gestionarError(err)
      return callback(err)
    }
    module.exports.events.afterSuggestionRejection(member, suggestionId)
    return callback(err)
  })
}

/**
 * @param {Member} member - The member who is adding a note to the suggestion
 * @param {String} suggestionId - The suggestion ID.
 * @param {String} note - The note to add.
 * @returns {?Error} - Error
 */

module.exports.addNoteToSuggestion = (member, suggestionId, note, callback) => {
  module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
    suggestion.notes.push({ user: member.id, note, timestamp: new Date() })
    Database.execute('UPDATE `guildSuggestions` SET `notes` = ? WHERE `id` = ? AND `guild` = ?', [JSON.stringify(suggestion.notes), suggestionId, member.guild.id], err => {
      if (err) {
        Consolex.gestionarError(err)
        return callback(err)
      }
      module.exports.events.afterAddingANoteToASuggestion(member, suggestionId, note)
      return callback()
    })
  })
}

/**
 * @param {GuildMember} member - The member we are checking for.
 */

module.exports.getMemberSuggestions = (member, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.execute('SELECT * FROM `guildSuggestions` WHERE `author` = ? AND `guild` = ? ORDER BY `timestamp` DESC LIMIT 10', [member.id, member.guild.id], (err, rows) => {
    if (err) return Consolex.gestionarError(err)

    const suggestions = []

    if (Object.prototype.hasOwnProperty.call(rows, '0')) {
      for (let i = 0; i < rows.length; i++) {
        suggestions.push(rows[i])
      }
    }

    return callback(suggestions)
  })
}

const { obtenerConfiguracionDelServidor, actualizarConfiguracionDelServidor } = require('../core/guildManager')
const { EmbedBuilder } = require('discord.js')
const i18n = require('../core/i18nManager')

module.exports.events = {}

const defaultEmbed = (member, suggestion) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.user.tag || 'Mysterious User#0000', iconURL: member.user.displayAvatarURL() || 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png' })
    .addFields([
      { name: ':bulb: Submitter', value: `${suggestion.author.user.username || 'Mysterious User'}#${suggestion.author.user.discriminator || '0000'}`, inline: true },
      { name: ':pencil: Suggestion', value: suggestion.suggestion, inline: true }
    ])
    .setFooter({ text: `sID: ${suggestion.id}`, iconURL: member.guild.iconURL() }).setTimestamp()
  return embed
}

const defaultDMEmbed = (guild) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
    .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

  return embed
}

const messageManager = require('../core/messageManager')

module.exports.events.afterCreatingSuggestion = (member, suggestionId) => {
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.channel) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.channel, {
          embeds: [defaultEmbed(member, suggestion)
            .setColor('#dd9323')
            .setTitle(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS_EVENTS::CREATED'))
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS::REGISTEREDSUCCESSFULLY', { AUTHOR: suggestion.author, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

module.exports.events.afterSuggestionApproval = (member, suggestionId) => {
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion).setColor('#05d43f')
            .setTitle(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS_EVENTS::APPROVED'))
            .addFields([{ name: `:white_check_mark: ${i18n.getTranslation(guildConfig.common.language, 'APPROVEDBY')}`, value: `${member} \`[${member.id}]\``, inline: false }])
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#05d43f')
              .setDescription(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS::APPROVEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

module.exports.events.afterSuggestionRejection = (member, suggestionId) => {
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion).setColor('#cf000f')
            .setTitle(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS_EVENTS::REJECTED'))
            .addFields([{ name: `:x: ${i18n.getTranslation(guildConfig.common.language, 'REJECTEDBY')}`, value: `${member} \`[${member.id}]\``, inline: false }])
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS::REJECTEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\`` }))
          ]
        })
      }
    })
  })
}

module.exports.events.afterAddingANoteToASuggestion = (member, suggestionId, note) => {
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    module.exports.getSuggestion(member.guild, suggestionId, suggestion => {
      if (guildConfig.suggestions.logs) {
        messageManager.acciones.enviarMensajeACanal(member.guild, guildConfig.suggestions.logs, {
          embeds: [defaultEmbed(member, suggestion)
            .setColor('#dd9323')
            .setTitle(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS_EVENTS::NOTEADDED'))
            .addFields([{ name: `:clipboard: ${i18n.getTranslation(guildConfig.common.language, 'STAFFNOTE')}`, value: note }])
          ]
        })
      }

      if (guildConfig.suggestions.dmupdates) {
        messageManager.acciones.enviarMD(suggestion.author, {
          embeds: [
            defaultDMEmbed(member.guild)
              .setColor('#dd9323')
              .setDescription(i18n.getTranslation(guildConfig.common.language, 'SUGGESTIONS::NOTEADDEDSUCCESSFULLY', { AUTHOR: suggestion.author, REVIEWER: member.user.tag, SUGGESTIONID: `\`${suggestion.id}\``, NOTE: note }))
          ]
        })
      }
    })
  })
}

/**
 * @param {Guild} guild
 * @param {User} user
 */

module.exports.addUserToBlacklist = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  obtenerConfiguracionDelServidor(guild, guildConfig => {
    Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist') && typeof guildConfig.suggestions.blacklist === 'object' ? guildConfig.suggestions.blacklist.push(user.id) : guildConfig.suggestions.blacklist = [user.id]

    actualizarConfiguracionDelServidor(guild, { column: 'suggestions', newconfig: { blacklist: JSON.stringify(guildConfig.suggestions.blacklist) } }, err => {
      if (err) return callback(err)
      return callback()
    })
  })
}

/**
 * @param {Guild} guild
 * @param {User} user
 * @returns {Boolean}
 */

module.exports.checkIfUserIsBlacklisted = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  obtenerConfiguracionDelServidor(guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist')) return callback(guildConfig.suggestions.blacklist.includes(user.id))

    // eslint-disable-next-line node/no-callback-literal
    return callback(false)
  })
}

/**
 * @param {Guild} guild
 * @param {User} user
 * @returns {Error}
 */

module.exports.removeUserFromBlacklist = (guild, user, callback) => {
  if (!callback) return new Error('Callback is required')
  obtenerConfiguracionDelServidor(guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig.suggestions, 'blacklist') && typeof guildConfig.suggestions.blacklist === 'object') {
      delete guildConfig.suggestions.blacklist[guildConfig.suggestions.blacklist.indexOf(user.id)]
    }

    actualizarConfiguracionDelServidor(guild, { column: 'suggestions', newconfig: { blacklist: JSON.stringify(guildConfig.suggestions.blacklist) } }, err => {
      if (err) return callback(err)
      return callback()
    })
  })
}
