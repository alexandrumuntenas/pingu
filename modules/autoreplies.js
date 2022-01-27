/**
 * Get a reply of the given trigger.
 * @param {Guild} guild - The guild to get the reply from.
 * @param {String} trigger - The trigger to get the reply for.
 * @param {Function} callback - The callback to call with the result.
 * @returns {String} Reply
 */

const Client = require('../Client');

module.exports.getReply = (guild, trigger, callback) => {
	if (!callback) {
		throw new Error('Callback is required');
	}

	Client.Database.query('SELECT 1 FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ?', [trigger, guild.id], (err, result) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (Object.prototype.hasOwnProperty.call(result, '0') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyReply') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyProperties')) {
			callback(result[0]);
		}
	});
};

/**
 * Create a new auto reply.
 * @param {Guild} guild - The guild to create the reply in.
 * @param {Object} autoreply - The autoreply to create.
 * @param {Strong} autoreply.trigger - The string that will trigger the reply.
 * @param {String} autoreply.reply - The reply to the trigger.
 * @param {Object} autoreply.properties - The autoreply properties
 * @param {Boolean} autoreply.properties.sendEmbed - Whether or not to send the reply as an embed.
 * @param {?Object} autoreply.properties.sendEmbed.title - The title field of the embed.
 * @param {?Object} autoreply.properties.sendEmbed.description - The description field of the embed.
 * @param {?Object} autoreply.properties.sendEmbed.thumbnail - The thumbnail field of the embed.
 * @param {?Object} autoreply.properties.sendEmbed.image - The image field of the embed.
 * @param {?Object} autoreply.properties.sendEmbed.url - The url field of the embed.
 * @param {Functions} callback - The callback to call.
 * @returns {String} Trigger ID
 */

const makeId = require('../functions/makeId');

module.exports.createReply = (guild, autoreply, callback) => {
	if (!callback) {
		throw new Error('Callback is required');
	}

	if (!Object.prototype.hasOwnProperty.call(autoreply, 'trigger')) {
		throw new Error('Trigger is required');
	}

	if (!Object.prototype.hasOwnProperty.call(autoreply, 'reply')) {
		throw new Error('Reply is required');
	}

	autoreply.properties = autoreply.properties || {};
	autoreply.properties.sendEmbed = autoreply.properties.sendEmbed || false;
	autoreply.id = makeId(5);

	Client.Database.query('INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyReply`, `autoreplyProperties`) VALUES (?, ?, ?, ?, ?)', [guild.id, autoreply.id, autoreply.trigger, autoreply.reply, JSON.stringify(autoreply.properties)], err => {
		if (err) {
			Consolex.handleError(err);
			throw err;
		}

		callback(autoreply.id);
	});
};

/**
 * Delete an auto reply.
 * @param {Guild} guild
 * @param {String} triggerID
 */

module.exports.deleteReply = (guild, triggerID) => {
	Client.Database.query('DELETE FROM `guildAutoReply` WHERE `autoreplyID` = ? AND `guild` = ?', [triggerID, guild.id], err => {
		if (err) {
			Consolex.handleError(err);
			throw err;
		}
	});
};
