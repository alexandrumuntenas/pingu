const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { isInteger } = require('mathjs');
const isHexColor = require('is-hexcolor');
const genericMessages = require('../../functions/genericMessages');
const getLocales = require('../../i18n/getLocales');

const channelRelationship = { 0: 'Not Setup', 1: 'Same Channel where Message is Sent' };
const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' };

module.exports = {
  module: 'levels',
  name: 'levels',
  description: '⚙️ Configure the levels system',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('Configure the levels system')
    .addSubcommand((subcommand) => subcommand.setName('viewconfig').setDescription('View the current levels system configuration'))
    .addSubcommand((subcommand) => subcommand.setName('rankupchannel').setDescription('Set the rankUp channel').addStringOption((option) => option.setName('channel')
        .setDescription('Set the new channel')
        .addChoice('Disabled', 'disabled')
        .addChoice('Same Channel Where Message Is Sent', 'same')
        .addChoice('This Channel', 'this')))
    .addSubcommand((subcommand) => subcommand.setName('rankupmessage').setDescription('Set the Rank Up message').addStringOption((option) => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {oldlevel} {newlevel} {experience}')))
    .addSubcommand((subcommand) => subcommand.setName('difficulty').setDescription('Change the difficulty to level up').addNumberOption((option) => option.setName('difficulty').setDescription('Enter a number 1-5')))
    .addSubcommand((subcommand) => subcommand.setName('custombackground').setDescription('Set the rank cards background').addStringOption((option) => option.setName('url').setDescription('Enter a valid image URL')))
    .addSubcommand((subcommand) => subcommand.setName('overlaycolor').setDescription('Set the rank cards overlay color').addStringOption((option) => option.setName('hexcolor').setDescription('Enter a hex color')))
    .addSubcommand((subcommand) => subcommand.setName('overlayopacity').setDescription('Set the rank cards overlay opacity').addNumberOption((option) => option.setName('opacity').setDescription('Enter a number')))
    .addSubcommand((subcommand) => subcommand.setName('overlayblur').setDescription('Set the rank cards overlay blur').addNumberOption((option) => option.setName('blur').setDescription('Enter a number'))),
  executeInteraction(client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(getLocales(locale, 'LEVELS_VIEWCONFIG_TITLE'))
          .setDescription(getLocales(locale, 'LEVELS_VIEWCONFIG_DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${interaction.guild.channels.cache.find((c) => c.id === interaction.database.levelsChannel) || channelRelationship[interaction.database.levelsChannel]}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${interaction.database.levelsMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
          .addField(`:trophy: ${getLocales(locale, 'LEVELS_VIEWCONFIG_DIFFICULTY')}`, `${interaction.database.levelsDifficulty}`, true)
          .addField(`<:blurple_image:892443053359517696> ${getLocales(locale, 'LEVELS_VIEWCONFIG_LEVELCARD_TITLE')}`, `${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[1] })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${interaction.database.levelsImageCustomBackground})` || getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYCOLOR', { WELCOMER_OVERLAYCOLOR: interaction.database.levelsImageCustomOverlayColor })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: interaction.database.levelsImageCustomBlur })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: interaction.database.levelsImageCustomOpacity })}`, false);

        interaction.editReply({ embeds: [sentEmbed] });
        break;
      }
      case 'rankupchannel': {
        switch (interaction.options.getString('channel')) {
          case 'disable': {
            client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['0', interaction.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.success(interaction, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: channelRelationship[0] }));
            });
            break;
          }
          case 'same': {
            client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['1', interaction.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.success(interaction, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: channelRelationship[1] }));
            });
            break;
          }
          case 'this': {
            client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', [interaction.channel.id, interaction.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.success(interaction, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: interaction.channel }));
            });
            break;
          }
          default: {
            genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_CHANNEL_MISSING_ARGS', { LEVELS_CHANNEL: interaction.database.levelsChannel }));
            break;
          }
        }
        break;
      }
      case 'rankupmessage': {
        if (interaction.options.getString('message')) {
          client.pool.query('UPDATE `guildData` SET `levelsMessage` = ? WHERE `guild` = ?', [interaction.options.getString('message'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
            genericMessages.success(interaction, getLocales(locale, 'LEVELS_MESSAGE_SUCCESS', { LEVELS_MESSAGE: `\`${interaction.options.getString('message')}\`` }));
          });
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_MESSAGE_MISSING_ARGS', { LEVELS_MESSAGE: interaction.database.levelsMessage }));
        }
        break;
      }
      case 'difficulty': {
        if (interaction.options.getNumber('difficulty')) {
          if (isInteger(parseInt(interaction.options.getNumber('difficulty')))) {
            client.pool.query('UPDATE `guildData` SET `levelsDifficulty` = ? WHERE `guild` = ?', [parseInt(interaction.options.getNumber('difficulty')), interaction.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.success(interaction, getLocales(locale, 'LEVELS_DIFFICULTY_SUCCESS', { LEVELS_DIFFICULTY: interaction.options.getNumber('difficulty') }));
            });
          } else {
            genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_DIFFICULTY_NOT_INT'));
          }
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_DIFFICULTY_MISSING_ARGS', { LEVELS_DIFFICULTY: interaction.database.levelsDifficulty }));
        }
        break;
      }
      case 'custombackground': {
        if (interaction.options.getString('url')) {
          client.pool.query('UPDATE `guildData` SET `levelsImageCustomBackground` = ? WHERE `guild` = ?', [interaction.options.getString('url'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
            genericMessages.success(interaction, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_SUCCESS', { LEVELS_CUSTOMBACKGROUND: interaction.options.getString('url') }));
          });
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_MISSING_ARGS', { LEVELS_CUSTOMBACKGROUND: interaction.database.levelsImageCustomBackground }));
        }
        break;
      }
      case 'overlayopacity': {
        if (interaction.options.getNumber('opacity')) {
          client.pool.query('UPDATE `guildData` SET `levelsImageCustomOpacity` = ? WHERE `guild` = ?', [interaction.options.getNumber('opacity'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
            genericMessages.success(interaction, getLocales(locale, 'LEVELS_OVERLAYOPACITY_SUCCESS', { LEVELS_OVERLAYOPACITY: interaction.options.getNumber('opacity') }));
          });
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_OVERLAYOPACITY_MISSING_ARGS', { LEVELS_OVERLAYOPACITY: interaction.database.levelsImageCustomOpacity }));
        }
        break;
      }
      case 'overlayblur': {
        if (interaction.options.getNumber('blur')) {
          client.pool.query('UPDATE `guildData` SET `levelsImageCustomBlur` = ? WHERE `guild` = ?', [interaction.options.getNumber('blur'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
            genericMessages.success(interaction, getLocales(locale, 'LEVELS_OVERLAYBLUR_SUCCESS', { LEVELS_OVERLAYBLUR: interaction.options.getNumber('blur') }));
          });
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_OVERLAYBLUR_MISSING_ARGS', { LEVELS_OVERLAYBLUR: interaction.database.levelsImageCustomBlur }));
        }
        break;
      }
      case 'overlaycolor': {
        if (interaction.options.getString('hexcolor')) {
          if (isHexColor(interaction.options.getString('hexcolor'))) {
            client.pool.query('UPDATE `guildData` SET `levelsImageCustomOverlayColor` = ? WHERE `guild` = ?', [interaction.options.getString('hexcolor'), interaction.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.success(interaction, getLocales(locale, 'LEVELS_OVERLAYCOLOR_SUCCESS', { LEVELS_OVERLAYCOLOR: interaction.options.getString('hexcolor') }));
            });
          } else {
            genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_OVERLAYCOLOR_NOT_HEX'));
          }
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'LEVELS_OVERLAYCOLOR_MISSING_ARGS', { LEVELS_OVERLAYCOLOR: interaction.database.levelsImageCustomOverlayColor }));
        }
        break;
      }
    }
  },
  executeLegacy(client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'viewconfig': {
          message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
            const sentEmbed = new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(getLocales(locale, 'LEVELS_VIEWCONFIG_TITLE'))
              .setDescription(getLocales(locale, 'LEVELS_VIEWCONFIG_DESCRIPTION'))
              .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find((c) => c.id === message.database.levelsChannel) || channelRelationship[message.database.levelsChannel]}`, true)
              .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.levelsMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
              .addField(`:trophy: ${getLocales(locale, 'LEVELS_VIEWCONFIG_DIFFICULTY')}`, `${message.database.levelsDifficulty}`, true)
              .addField(`<:blurple_image:892443053359517696> ${getLocales(locale, 'LEVELS_VIEWCONFIG_LEVELCARD_TITLE')}`, `${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[1] })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${message.database.levelsImageCustomBackground})` || getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYCOLOR', { WELCOMER_OVERLAYCOLOR: message.database.levelsImageCustomOverlayColor })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: message.database.levelsImageCustomBlur })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: message.database.levelsImageCustomOpacity })}`, false);

            _message.edit({ content: 'Done', embeds: [sentEmbed] });
          });
          break;
        }
        case 'rankupchannel': {
          if (message.mentions.channels.first()) {
            client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: message.mentions.channels.first() }));
            });
          } else if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
              switch (message.args[1]) {
                case 'none': {
                  client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['0', message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err);
                    genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'none' }));
                  });
                  break;
                }
                case 'same': {
                  client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['1', message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err);
                    genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'same' }));
                  });
                  break;
                }
                default: {
                  genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_CHANNEL_MISSING_ARGS', { LEVELS_CHANNEL: 'r/softwaregore' }));
                  break;
                }
              }
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_CHANNEL_MISSING_ARGS', { LEVELS_CHANNEL: 'r/softwaregore' }));
            }
          break;
        }
        case 'rankupmessage': {
          const filter = (m) => m.member.id === message.member.id;
          genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_MESSAGE_PREUPDATE'));
          message.channel.awaitMessages({ filter, max: 1 }).then((collected) => {
            client.pool.query('UPDATE `guildData` SET `levelsMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_MESSAGE_SUCCESS', { LEVELS_MESSAGE: `\`${collected.first().content}\`` }));
            });
          });
          break;
        }
        case 'difficulty': {
          if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
            if (isInteger(parseInt(message.args[1]))) {
              client.pool.query('UPDATE `guildData` SET `levelsDifficulty` = ? WHERE `guild` = ?', [parseInt(message.args[1]), message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err);
                genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_DIFFICULTY_SUCCESS', { LEVELS_DIFFICULTY: message.args[1] }));
              });
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_NOT_INT'));
            }
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_MISSING_ARGS', { LEVELS_DIFFICULTY: message.database.levelsDifficulty }));
          }
          break;
        }
        case 'custombackground': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `levelsImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_SUCCESS', { LEVELS_CUSTOMBACKGROUND: message.args[1] }));
            });
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_MISSING_ARGS', { LEVELS_CUSTOMBACKGROUND: message.database.levelsImageCustomBackground }));
          }
          break;
        }
        case 'overlayopacity': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `levelsImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_OVERLAYOPACITY_SUCCESS', { LEVELS_OVERLAYOPACITY: (message.args[1]) }));
            });
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYOPACITY_MISSING_ARGS', { LEVELS_OVERLAYOPACITY: message.database.levelsImageCustomOpacity }));
          }
          break;
        }
        case 'overlayblur': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `levelsImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err);
              genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_OVERLAYBLUR_SUCCESS', { LEVELS_OVERLAYBLUR: (message.args[1]) }));
            });
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYBLUR_MISSING_ARGS', { LEVELS_OVERLAYBLUR: message.database.levelsImageCustomBlur }));
          }
          break;
        }
        case 'overlaycolor': {
          if (message.args[1]) {
            if (isHexColor(message.args[1])) {
              client.pool.query('UPDATE `guildData` SET `levelsImageCustomOverlayColor` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err);
                genericMessages.legacy.success(message, getLocales(locale, 'LEVELS_OVERLAYCOLOR_SUCCESS', { LEVELS_OVERLAYCOLOR: message.args[1] }));
              });
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYCOLOR_NOT_HEX'));
            }
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYCOLOR_MISSING_ARGS', { LEVELS_OVERLAYCOLOR: message.database.levelsImageCustomOverlayColor }));
          }
          break;
        }
        default: {
          helpTray(message, locale);
          break;
        }
      }
    } else {
      helpTray(message, locale);
    }
  }
};

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `\`${message.database.guildPrefix}levels <option>\``, ['viewconfig', 'rankupchannel <channel>', 'rankupmessage', 'difficulty <difficulty>', 'custombackground <background URL>', 'overlaycolor <hex code>', 'overlayopacity <quantity>', 'overlayblur <quantity>']);
};
