const Consolex = require('../functions/consolex');
const farewell = require('../modules/farewell.js');

module.exports = {
	name: 'guildMemberRemove',
	execute: async (Client, member) => {
		const gMR = Consolex.Sentry.startTransaction({
			op: 'guildMemberRemove',
			name: 'Guild Member Remove',
		});

		//! THIS HAS TO BE MOVED TO GUILDDATAMANAGER
		if (member.user.id !== Client.user.id) {
			farewell.doGuildMemberRemove(member);
			Client.Database.query('DELETE FROM `memberData` WHERE member = ? AND guild = ?', [member.user.id, member.guild.id]); // Mover esto a memberManager
		}

		gMR.finish();
	},
};
