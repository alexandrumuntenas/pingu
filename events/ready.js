const Consolex = require('../functions/consolex');
const {REST} = require('@discordjs/rest');

const rest = new REST({version: '9'});
if (process.env.ENTORNO === 'desarrollo') {
	rest.setToken(process.env.INSIDER_TOKEN);
} else {
	rest.setToken(process.env.PUBLIC_TOKEN);
}

module.exports = {
	name: 'ready',
	execute: Client => {
		Consolex.info(`Conectado como ${Client.user.tag}!`);
		if (Client.statcord) {
			Client.statcord.autopost();
		}
	},
};
