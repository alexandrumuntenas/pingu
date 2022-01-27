const Client = require('../Client');
const Consolex = require('../functions/consolex');

/**
 * Get member data from the database.
 * @param {GuildMember} member - The Member to get the data for
 * @param {Function} callback - The callback function
 * @callback memberData - The member data
 */

module.exports.getMember = (member, callback) => {
	const sentryEvent = Consolex.Sentry.startTransaction({
		op: 'memberManager.getMember',
		name: 'memberManager (Get Member)',
	});
	Client.Database.query('SELECT * FROM `memberData` WHERE member = ? AND guild = ?', [member.id, member.guild.id], (err, memberData) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (memberData && Object.prototype.hasOwnProperty.call(memberData, 0)) { //! THIS SECTION HAS TO BE REMOVED AND SPLIT IN THE FUTURE
			memberData[0].ecoBalance = parseInt(memberData[0].ecoBalance, 10);
			Client.Database.query('SELECT member, ROW_NUMBER() OVER (ORDER BY lvlLevel DESC, lvlExperience DESC) AS lvlRank FROM memberData WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC', [member.guild.id], (err, result) => {
				if (err) {
					Consolex.handleError(err);
				}

				if (result && Object.prototype.hasOwnProperty.call(result, '0')) {
					result.filter(r => r.member === member.id).forEach(r => {
						member[0].lvlRank = r.lvlRank;
					});
				}
			});
		} else {
			module.exports.createMember(Client, member, () => {
				module.exports.getMember(Client, member, callback);
				sentryEvent.finish();
			});
		}
	});
};

/**
 * Create a new member entry in the database.
 * @param {GuildMember} member - The Member to create the data for
 * @param {Function} callback - The callback function
 */

module.exports.createMember = (member, callback) => {
	const sentryEvent = Consolex.Sentry.startTransaction({
		op: 'memberManager.createMember',
		name: 'memberManager (Create Member)',
	});
	Client.Database.query('INSERT INTO `memberData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], err => {
		if (err) {
			Consolex.handleError(err);
		}

		if (callback) {
			callback();
		}

		sentryEvent.finish();
	});
};

/**
 * Update the member's data from the database.
 * @param {GuildMember} member - The Member to update the data for
 * @param {Object} memberDataToUpdate - The data to update
 * @param {?String} memberDataToUpdate.lvlExperience - Member Experience
 * @param {?String} memberDataToUpdate.lvlLevel - Member Level
 * @param {?String} memberDataToUpdate.ecoBalance - Member Balance
 * @param {?Array} memberDataToUpdate.ecoInventory - Member Inventory
 * @param {Function} callback - The callback function
 */

module.exports.updateMember = (member, memberDataToUpdate, callback) => {
	const sentryEvent = Consolex.Sentry.startTransaction({
		op: 'memberManager.updateMember',
		name: 'memberManager (Update Member)',
	});
	if (!memberDataToUpdate) {
		throw Error('You didn\' provide any data to update.');
	}

	module.exports.getMember(Client, member, memberData => {
		Client.Database.query('UPDATE `memberData` SET `lvlLevel` = ?, `lvlExperience` = ?, `ecoBalance` = ?, `ecoInventory` = ? WHERE `guild` = ? AND `member` = ?', [memberDataToUpdate.lvlLevel || memberData.lvlLevel, memberDataToUpdate.lvlExperience || memberData.lvlExperience, memberDataToUpdate.ecoBalance || memberData.ecoBalance, memberDataToUpdate.ecoInventory || memberData.ecoInventory, member.guild.id, member.id], err => {
			if (err) {
				Consolex.handleError(err);
			}

			if (callback) {
				callback();
			}

			sentryEvent.finish();
		});
	});
};
