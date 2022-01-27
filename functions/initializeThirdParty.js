const Statcord = require('statcord.js');
const dbots = require('dbots');

module.exports = async client => {
	const apiKeys = {};
	if (process.env.BOTLIST_API_TOPGG) {
		apiKeys.topgg = process.env.BOTLIST_API_TOPGG;
	}

	const poster = new dbots.Poster({
		client,
		apiKeys,
		clientLibrary: 'discord.js',
	});

	poster.startInterval();

	if (process.env.STATCORD_API_KEY) {
		client.statcord = new Statcord.Client({
			client,
			key: process.env.STATCORD_API_KEY,
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: true,
		});

		client.statcord.on('autopost-start', () => {
			client.console.info('Publicando estadísticas en Statcord...');
		});

		client.statcord.on('post', status => {
			if (status) {
				client.console.error(status);
			} else {
				client.console.success('Estadísticas publicadas en Statcord');
			}
		});
	}
};
