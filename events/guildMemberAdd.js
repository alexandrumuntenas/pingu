const welcome = require('../modules/welcome');

module.exports = {
	name: 'guildMemberAdd',
	execute: async (Client, member) => {
		welcome.doGuildMemberAdd(member);
	},
};
