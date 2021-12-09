const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const guildMemberRemove = require('../../events/guildMemberRemove')

module.exports = {
  module: 'farewell',
  name: 'farewell',
  description: '⚙️ Configure the farewell settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('farewell')
    .setDescription('Configure the farewell settings for your server.')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current farewell configuration'))
    .addSubcommand(subcommand => subcommand.setName('channel').setDescription('Set the farewell channel').addChannelOption(option => option.setName('farewellchannel').setDescription('Select a channel')))
    .addSubcommand(subcommand => subcommand.setName('message').setDescription('Set the farewell message').addStringOption(option => option.setName('farewellmessage').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}')))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the farewell message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(getLocales(locale, 'FAREWELL_VIEWCONFIG_TITLE'))
          .setDescription(getLocales(locale, 'FAREWELL_VIEWCONFIG_DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.farewellChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${interaction.database.farewellMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'channel': {
        if (interaction.options.getChannel('farewellchannel')) {
          client.pool.query('UPDATE `guildData` SET `farewellChannel` = ? WHERE `guild` = ?', [interaction.options.getChannel('farewellchannel').id, interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
            genericMessages.success(interaction, getLocales(locale, 'FAREWELL_CHANNEL_SUCCESS', { FAREWELL_CHANNEL: interaction.options.getChannel('farewellchannel') }))
          })
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'FAREWELL_CHANNEL_MISSING_ARGS', { FAREWELL_CHANNEL: interaction.guild.channels.cache.find(c => c.id === interaction.database.farewellChannel) }))
        }
        break
      }
      case 'message': {
        if (interaction.options.getString('farewellmessage')) {
          client.pool.query('UPDATE `guildData` SET `farewellMessage` = ? WHERE `guild` = ?', [interaction.options.getString('farewellmessage'), interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
            genericMessages.success(interaction, getLocales(locale, 'FAREWELL_MESSAGE_SUCCESS', { FAREWELL_MESSAGE: `\`${interaction.options.getString('farewellmessage')}\`` }))
          })
        } else {
          genericMessages.info.status(interaction, getLocales(locale, 'FAREWELL_MESSAGE_MISSING_ARGS', { FAREWELL_MESSAGE: interaction.database.farewellMessage }))
        }
        break
      }
      case 'simulate': {
        genericMessages.info.status(interaction, getLocales(locale, 'FAREWELL_SIMULATE_SUCCESS'))
        guildMemberRemove(client, interaction.member)
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'viewconfig': {
          message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
            const sentEmbed = new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(getLocales(locale, 'FAREWELL_VIEWCONFIG_TITLE'))
              .setDescription(getLocales(locale, 'FAREWELL_VIEWCONFIG_DESCRIPTION'))
              .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
              .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.farewellMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)

            _message.edit({ content: 'Done', embeds: [sentEmbed] })
          })
          break
        }
        case 'channel': {
          if (message.mentions.channels.first()) {
            client.pool.query('UPDATE `guildData` SET `farewellChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'FAREWELL_CHANNEL_SUCCESS', { FAREWELL_CHANNEL: message.mentions.channels.first() }))
            })
          } else {
            genericMessages.legacy.Info.status(message, getLocales(locale, 'FAREWELL_CHANNEL_MISSING_ARGS', { FAREWELL_CHANNEL: message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) }))
          }
          break
        }
        case 'message': {
          const filter = m => m.member.id === message.member.id
          genericMessages.legacy.Info.status(message, getLocales(locale, 'FAREWELL_MESSAGE_PREUPDATE'))
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            client.pool.query('UPDATE `guildData` SET `farewellMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'FAREWELL_MESSAGE_SUCCESS', { FAREWELL_MESSAGE: `\`${collected.first().content}\`` }))
            })
          })
          break
        }
        case 'simulate': {
          genericMessages.legacy.Info.status(message, getLocales(locale, 'FAREWELL_SIMULATE_SUCCESS'))
          guildMemberRemove(client, message.member)
          break
        }
        default: {
          helpTray(message, locale)
          break
        }
      }
    } else {
      helpTray(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `\`${message.database.guildPrefix}farewell <option>\``, ['viewconfig', 'channel <channel>', 'message', 'simulate'])
}
