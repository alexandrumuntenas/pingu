const client = require('../client');

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

	client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
		if (err) {
			client.logError(err);
		}

		// New custom command structure { command: String, reply: String, sendDM: Boolean, sendChannel: String, setRole: String, sendInEmbed: Boolean }

		if (Object.prototype.hasOwnProperty.call(result, '0')) {
			if (Object.prototype.hasOwnProperty.call(result[0], 'customcommandproperties') && result[0].customcommandproperties !== null) {
				this.migrateToNewOrganization(guild, command).then(() => {
					callback({command, reply: result[0].messageReturned});
				});
			} else {
				// To Do: Check if the property is an actual valid Object.
				callback(JSON.parse(result[0].customcommandproperties));
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
*/
module.exports.createCustomCommand = (guild, customcommandproperties) => {
	client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customcommand`, `customcommandproperties`) VALUES (?,?,?)', [guild.id, customcommandproperties.command, JSON.stringify(customcommandproperties)], err => {
		if (err) {
			client.logError(err);
		}
	});
};

/**
 * Delete a custom command
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.deleteCustomCommand = (guild, command) => {
	client.pool.query('DELETE FROM `guildCustomCommands` WHERE `guild` = ? AND `customcommand` = ?', [guild.id, command], err => {
		if (err) {
			client.logError(err);
			return err;
		}
	});
};

/**
 * Update the custom command properties in the database to use the new structures
 * @param {Guild} guild
 * @param {String} command
 */
module.exports.migrateToNewOrganization = (guild, command) => {
	client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ? LIMIT 1', [guild.id, command], (err, result) => {
		if (err) {
			client.logError(err);
		}

		if (Object.prototype.hasOwnProperty.call(result, '0')) {
			const customcommandproperties = {command: result[0].customCommand, reply: result[0].messageReturned};
			client.pool.query('UPDATE `guildCustomCommands` SET `customcommand` = ?, `customcommandproperties` = ? WHERE `guild` = ? AND `customCommand` = ?', [command, JSON.stringify(customcommandproperties), guild.id, result[0].customCommand], err => {
				if (err) {
					client.logError(err);
				}
			});
		}
	});
};
