const Database = require('../functions/databaseConnection');
const Consolex = require('../functions/consolex');
const Client = require('../client');

/**
 * Get the custom command from the database
 * @param {Guild} guild
 * @param {String} command
 * @param {Function} callback
 * @returns {Object} customCommand
 */

module.exports.getCustomCommand = (guild, command, callback) => {
	if (!callback) {
		throw new Error('Callback is required');
	}

	Database.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
		if (err) {
			Consolex.handleError(err);
		}

		// New custom command structure { command: String, reply: String, sendDM: Boolean, sendChannel: String, setRole: String, sendInEmbed: Boolean }

		if (Object.prototype.hasOwnProperty.call(result, '0')) {
			if (Object.prototype.hasOwnProperty.call(result[0], 'customcommandproperties') && result[0].customcommandproperties !== null) {
				// To Do: Check if the property is an actual valid Object.
				callback(JSON.parse(result[0].customcommandproperties));
			} else {
				this.migrateToNewOrganization(guild, command).then(() => {
					console.log('here?');
					callback({command, reply: result[0].messageReturned});
				});
			}
		}
	});
};

/**
 * Create a new custom command for the guild
 * @param {Guild} guild
 * @param {Object} customcommandproperties
 * @param {String} customcommandproperties.command - The command to be used
 * @param {String} customcommandproperties.reply - The reply to be sent
 * @param {?Boolean} customcommandproperties.sendDM - Whether or not to send the reply in a DM
 * @param {?TextChannel} customcommandproperties.sendChannel - The channel to send the reply in
 * @param {?Role} customcommandproperties.setRole - The role to set
 * @param {?Boolean} customcommandproperties.sendInEmbed - Whether or not to send the reply in an embed
 * @param {?String} customcommandproperties.sendInEmbed.title - The title field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.description - The description field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.thumbnail - The thumbnail field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.image - The image field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.url - The url field of the embed.
 * @param {?String} customcommandproperties.sendInEmbed.color - The url field of the embed.
*/
module.exports.createCustomCommand = (guild, customcommandproperties) => {
	Database.query('INSERT INTO `guildCustomCommands` (`guild`, `customcommand`, `customcommandproperties`) VALUES (?,?,?)', [guild.id, customcommandproperties.command, JSON.stringify(customcommandproperties)], err => {
		if (err) {
			Consolex.handleError(err);
		}
	});
};

/**
 * Delete a custom command
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.deleteCustomCommand = (guild, command) => {
	Database.query('DELETE FROM `guildCustomCommands` WHERE `guild` = ? AND `customcommand` = ?', [guild.id, command], err => {
		if (err) {
			Consolex.handleError(err);
			return err;
		}
	});
};

/**
 * Update the custom command properties in the database to use the new structures
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.migrateToNewOrganization = async (guild, command) => {
	Database.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (Object.prototype.hasOwnProperty.call(result, '0')) {
			const customcommandproperties = {command: result[0].customCommand, reply: result[0].messageReturned};
			Database.query('UPDATE `guildCustomCommands` SET `customcommand` = ?, `customcommandproperties` = ? WHERE `guild` = ? AND `customCommand` = ?', [command, JSON.stringify(customcommandproperties), guild.id, result[0].customCommand], err => {
				if (err) {
					Consolex.handleError(err);
				}
			});
		}
	});
};

/**
 * Runs the custom command if it exists
 * @param {Message} message
 * @param {String} command
 */

const {MessageEmbed} = require('discord.js');
const i18n = require('../i18n/i18n');

module.exports.runCustomCommand = (message, command) => {
	this.getCustomCommand(message.guild, command, customCommand => {
		const reply = {};

		if (customCommand.sendInEmbed) {
			const embed = new MessageEmbed();

			if (customCommand.sendInEmbed.title) {
				embed.setTitle(customCommand.sendEmbed.title);
			}

			if (customCommand.sendInEmbed.description) {
				reply.content = customCommand.reply;
				embed.setDescription(customCommand.sendEmbed.description);
			} else {
				embed.setDescription(customCommand.reply);
			}

			if (customCommand.sendInEmbed.thumbnail) {
				embed.setThumbnail(customCommand.sendEmbed.thumbnail);
			}

			if (customCommand.sendInEmbed.image) {
				embed.setImage(customCommand.sendEmbed.image);
			}

			if (customCommand.sendInEmbed.url) {
				embed.setURL(customCommand.sendEmbed.url);
			}

			if (customCommand.sendInEmbed.color) {
				embed.setColor(customCommand.sendEmbed.color);
			} else {
				embed.setColor('#2F3136');
			}

			embed.setFooter({text: i18n(message.guild.configuration.common.language || 'en', 'CUSTOMCOMMANDS::LINKWARNING'), iconURL: Client.user.displayAvatarURL()});

			reply.embeds = [embed];
		} else {
			reply.content = customCommand.reply;
		}

		if (customCommand.setRole) {
			message.member.roles.add(customCommand.setRole);
		}

		if (customCommand.sendDM) {
			try {
				reply.embeds = [new MessageEmbed().setDescription(customCommand.reply)];
				message.author.send(reply);
				try {
					message.delete();
				} catch (err) {
					Consolex.handleError(err);
				}

				return;
			} catch (err) {
				Consolex.handleError(err);
			}
		}

		if (customCommand.sendChannel) {
			const customChannelToSend = message.guild.channel.cache.get(customCommand.sendChannel);
			if (customChannelToSend) {
				customChannelToSend.send(reply);
			} else {
				message.reply(reply);
			}
		} else {
			message.reply(reply);
		}
	});
};
