const Consolex = require('./consolex');

const Statcord = require('statcord.js');
const dbots = require('dbots');

module.exports = async () => {
	const apiKeys = {};
	if (process.env.BOTLIST_API_TOPGG) {
		apiKeys.topgg = process.env.BOTLIST_API_TOPGG;
	}

	const poster = new dbots.Poster({
		Client: process.Client,
		apiKeys,
		ClientLibrary: 'discord.js',
	});

	poster.startInterval();

	if (process.env.STATCORD_API_KEY) {
		process.Client.statcord = new Statcord.Client({
			Client: process.Client,
			key: process.env.STATCORD_API_KEY,
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: true,
		});

		process.Client.statcord.on('autopost-start', () => {
			Consolex.info('Publicando estadísticas en Statcord...');
		});

		process.Client.statcord.on('post', status => {
			if (status) {
				Consolex.error(status);
			} else {
				Consolex.success('Estadísticas publicadas en Statcord');
			}
		});
	}
};
