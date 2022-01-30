/**
 * Get a reply of the given trigger.
 * @param {Guild} guild - The guild to get the reply from.
 * @param {String} trigger - The trigger to get the reply for.
 * @param {Function} callback - The callback to call with the result.
 * @returns {String} Reply
 */

const Consolex = require('../functions/consolex');
const Database = require('../functions/databaseConnection');

module.exports.getReply = (guild, trigger, callback) => {
	if (!callback) {
		throw new Error('Callback is required');
	}

	Database.query('SELECT * FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ? LIMIT 1', [trigger.toLowerCase(), guild.id], (err, result) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (Object.prototype.hasOwnProperty.call(result, '0') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyReply') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyProperties')) {
			result[0].autoreplyProperties = JSON.parse(result[0].autoreplyProperties);
			callback(result[0]);
		} else {
			callback();
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
 * @param {Boolean} autoreply.properties.sendInEmbed - Whether or not to send the reply as an embed.
 * @param {?Object} autoreply.properties.sendInEmbed.title - The title field of the embed.
 * @param {?Object} autoreply.properties.sendInEmbed.description - The description field of the embed.
 * @param {?Object} autoreply.properties.sendInEmbed.thumbnail - The thumbnail field of the embed.
 * @param {?Object} autoreply.properties.sendInEmbed.image - The image field of the embed.
 * @param {?Object} autoreply.properties.sendInEmbed.url - The url field of the embed.
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

	Database.query('INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyReply`, `autoreplyProperties`) VALUES (?, ?, ?, ?, ?)', [guild.id, autoreply.id, autoreply.trigger, autoreply.reply, JSON.stringify(autoreply.properties)], err => {
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
	Database.query('DELETE FROM `guildAutoReply` WHERE `autoreplyID` = ? AND `guild` = ?', [triggerID, guild.id], err => {
		if (err) {
			Consolex.handleError(err);
			throw err;
		}
	});
};

/**
 * Handle an auto reply.
 * @param {Message} message
 */

const i18n = require('../i18n/i18n');
const {MessageEmbed} = require('discord.js');

module.exports.handleAutoRepliesInMessageCreate = message => {
	this.getReply(message.guild, message.content, replydata => {
		if (replydata) {
			const reply = {};
			if (reply.sendInEmbed) {
				const embed = new MessageEmbed();

				if (replydata.sendInEmbed.title) {
					embed.setTitle(replydata.sendEmbed.title);
				}

				if (reply.sendInEmbed.description) {
					reply.content = replydata.reply;
					embed.setDescription(replydata.sendEmbed.description);
				} else {
					embed.setDescription(replydata.reply);
				}

				if (replydata.sendInEmbed.thumbnail) {
					embed.setThumbnail(replydata.sendEmbed.thumbnail);
				}

				if (replydata.sendInEmbed.image) {
					embed.setImage(replydata.sendEmbed.image);
				}

				if (replydata.sendInEmbed.url) {
					embed.setURL(replydata.sendEmbed.url);
				}

				if (replydata.sendInEmbed.color) {
					embed.setColor(replydata.sendEmbed.color);
				} else {
					embed.setColor('#2F3136');
				}

				embed.setFooter({text: i18n(message.guild.configuration.common.language || 'en', 'CUSTOMCOMMANDS::LINKWARNING'), iconURL: process.Client.user.displayAvatarURL()});

				reply.embeds = [embed];
			} else {
				reply.content = replydata.autoreplyReply;
			}

			try {
				message.channel.send(reply);
			} catch (err) {
				Consolex.handleError(err);
			}
		}
	});
};
