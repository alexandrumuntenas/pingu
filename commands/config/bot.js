const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed} = require('discord.js');
const i18n = require('../../i18n/i18n');
const {deployGuildInteractions, updateGuildConfigNext} = require('../../functions/guildDataManager');
const {success, error} = require('../../functions/defaultMessages');
const Consolex = require('../../functions/consolex');

module.exports = {
	name: 'bot',
	description: '🤖 Manage the bot configuration of your server',
	cooldown: 5,
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	isConfigurationCommand: false,
	interactionData: new SlashCommandBuilder()
		.addSubcommandGroup(scg => scg
			.setName('modules')
			.setDescription('📦 Manage the modules of your server')
			.addSubcommand(sc => sc.setName('enable')
				.setDescription('Enable a module.')
				.addStringOption(input => input.setName('module')
					.setRequired(true).setDescription('The name of the module.')
					.addChoice('customcommands', 'customcommands')
					.addChoice('farewell', 'farewell')
					.addChoice('leveling', 'leveling')
					.addChoice('welcome', 'welcome')
					.addChoice('suggestions', 'suggestions'),
				))
			.addSubcommand(sc => sc.setName('disable')
				.setDescription('Disable a module.')
				.addStringOption(input => input.setName('module')
					.setRequired(true).setDescription('The name of the module.')
					.addChoice('customcommands', 'customcommands')
					.addChoice('farewell', 'farewell')
					.addChoice('leveling', 'leveling')
					.addChoice('welcome', 'welcome')
					.addChoice('suggestions', 'suggestions'),
				))
			.addSubcommand(sc => sc.setName('viewconfig').setDescription('View the status of the modules of your server.')),
		)
		.addSubcommand(sc => sc.setName('setprefix').setDescription('Set the prefix of your server.').addStringOption(input => input.setName('newprefix').setDescription('The new prefix of the bot.').setRequired(true)))
		.addSubcommand(sc => sc.setName('setlanguage').setDescription('Set the language of your server.')
			.addStringOption(input => input.setName('language').setDescription('The new language of the bot.').setRequired(true)
				.addChoice('English', 'en')
				.addChoice('Español', 'es')
				.addChoice('Français (Not avaliable)', 'es')
				.addChoice('Italiano (Not avaliable)', 'es')
				.addChoice('Deutsch (Not avaliable)', 'es')
				.addChoice('Português (Not avaliable)', 'es')
				.addChoice('Nederlands (Not avaliable)', 'es')
				.addChoice('Română (Not avaliable)', 'es')),
		)
		.addSubcommandGroup(scg => scg
			.setName('interactions')
			.setDescription('💬 Manage the interactions of your server')
			.addSubcommand(sc => sc.setName('update').setDescription('Update the interactions of your server.').addBooleanOption(input => input.setName('configinteractions').setDescription('Deploy the configuration interactions?')))),
	runInteraction(locale, interaction) {
		switch (interaction.options.getSubcommand()) {
			case 'setprefix': {
				updateGuildConfigNext(interaction.guild, {column: 'common', newconfig: {prefix: interaction.options.getString('newprefix')}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'BOT::SETPREFIX:ERROR'))]});
					}

					try {
						interaction.guild.members.cache.get(process.Client.user.id).setNickname(`[${interaction.options.getString('newprefix')}] ${process.Client.user.username}`);
					} catch (err) {
						Consolex.handleError(err);
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'BOT::SETPREFIX:SUCCESS', {PREFIX: interaction.options.getString('newprefix')}))]});
				});
				break;
			}

			case 'setlanguage': {
				updateGuildConfigNext(interaction.guild, {column: 'common', newconfig: {language: interaction.options.getString('language')}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'BOT::SETLANGUAGE:ERROR'))]});
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'BOT::SETLANGUAGE:SUCCESS', {LANGUAGE: interaction.options.getString('language')}))]});
				});
				break;
			}

			case 'viewconfig': {
				const botConfigEmbed = new MessageEmbed()
					.setColor('#2F3136')
					.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
					.setTimestamp()
					.setTitle(i18n(locale, 'BOT::MODULES:VIEWCONFIG:TITLE'))
					.setDescription(i18n(locale, 'BOT::MODULES:VIEWCONFIG:DESCRIPTION'))
					.addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:CUSTOMCOMMANDS'), interaction.guild.configuration.customcommands.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
					.addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:FAREWELL'), interaction.guild.configuration.farewell.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
					.addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:LEVELING'), interaction.guild.configuration.leveling.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
					.addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:SUGGESTIONS'), interaction.guild.configuration.suggestions.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
					.addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), interaction.guild.configuration.welcome.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true);

				interaction.editReply({embeds: [botConfigEmbed]});
				break;
			}

			case 'update': {
				try {
					deployGuildInteractions(interaction.guild, interaction.options.getBoolean('configinteractions') || true, err => {
						if (err) {
							interaction.editReply({embeds: [error(i18n(locale, 'UPDATE::ERROR'))]});
							throw err;
						}

						return interaction.editReply({embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))]});
					});
				} catch (err) {
					Consolex.handleError(err);
				}

				break;
			}

			case 'enable': {
				const moduleToEnable = interaction.options.getString('module');

				updateGuildConfigNext(interaction.guild, {column: moduleToEnable, newconfig: {enabled: true}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'BOT::MODULES:ENABLE:ERROR', {MODULE: moduleToEnable}))]});
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'BOT::MODULES:ENABLE:SUCCESS', {MODULE: moduleToEnable}))]});
				});

				break;
			}

			case 'disable': {
				const moduleToDisable = interaction.options.getString('module');

				updateGuildConfigNext(interaction.guild, {column: moduleToDisable, newconfig: {enabled: false}}, err => {
					if (err) {
						return interaction.editReply({embeds: [error(i18n(locale, 'BOT::MODULES:DISABLE:ERROR', {MODULE: moduleToDisable}))]});
					}

					return interaction.editReply({embeds: [success(i18n(locale, 'BOT::MODULES:DISABLE:SUCCESS', {MODULE: moduleToDisable}))]});
				});

				break;
			}

			default: {
				break;
			}
		}
	},
};
