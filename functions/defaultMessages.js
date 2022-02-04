const {MessageEmbed} = require('discord.js');
const {codeBlock} = require('@discordjs/builders');

module.exports.status = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<:pingu_null:876103457860370442> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.loader = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<a:loader:927223896330084412> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.success = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<:pingu_on:876103503561502730> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.error = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<:pingu_null:876103457860370442> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.info = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`:information_source: ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.image = (imageURL, imageProvider) => new MessageEmbed()
	.setImage(imageURL)
	.setDescription(`:frame_photo: Image via ${imageProvider} API.`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

module.exports.timer = message => new MessageEmbed()
	.setColor('#2F3136')
	.setDescription(`<:wait:928374551182721044> ${message}`)
	.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
	.setTimestamp();

/**
 * Generate a help message for a command
 * @param {Object} command - Object with information about the command.
 * @param {String} command.name - Command name.
 * @param {String} command.description - Command description.
 * @param {String} command.cooldown - Command cooldown.
 * @param {String} command.module - Command module.
 * @param {Array.<{name:string,description:string,parameters:string,isNSFW:boolean}>} command.subcommands - Command subcommands.
 */

module.exports.help = command => {
	if (!command) {
		throw new Error('No command provided');
	}

	const embedOptions = new MessageEmbed()
		.setColor('#2F3136')
		.setTitle(`${command.name} • Options`)
		.setDescription(`${command.description || 'No description'}\n\n<:timeout_clock:937404313901359114> Cooldown: ${command.cooldown || '10'}\n<:blurple_guide:937404928706617445> Module: ${command.module || 'No category'}`)
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
