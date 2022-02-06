const Consolex = require('../functions/consolex');
const {REST} = require('@discordjs/rest');
const eliminadorArchivosTemporales = require('../functions/eliminadorArchivosTemporales');

const rest = new REST({version: '9'});
if (process.env.ENTORNO === 'desarrollo') {
	rest.setToken(process.env.INSIDER_TOKEN);
} else {
	rest.setToken(process.env.PUBLIC_TOKEN);
}

module.exports = {
	name: 'ready',
	execute: () => {
		Consolex.info(`Conectado como ${process.Client.user.tag}!`);
		if (process.Client.statcord) {
			process.Client.statcord.autopost();
		}

		eliminadorArchivosTemporales();
		setInterval(() => {
			eliminadorArchivosTemporales();
		}, 600000);
	},
};
