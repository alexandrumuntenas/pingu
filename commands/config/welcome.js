/* eslint-disable max-depth */
/* eslint-disable complexity */

const {Permissions, MessageEmbed, MessageAttachment} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');
const {updateGuildConfigNext} = require('../../functions/guildDataManager');
const {error, success, help} = require('../../functions/defaultMessages');
const i18n = require('../../i18n/i18n');
const Consolex = require('../../functions/consolex');
const {generateWelcomeCard, addJoinRole, removeJoinRole} = require('../../modules/welcome');

module.exports = {
	name: 'welcome',
	description: '⚙️ Configure the welcome module',
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	cooldown: 1,
	isConfigurationCommand: true,
	interactionData: new SlashCommandBuilder()
		.addSubcommand(sc => sc.setName('setchannel').setDescription('Set the welcome channel.').addChannelOption(input => input.setName('channel').setDescription('Set the welcome channel.').setRequired(true)))
		.addSubcommand(sc => sc.setName('setmessage').setDescription('Set the welcome message.').addStringOption(input => input.setName('message').setDescription('Set the welcome message. Avaliable placeholders: {}').setRequired(true)))
		.addSubcommand(sc => sc.setName('configurecards').setDescription('Configure the welcome card.')
			.addBooleanOption(input => input.setName('sendcards').setDescription('Send welcome card along with the welcome message.'))
			.addStringOption(input => input.setName('backgroundurl').setDescription('Set the background image url.'))
			.addNumberOption(input => input.setName('overlayopacity').setDescription('Set the overlay opacity.'))
			.addStringOption(input => input.setName('overlaycolor').setDescription('Set the overlay color.'))
			.addStringOption(input => input.setName('title').setDescription('Set the title. (The text in white).'))
			.addStringOption(input => input.setName('subtitle').setDescription('Set the subtitle. (The text darker and smaller than the title).')))
		.addSubcommandGroup(scg => scg.setName('configureroles').setDescription('Configure the roles that will be given to the new member.')
			.addSubcommand(sc => sc.setName('list').setDescription('List the roles that are granted when someone joins the guild.'))
			.addSubcommand(sc => sc.setName('give').setDescription('Add a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Add a role to grant when someone joins the guild.').setRequired(true)))
			.addSubcommand(sc => sc.setName('remove').setDescription('Remove a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Remove a role to grant when someone joins the guild.').setRequired(true)))),
	runInteraction(locale, interaction) {
		switch (interaction.options.getSubcommand()) {
			case 'setchannel': {
				updateGuildConfigNext(interaction.guild, {column: 'welcome', newconfig: {channel: interaction.options.getChannel('channel').id}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::SETCHANNEL:ERROR'))]});
					}

					return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::SETCHANNEL:SUCCESS', {CHANNEL: interaction.options.getChannel('channel')}))]});
				});
				break;
			}

			case 'setmessage': {
				updateGuildConfigNext(interaction.guild, {column: 'welcome', newconfig: {message: interaction.options.getString('message')}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::SETMESSAGE:ERROR'))]});
					}

					return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::SETMESSAGE:SUCCESS', {MESSAGE: interaction.options.getString('message')}))]});
				});
				break;
			}

			case 'configurecards': {
				const sendcards = interaction.options.getBoolean('sendcards');
				const backgroundurl = interaction.options.getString('backgroundurl');
				const overlayopacity = interaction.options.getNumber('overlayopacity');
				const overlaycolor = interaction.options.getString('overlaycolor');
				const title = interaction.options.getString('title');
				const subtitle = interaction.options.getString('subtitle');
				const newconfig = {welcomecard: {}};

				if (sendcards || backgroundurl || overlayopacity || overlaycolor || title || subtitle) {
					const modifiedconfig = new MessageEmbed()
						.setColor('#2F3136')
						.setTitle(i18n(locale, 'WELCOME::CONFIGURECARDS:TITLE'))
						.setDescription(`${i18n(locale, 'WELCOME::CONFIGURECARDS:CHANGES')}`)
						.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
						.setTimestamp();

					if (sendcards) {
						modifiedconfig.addField(`:incoming_envelope: ${i18n(locale, 'SENDCARDS')}`, sendcards ? `✅ ${i18n(locale, 'ENABLED')}` : `❌ ${i18n(locale, 'DISABLED')}`, true);
						newconfig.welcomecard.enabled = sendcards;
					}

					if (backgroundurl) {
						modifiedconfig.addField(`:frame_photo: ${i18n(locale, 'BACKGROUND')}`, backgroundurl ? `[<:blurple_link:892441999993618532> ${i18n(locale, 'VIEWLINK')}](${backgroundurl})` : `❌ ${i18n(locale, 'NOTSET')}`, true);
						newconfig.welcomecard.background = backgroundurl;
					}

					if (overlayopacity) {
						modifiedconfig.addField(`:flashlight: ${i18n(locale, 'OVERLAYOPACITY')}`, overlayopacity ? `${overlayopacity}%` : `❌ ${i18n(locale, 'NOTSET')}`, true);
						newconfig.welcomecard.overlay.opacity = overlayopacity;
						if (newconfig.welcomecard.overlay) {
							newconfig.welcomecard.overlay.opacity = overlayopacity;
						} else {
							newconfig.welcomecard.overlay = {opacity: overlayopacity};
						}
					}

					if (overlaycolor) {
						modifiedconfig.addField(`:art: ${i18n(locale, 'OVERLAYCOLOR')}`, overlaycolor ? overlaycolor : `❌ ${i18n(locale, 'NOTSET')}`, true);
						if (newconfig.welcomecard.overlay) {
							newconfig.welcomecard.overlay.color = overlaycolor;
						} else {
							newconfig.welcomecard.overlay = {color: overlaycolor};
						}
					}

					if (title) {
						modifiedconfig.addField(`:writing_hand: ${i18n(locale, 'TITLE')}`, title ? title : `❌ ${i18n(locale, 'NOTSET')}`, true);
						newconfig.welcomecard.title = title;
					}

					if (subtitle) {
						modifiedconfig.addField(`:writing_hand: ${i18n(locale, 'SUBTITLE')}`, subtitle ? subtitle : `❌ ${i18n(locale, 'NOTSET')}`, true);
						newconfig.welcomecard.subtitle = subtitle;
					}

					updateGuildConfigNext(interaction.guild, {column: 'welcome', newconfig}, err => {
						if (err) {
							Consolex.handleError(err);
							return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:ERROR'))]});
						}

						return interaction.editReply({embeds: [modifiedconfig]});
					});
				} else {
					generateWelcomeCard(interaction.member, path => {
						const welcomecard = new MessageAttachment(path, 'welcomecard.png');
						const actualconfig = new MessageEmbed()
							.setColor('#2F3136')
							.setTitle(i18n(locale, 'WELCOME::CONFIGURECARDS:TITLE'))
							.setDescription(`${i18n(locale, 'WELCOME::CONFIGURECARDS:NOCHANGES')} ${i18n(locale, 'WELCOME::CONFIGURECARDS:ACTUALCONFIG')}`)
							.addField(`:incoming_envelope: ${i18n(locale, 'SENDCARDS')}`, interaction.guild.configuration.welcome.welcomecard.enabled ? `✅ ${i18n(locale, 'ENABLED')}` : `❌ ${i18n(locale, 'DISABLED')}`, true)
							.addField(`:frame_photo: ${i18n(locale, 'BACKGROUND')}`, interaction.guild.configuration.welcome.welcomecard.background ? `[<:blurple_link:892441999993618532> ${i18n(locale, 'VIEWLINK')}](${interaction.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(locale, 'NOTSET')}`, true)
							.addField(`:flashlight: ${i18n(locale, 'OVERLAYOPACITY')}`, interaction.guild.configuration.welcome.welcomecard.overlay.opacity ? `${interaction.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(locale, 'NOTSET')}`, true)
							.addField(`:art: ${i18n(locale, 'OVERLAYCOLOR')}`, interaction.guild.configuration.welcome.welcomecard.overlay.color || `❌ ${i18n(locale, 'NOTSET')}`, true)
							.addField(`:writing_hand: ${i18n(locale, 'TITLE')}`, interaction.guild.configuration.welcome.welcomecard.title || `❌ ${i18n(locale, 'NOTSET')}`, true)
							.addField(`:writing_hand: ${i18n(locale, 'SUBTITLE')}`, interaction.guild.configuration.welcome.welcomecard.subtitle || `❌ ${i18n(locale, 'NOTSET')}`, true)
							.setImage('attachment://welcomecard.png')
							.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
							.setTimestamp();
						return interaction.editReply({embeds: [actualconfig], files: [welcomecard]});
					});
				}

				break;
			}

			case 'give': {
				addJoinRole(interaction.guild, interaction.options.getRole('role'), err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::GIVEROLE:ERROR'))]});
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'WELCOME::GIVEROLE:SUCCESS', {ROLE: interaction.options.getRole('role')}))]});
				});
				break;
			}

			case 'remove': {
				removeJoinRole(interaction.guild, interaction.options.getRole('role'), err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'WELCOME::REMOVEROLE:ERROR'))]});
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'WELCOME::REMOVEROLE:SUCCESS', {ROLE: interaction.options.getRole('role')}))]});
				});
				break;
			}

			case 'list': {
				let {roles} = interaction.guild.configuration.welcome;
				roles = roles || [];
				roles = roles.map(role => `<@&${role}>`).join(', ');
				interaction.editReply({embeds: [new MessageEmbed().setColor('#2F3136').setTitle(i18n(locale, 'WELCOME::LISTROLES:TITLE')).setDescription(roles || i18n(locale, 'NOSET')).setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()}).setTimestamp()]});
				break;
			}

			default: {
				break;
			}
		}
	},
	runCommand(locale, message) {
		function viewConfigFallback() {
			generateWelcomeCard(message.member, path => {
				const welcomecard = new MessageAttachment(path, 'welcomecard.png');
				const welcomeBasicConfig = new MessageEmbed()
					.setColor('#2F3136')
					.setTitle(i18n(locale, 'WELCOME::VIEWCONFIG:TITLE'))
					.setDescription(i18n(locale, 'WELCOME::VIEWCONFIG:DESCRIPTION'))
					.addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'WELCOME::VIEWCONFIG:CHANNEL')}`, `<#${message.guild.configuration.welcome.channel}>` || `❌ ${i18n(locale, 'NOTSET')}`, false)
					.addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(locale, 'WELCOME::VIEWCONFIG:MESSAGE')}`, message.guild.configuration.welcome.message || `❌ ${i18n(locale, 'NOTSET')}`, false)
					.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
					.setTimestamp();
				const welcomeCards = new MessageEmbed()
					.setColor('#2F3136')
					.setTitle(i18n(locale, 'WELCOME::CONFIGURECARDS:TITLE'))
					.setDescription(`${i18n(locale, 'WELCOME::CONFIGURECARDS:ACTUALCONFIG')}`)
					.addField(`:incoming_envelope: ${i18n(locale, 'SENDCARDS')}`, message.guild.configuration.welcome.welcomecard.enabled ? `✅ ${i18n(locale, 'ENABLED')}` : `❌ ${i18n(locale, 'DISABLED')}`, true)
					.addField(`:frame_photo: ${i18n(locale, 'BACKGROUND')}`, message.guild.configuration.welcome.welcomecard.background ? `[<:blurple_link:892441999993618532> ${i18n(locale, 'VIEWLINK')}](${message.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(locale, 'NOTSET')}`, true)
					.addField(`:flashlight: ${i18n(locale, 'OVERLAYOPACITY')}`, message.guild.configuration.welcome.welcomecard.overlay.opacity ? `${message.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(locale, 'NOTSET')}`, true)
					.addField(`:art: ${i18n(locale, 'OVERLAYCOLOR')}`, message.guild.configuration.welcome.welcomecard.overlay.color || `❌ ${i18n(locale, 'NOTSET')}`, true)
					.addField(`:writing_hand: ${i18n(locale, 'TITLE')}`, message.guild.configuration.welcome.welcomecard.title || `❌ ${i18n(locale, 'NOTSET')}`, true)
					.addField(`:writing_hand: ${i18n(locale, 'SUBTITLE')}`, message.guild.configuration.welcome.welcomecard.subtitle || `❌ ${i18n(locale, 'NOTSET')}`, true)
					.setImage('attachment://welcomecard.png')
					.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
					.setTimestamp();

				let {roles} = message.guild.configuration.welcome;
				roles = roles || [];
				roles = roles.map(role => `<@&${role}>`).join(', ');

				const welcomeRoles = 	new MessageEmbed()
					.setColor('#2F3136')
					.setTitle(i18n(locale, 'WELCOME::LISTROLES:TITLE'))
					.setDescription(roles || i18n(locale, 'NOSET'))
					.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
					.setTimestamp();

				return message.reply({embeds: [welcomeBasicConfig, welcomeCards, welcomeRoles], files: [welcomecard]});
			});
		}

		function sendHelp() {
			message.reply({
				embeds: help({
					name: 'welcome',
					cooldown: '1',
					module: 'welcome',
					description: i18n(locale, 'WELCOME::HELP:DESCRIPTION'),
					subcommands: [
						{name: 'viewconfig', description: i18n(locale, 'WELCOME::HELP:VIEWCONFIG:DESCRIPTION')},
						{name: 'setchannel', description: i18n(locale, 'WELCOME::HELP:SETCHANNEL:DESCRIPTION'), parameters: '<#channel>'},
						{name: 'setmessage', description: i18n(locale, 'WELCOME::HELP:SETMESSAGE:DESCRIPTION'), parameters: '<message>'},
						{name: 'configurecards viewconfig', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:VIEWCONFIG:DESCRIPTION')},
						{name: 'configurecards sendcards', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:SENDCARDS:DESCRIPTION'), parameters: '<true/false>'},
						{name: 'configurecards backgroundurl', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:BACKGROUNDURL:DESCRIPTION'), parameters: '<url>'},
						{name: 'configurecards overlaycolor', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:OVERLAYCOLOR:DESCRIPTION'), parameters: '<hex color>'},
						{name: 'configurecards overlayopacity', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:OVERLAYOPACITY:DESCRIPTION'), parameters: '<0-100>'},
						{name: 'configurecards title', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:TITLE:DESCRIPTION'), parameters: '<text>'},
						{name: 'configurecards subtitle', description: i18n(locale, 'WELCOME::HELP:CONFIGURECARDS:SUBTITLE:DESCRIPTION'), parameters: '<text>'},
						{name: 'configureroles', description: i18n(locale, 'WELCOME::HELP:CONFIGUREROLE:DESCRIPTION')},
						{name: 'configureroles give', description: i18n(locale, 'WELCOME::HELP:CONFIGUREROLE:GIVE:DESCRIPTION'), parameters: '<role>'},
						{name: 'configureroles remove', description: i18n(locale, 'WELCOME::HELP:CONFIGUREROLE:REMOVE:DESCRIPTION'), parameters: '<role>'},
					],
				}),
			});
		}

		if (Object.prototype.hasOwnProperty.call(message.parameters, 0)) {
			switch (message.parameters[0].toLowerCase()) {
				case 'viewconfig': {
					viewConfigFallback();
					break;
				}

				case 'setchannel': {
					if (message.mentions.channel.first()) {
						updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {channel: message.mentions.channel.first().id}}, err => {
							if (err) {
								return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::SETCHANNEL:ERROR'))]});
							}

							return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::SETCHANNEL:SUCCESS', {CHANNEL: message.mentions.channel.first()}))]});
						});
					}

					break;
				}

				case 'setmessage': {
					if (Object.prototype.hasOwnProperty.call(message.parameters, 1)) {
						updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {message: message.parameters.slice(1).join(' ')}}, err => {
							if (err) {
								return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::SETMESSAGE:ERROR'))]});
							}

							return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::SETMESSAGE:SUCCESS', {MESSAGE: message.parameters.slice(1).join(' ')}))]});
						});
					} else {
						sendHelp();
					}

					break;
				}

				case 'configurecards': {
					if (Object.prototype.hasOwnProperty.call(message.parameters, 2)) {
						switch (message.parameters[1].toLowerCase()) {
							case 'sendcards': {
								if (message.parameters[2] === true) {
									updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {enabled: true}}}, err => {
										if (err) {
											return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:SENDCARDS:ERROR'))]});
										}

										return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:SENDCARDS:SUCCESS:ENABLED'))]});
									});
								} else if (message.parameters[2] === false) {
									updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {enabled: false}}}, err => {
										if (err) {
											return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:SENDCARDS:ERROR'))]});
										}

										return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:SENDCARDS:SUCCESS:DISABLED'))]});
									});
								}

								break;
							}

							case 'backgroundurl': {
								updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {background: message.parameters.slice(2).join(' ')}}}, err => {
									if (err) {
										return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:BACKGROUNDURL:ERROR'))]});
									}

									return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:BACKGROUNDURL:SUCCESS', {BACKGROUND: message.parameters.slice(2).join(' ')}))]});
								});
								break;
							}

							case 'overlayopacity': {
								if (parseInt(message.parameters[2], 10) <= 0) {
									message.parameters[2] = '0';
								} else if (parseInt(message.parameters[2], 10) >= 100) {
									message.parameters[2] = '100';
								} else {
									message.parameters[2] = '50';
								}

								updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {overlay: {opacity: parseInt(message.parameters[2], 10)}}}}, err => {
									if (err) {
										return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:OVERLAYOPACITY:ERROR'))]});
									}

									return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:OVERLAYOPACITY:SUCCESS', {OPACITY: message.parameters[2]}))]});
								});
								break;
							}

							case 'overlaycolor': {
								const regex = /^#([0-9a-f]{3}){1,2}$/i;

								if (regex.test(message.parameters[2])) {
									updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {overlay: {color: message.parameters[2]}}}}, err => {
										if (err) {
											return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:OVERLAYCOLOR:ERROR'))]});
										}

										return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:OVERLAYCOLOR:SUCCESS', {COLOR: message.parameters[2]}))]});
									});
								}

								break;
							}

							case 'title': {
								updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {title: message.parameters.slice(2).join(' ')}}}, err => {
									if (err) {
										return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:TITLE:ERROR'))]});
									}

									return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:TITLE:SUCCESS', {TITLE: message.parameters.slice(2).join(' ')}))]});
								});
								break;
							}

							case 'subtitle': {
								updateGuildConfigNext(message.guild, {column: 'welcome', newconfig: {welcomecard: {subtitle: message.parameters.slice(2).join(' ')}}}, err => {
									if (err) {
										return message.channel.send({embeds: [error(i18n(locale, 'WELCOME::CONFIGURECARDS:SUBTITLE:ERROR'))]});
									}

									return message.channel.send({embeds: [success(i18n(locale, 'WELCOME::CONFIGURECARDS:SUBTITLE:SUCCESS', {SUBTITLE: message.parameters.slice(2).join(' ')}))]});
								});
								break;
							}

							default: {
								viewConfigFallback();
								break;
							}
						}
					} else {
						viewConfigFallback();
					}

					break;
				}

				case 'configureroles': {
					if (Object.prototype.hasOwnProperty.call(message.parameters, 1)) {
						switch (message.parameters[1].toLowerCase()) {
							case 'give': {
								if (message.mentions.roles.first()) {
									addJoinRole(message.guild, message.mentions.roles.first(), err => {
										if (err) {
											return message.reply({embeds: [error(i18n(locale, 'WELCOME::GIVEROLE:ERROR'))]});
										}

										return message.reply({embeds: [success(i18n(locale, 'WELCOME::GIVEROLE:SUCCESS', {ROLE: message.mentions.roles.first()}))]});
									});
									break;
								} else {
									viewConfigFallback();
								}

								break;
							}

							case 'remove': {
								if (message.mentions.roles.first()) {
									removeJoinRole(message.guild, message.mentions.roles.first(), err => {
										if (err) {
											return message.reply({embeds: [error(i18n(locale, 'WELCOME::REMOVEROLE:ERROR'))]});
										}

										return message.reply({embeds: [success(i18n(locale, 'WELCOME::REMOVEROLE:SUCCESS', {ROLE: message.mentions.roles.first()}))]});
									});
								} else {
									viewConfigFallback();
								}

								break;
							}

							default: {
								sendHelp();
								break;
							}
						}
					} else {
						viewConfigFallback();
					}

					break;
				}

				default: {
					sendHelp();
					break;
				}
			}
		} else {
			sendHelp();
		}
	},
};
