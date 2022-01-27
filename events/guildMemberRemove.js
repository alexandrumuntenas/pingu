const farewell = require('../modules/farewell.js');

module.exports = {
	name: 'guildMemberRemove',
	execute: async (client, member) => {
		const gMR = client.console.sentry.startTransaction({
			op: 'guildMemberRemove',
			name: 'Guild Member Remove',
		});

		//! THIS HAS TO BE MOVED TO GUILDDATAMANAGER
		if (member.user.id !== client.user.id) {
			farewell.doGuildMemberRemove(member);
			client.pool.query('DELETE FROM `memberData` WHERE member = ? AND guild = ?', [member.user.id, member.guild.id]); // Mover esto a memberManager
		}

		gMR.finish();
	},
};
