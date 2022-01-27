const Client = require('../Client');
const Consolex = require('../functions/consolex');

module.exports = {
	name: 'guildDelete',
	execute: async (Client, guild) => {
		const gD = Consolex.Sentry.startTransaction({
			op: 'guildDelete',
			name: 'Guild Delete',
		});

		//! THIS HAS TO BE MOVED TO GUILDDATAMANAGER
		const databaseTables = ['guildData', 'guildAutoResponder', 'guildEconomyProducts', 'guildJoinRoles', 'guildJoinRoles', 'memberData', 'guildLevelsRankupRoles', 'guildReactionRoles'];
		databaseTables.forEach(table => {
			Client.Database.query(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], err => {
				if (err) {
					Consolex.handleError(err);
				}
			});
		});
		gD.finish();
	},
};
