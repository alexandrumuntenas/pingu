const {MessageEmbed} = require('discord.js');
const {codeBlock} = require('@discordjs/builders');

module.exports.status = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<:pingu_null:876103457860370442> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.loader = message => new MessageEmbed()
	.setColor('#FEE75C')
	.setDescription(`<a:loader:927223896330084412> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.success = message => new MessageEmbed()
	.setColor('#57F287')
	.setDescription(`<:Blurple_verified_plain:938094790132764682> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.error = message => new MessageEmbed()
	.setColor('#ED4245')
	.setDescription(`<:blurple_employee:939096196801257472> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.info = message => new MessageEmbed()
	.setColor('#5865F2')
	.setDescription(`:information_source: ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.image = (imageURL, imageProvider) => new MessageEmbed()
	.setColor('#2F3136')
	.setImage(imageURL)
	.setDescription(`<:blurple_image:892443053359517696> Image via ${imageProvider} API.`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.timer = message => new MessageEmbed()
	.setColor('#F3375C')
	.setImage('https://cdn.discordapp.com/attachments/908413370665938975/939097943036809247/hearties-daniel-lissing.gif')
	.setDescription(`<:timeout_clock:937404313901359114> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

/**
 * Generate a help message for a command
 * @param {Object} command - Object with information about the command.
 * @param {String} command.name - Command name.
 * @param {String} command.description - Command description.
 * @param {String} command.cooldown - Command cooldown.
 * @param {String} command.module - Command module.
 * @param {String} command.parameters - Command parameters.
 * @param {Array.<{name:string,description:string,parameters:string,isNSFW:boolean}>} command.subcommands - Command subcommands.
 * @returns {Array.<MessageEmbed>}
 */

module.exports.help = command => {
	if (!command) {
		throw new Error('No command provided');
	}

	const embedOptions = new MessageEmbed()
		.setColor('#5865F2')
		.setTitle(`${command.name} • Options`)
		.setDescription(`${command.description || 'No description'}\n\n<:timeout_clock:937404313901359114> Cooldown: ${command.cooldown || '10'}\n<:blurple_guide:937404928706617445> Module: ${command.module || 'No category'}\n${command.parameters ? codeBlock(`${command.name} ${command.parameters}`) : ''}`)
		.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
		.setTimestamp();

	if (command.subcommands) {
		const subcommands = command.subcommands.filter(subcommand => !subcommand.isNSFW);
		const subcommandsNSFW = command.subcommands.filter(subcommand => subcommand.isNSFW);

		if (subcommands) {
			subcommands.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `<:blurple_bot:938094998283501569> Syntax:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true));
		}

		if (subcommandsNSFW) {
			subcommandsNSFW.forEach(subcommand => embedOptions.addField(`${subcommand.name}`, `${subcommand.description ? subcommand.description : 'No description'}\n\n${subcommand.parameters ? `:underage: Syntax:\n${codeBlock(`${subcommand.name} ${subcommand.parameters}`)}` : ''}`, true));
		}
	}

	return [embedOptions];
};
