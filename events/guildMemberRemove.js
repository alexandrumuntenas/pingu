const Consolex = require('../functions/consolex');
const {deleteMember} = require('../functions/memberManager');
const farewell = require('../modules/farewell.js');

module.exports = {
	name: 'guildMemberRemove',
	execute: async member => {
		const gMR = Consolex.Sentry.startTransaction({
			op: 'guildMemberRemove',
			name: 'Guild Member Remove',
		});

		if (member.user.id !== process.Client.user.id) {
			farewell.doGuildMemberRemove(member);
			deleteMember(member);
		}

		gMR.finish();
	},
};
