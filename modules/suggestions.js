const Consolex = require('../functions/consolex');
const Database = require('../functions/databaseConnection');

/**
 * Create a new suggestion in the guild.
 * @param {GuildMember} member
 * @param {String} suggestion
 * @returns {Object} The suggestion object.
 */

const makeId = require('../functions/makeId');

module.exports.createSuggestion = (member, suggestion) => {
	const suggestionProperties = {id: makeId(5), guild: member.guild.id, author: member.id, suggestion, status: 'pending'};

	Database.query('INSERT INTO `guildSuggestions` (`id`, `guild`, `properties`) VALUES (?, ?, ?)', [suggestionProperties.id, suggestionProperties.guild, JSON.stringify(suggestionProperties)], err => {
		if (err) {
			Consolex.handleError(err);
			return;
		}

		return suggestionProperties;
	});
};

/**
 * Delete a suggestion.
 * @param {GuildMember} member
 * @param {String} suggestionID
 */

module.exports.deleteSuggestion = (member, suggestionID) => {
	Database.query('DELETE FROM `guildSuggestions` WHERE `id` = ? AND `guild` = ?', [suggestionID, member.guild.id], err => {
		if (err) {
			Consolex.handleError(err);
		}
	});
};

/**
 * Get all the suggestions in the guild.
 * @param {GuildMember} member
 * @param {Function} callback
 * @returns {Array} Suggestions
 */

module.exports.getSuggestions = (member, callback) => {
	if (!callback) {
		throw new Error('Callback is required.');
	}

	Database.query('SELECT * FROM `guildSuggestions` WHERE `guild` = ?', [member.guild.id], (err, rows) => {
		if (err) {
			Consolex.handleError(err);
			return;
		}

		const suggestions = [];

		if (Object.prototype.hasOwnProperty.call(rows, '0')) {
			for (let i = 0; i < rows.length; i++) {
				suggestions.push(JSON.parse(rows[i].properties));
			}
		}

		callback(suggestions);
	});
};

module.exports.getSuggestion = (guild, suggestionID, callback) => {
	if (!callback) {
		throw new Error('Callback is required.');
	}

	Database.query('SELECT * FROM `guildSuggestions` WHERE `guild` = ? AND `id` = ?', [guild.id, suggestionID], (err, rows) => {
		if (err) {
			Consolex.handleError(err);
			return;
		}

		if (Object.prototype.hasOwnProperty.call(rows, '0')) {
			return JSON.parse(rows[0].properties);
		}
	});
};

/**
 * Approve a suggestion.
 * @param {GuildMember} member - The member who is approving the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.approveSuggestion = (member, suggestionID) => {
	this.getSuggestion(member.guild, suggestionID, suggestion => {
		suggestion.status = 'approved';
		this.updateSuggestion(member, suggestion);
	});
};

/**
 * Reject a suggestion.
 * @param {GuildMember} member - The member who is rejecting the suggestion.
 * @param {String} suggestionID - The suggestion ID.
 */

module.exports.rejectSuggestion = (member, suggestionID) => {
	this.getSuggestion(member.guild, suggestionID, suggestion => {
		suggestion.status = 'rejected';
		this.updateSuggestion(member, suggestion);
	});
};

/**
 * Update a suggestion.
 * @param {GuildMember} member
 * @param {Object} suggestion
 */

module.exports.updateSuggestion = (member, suggestion) => {
	Database.query('UPDATE `guildSuggestions` SET `properties` = ? WHERE `id` = ? AND `guild` = ?', [JSON.stringify(suggestion), suggestion.id, member.guild.id], err => {
		if (err) {
			Consolex.handleError(err);
		}
	});
};
