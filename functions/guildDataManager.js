/** @module GuildDataManager */

const client = require('../../client');

/**
 * Get the guild's configuration from the database.
 * @deprecated since 2202. Use next() instead.
 * @param {Guild} guild - The guild
 * @param {Function} callback - The callback function
 * @returns Object - The guild configuration
 */

module.exports.getGuildConfig = (guild, callback) => {
	const gFD = client.console.sentry.startTransaction({
		op: 'getGuildConfig',
		name: 'Get Guild Configuration',
	});
	client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
		if (err) {
			client.logError(err);
		}

		if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
			callback(result[0]);
		} else {
			const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0) || 0;
			client.pool.query('INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)', [guild.id, chx.id, chx.id, chx.id], err => {
				if (err) {
					client.logError(err);
					client.console.error(err);
				}

				gFD.finish();
				module.exports(guild, callback);
			});
		}
	});
};

/**
 * Get the guild's configuration from the database.
 * @param {Guild} guild - The guild
 * @param {Function} callback - The callback function
 * @returns Object - The guild configuration
 */

module.exports.getGuildConfigNext = (guild, callback) => {
	const gFD = client.console.sentry.startTransaction({
		op: 'getGuildConfig',
		name: 'Get Guild Configuration',
	});
	client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
		if (err) {
			client.logError(err);
		}

		if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
			if (result[0].clientVersion === 'pingu@1.0.0') {
				module.exports.migrateGuildData(guild, () => {
					module.exports.getGuildConfigNext(guild, callback);
				});
			} else {
				Object.keys(result[0]).forEach(module => {
					try {
						result[0][module] = JSON.parse(result[0][module]);
					} catch (err) {
						if (err) {
							return err;
						}
					}
				});
				callback(result[0]);
			}
		} else {
			const chx = guild.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0) || 0;
			client.pool.query('INSERT INTO `guildData` (`guild`, `welcomeChannel`, `farewellChannel`, `levelsChannel`) VALUES (?, ?, ?, ?)', [guild.id, chx.id, chx.id, chx.id], err => {
				if (err) {
					client.logError(err);
					client.console.error(err);
				}

				gFD.finish();
				module.exports(guild, callback);
			});
		}
	});
};

/**
 * @deprecated Use next() instead
 * Update a guild's configuration.
 * @param {Guild} guild - The Guild
 * @param {Object} configuration - The configuration to update
 * @param {String} configuration.column - The configuration column to update
 * @param {String} configuration.value - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfig = (guild, configuration, callback) => {
	const uGC = client.console.sentry.startTransaction({
		op: 'updateGuildConfig',
		name: 'Update Guild Config',
	});
	if (typeof configuration === 'object' && !Array.isArray(configuration) && configuration !== null) {
		client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [configuration.column, configuration.value, guild.id], err => {
			uGC.finish();
			if (err) {
				client.logError(err);
			}

			if (err) {
				return callback(err);
			}

			if (callback) {
				return callback();
			}
		});
	} else {
		throw new Error('Configuration parameter must be an Object with the following properties: column (column to update) and value (new value).');
	}
};

/**
 * Update a guild's configuration.

 * @param {Guild} guild - The Guild
 * @param {Object} botmodule - The module to update
 * @param {String} botmodule.column - The module configuration column to update
 * @param {JSON} botmodule.newconfig - The new configuration value
 * @param {Function} callback - The callback function
 */

module.exports.updateGuildConfigNext = (guild, botmodule, callback) => {
	module.exports.getGuildConfigNext(guild, guildConfig => {
		if (Object.prototype.hasOwnProperty.call(guildConfig, botmodule.column)) {
			if (typeof guildConfig[botmodule.column] === 'object' && !Array.isArray(guildConfig[botmodule.column]) && guildConfig[botmodule.column] !== null) {
				procesarObjetosdeConfiguracion(guildConfig[botmodule.column], botmodule.newconfig, newModuleConfig => {
					guildConfig[botmodule.column] = newModuleConfig;
					client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(guildConfig[botmodule.column]), guild.id], err => {
						if (err) {
							client.logError(err);
						}

						if (err) {
							return callback(err);
						}

						if (callback) {
							return callback();
						}

						return null;
					});
				});
			} else if (typeof botmodule.newconfig === 'object' && botmodule.newconfig !== null) {
				client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id], err => {
					if (err) {
						client.logError(err);
					}

					if (err) {
						return callback(err);
					}

					if (callback) {
						return callback();
					}

					return null;
				});
			} else {
				client.pool.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id], err => {
					if (err) {
						client.logError(err);
					}

					if (err) {
						return callback(err);
					}

					if (callback) {
						return callback();
					}

					return null;
				});
			}
		} else {
			throw new Error('The specified module does not exist.');
		}
	});
};

/**
 *
 * @param {*} config
 * @param {*} newconfig
 * @param {*} callback
 */

function procesarObjetosdeConfiguracion(config, newconfig, callback) {
	let count = 0;
	const newConfigProperties = Object.keys(newconfig);
	newConfigProperties.forEach(property => {
		if (Object.prototype.hasOwnProperty.call(config, property) && typeof newconfig[property] === 'object') {
			procesarObjetosdeConfiguracion(config[property], newconfig[property], newConfig => {
				config[property] = newConfig;
				count += 1;
			});
		} else {
			config[property] = newconfig[property];
			count += 1;
		}

		if (count === newConfigProperties.length) {
			callback(config);
		}
	});
}

module.exports.migrateGuildData = (guild, callback) => {
	client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
		if (err) {
			client.logError(err);
		}

		if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
			if (!result[0].clientVersion === 'pingu@1.0.0') {
				return;
			}

			// Migrar configuraciones generales
			const general = {idioma: result[0].guildLanguage, prefijo: result[0].guildPrefix, interacciones: {habilitado: 1, desplegarComandosDeConfiguracion: result[0].guildViewCnfCmdsEnabled}};

			// Migrar módulo de bienvenidas
			const welcomer = {
				habilitado: result[0].welcomeEnabled, canal: result[0].welcomeChannel, mensaje: result[0].welcomeMessage, tarjeta: {habilitado: result[0].welcomeImage, fondo: result[0].welcomeImageCustomBackground, overlay: {color: result[0].welcomeImageCustomOverlayColor, opacidad: result[0].welcomeImageCustomOpacity}},
			};
			// Migrar módulo de despedidas
			const farewell = {habilitado: result[0].farewellEnabled, canal: result[0].farewellChannel, mensaje: result[0].farewellMessage};

			// Migrar módulo de niveles
			const levels = {
				habilitado: result[0].levelsEnabled, canal: result[0].levelsChannel, mensaje: result[0].levelsMessage, dificultad: result[0].levelsDifficulty, tarjeta: {fondo: result[0].levelsImageCustomBackground, overlay: {opacidad: result[0].levelsImageCutomOpacity, color: result[0].levelsImageCustomOverlayColor}},
			};

			// Migrar módulo de economía
			const economy = {habilitado: result[0].economyEnabled, moneda: {nombre: result[0].economyCurrency, icono: result[0].economyCurrencyIcon}};

			// Migrar módulo de sugerencias
			const suggestions = {habilitado: result[0].suggestionsEnabled, canales: {sugerenciasNoRevisadas: result[0].suggestionsChannel, sugerenciasRevisadas: result[0].suggestionsRevChannel}};

			// Migrar módulo de respuestas automáticas
			const autoresponder = {habilitado: result[0].autoresponderEnabled};

			// Migar módulo de comandos personalizados
			const customcommands = {habilitado: result[0].customcommandsEnabled};

			module.exports.updateGuildConfig(guild, {column: 'clientVersion', value: 'pingu@2.0.0'});
			module.exports.updateGuildConfigNext(guild, {column: 'general', newconfig: general});
			module.exports.updateGuildConfigNext(guild, {column: 'bienvenidas', newconfig: welcomer});
			module.exports.updateGuildConfigNext(guild, {column: 'despedidas', newconfig: farewell});
			module.exports.updateGuildConfigNext(guild, {column: 'niveles', newconfig: levels});
			module.exports.updateGuildConfigNext(guild, {column: 'economia', newconfig: economy});
			module.exports.updateGuildConfigNext(guild, {column: 'sugerencias', newconfig: suggestions});
			module.exports.updateGuildConfigNext(guild, {column: 'respuestasPersonalizadas', newconfig: autoresponder});
			module.exports.updateGuildConfigNext(guild, {column: 'comandosPersonalizados', newconfig: customcommands});
			if (callback) {
				callback();
			}
		} else if (callback) {
			callback();
		}
	});
};

/**
 * Create the command list of the guild
 * @param {Guild} guild - The Guild
 * @param {Function} callback - The callback function
 * @returns Object - The command list
 */

module.exports.createGuildInteractionList = (guild, callback) => {
	module.exports.getGuildConfigNext(guild, guildConfig => {
		let welcome;
		let joinroles;
		let farewell;
		let levels;
		let economy;
		let suggestions;
		let bodyToSend;
		if (guildConfig.welcomeEnabled !== 0) {
			welcome = client.commands.filter(command => command.module === 'welcome') || [];
		}

		if (guildConfig.farewellEnabled !== 0) {
			farewell = client.commands.filter(command => command.module === 'farewell') || [];
		}

		if (guildConfig.joinRolesEnabled !== 0) {
			joinroles = client.commands.filter(command => command.module === 'joinroles') || [];
		}

		if (guildConfig.levelsEnabled !== 0) {
			levels = client.commands.filter(command => command.module === 'levels') || [];
		}

		if (guildConfig.suggestionsEnabled !== 0) {
			suggestions = client.commands.filter(command => command.module === 'suggestions') || [];
		}

		if (guildConfig.economyEnabled !== 0) {
			economy = client.commands.filter(command => command.module === 'economy') || [];
		}

		const nomodule = client.commands.filter(command => !command.module);

		bodyToSend = [].concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || [], suggestions || [], nomodule || []);

		if (guildConfig.guildViewCnfCmdsEnabled === 0) {
			bodyToSend = bodyToSend.filter(command => command.isConfigCommand === false);
		}

		if (callback) {
			callback(bodyToSend.map(command => command.interactionData.toJSON()));
		}
	});
};
