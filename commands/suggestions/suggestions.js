const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'suggestions',
  name: 'suggestions',
  description: 'Configure the suggestions module of your server',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder().setName('suggestions').setDescription('Configure the suggestions module of your server')
    .addSubcommand(sc => sc.setName('viewconfig').setDescription('View the current configuration of the suggestions module.'))
    .addSubcommand(sc => sc.setName('unsetchannel').setDescription('Unset the channel where the suggestions are sent.'))
    .addSubcommand(sc => sc.setName('unsetrevisionchannel').setDescription('Unset the channel where the revised suggestions are sent.'))
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the channel where the suggestions are sent.').addChannelOption(option => option.setName('channel').setDescription('Channel where the suggestions are sent.').setRequired(true)))
    .addSubcommand(sc => sc.setName('setrevisedchannel').setDescription('Set the channel where revised suggestions are sent.').addChannelOption(option => option.setName('channel').setDescription('Channel where the revised suggestions are sent.').setRequired(true))),
  executeInteraction: async (client, locale, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'SUGGESTIONS::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'SUGGESTIONS::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`:outbox_tray: ${i18n(locale, 'SUGGESTIONS::VIEWCONFIG:EMBED:CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.suggestionsChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`:inbox_tray: ${i18n(locale, 'SUGGESTIONS::VIEWCONFIG:EMBED:REVISEDCHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.suggestionsRevChannel) || i18n(locale, 'UNSET')}`, true)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'setchannel': {
        const channel = interaction.options.getChannel('channel')
        if (!channel) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:NOCHANNEL'))] })

        client.pool.query('UPDATE `guildData` SET `suggestionsChannel` = ? WHERE `guild` = ?', [channel.id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:SUCCESS', { SUGGESTIONS_CHANNEL: channel }))] })
        })
        break
      }
      case 'setrevisedchannel': {
        const channel = interaction.options.getChannel('channel')
        if (!channel) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:NOCHANNEL'))] })

        client.pool.query('UPDATE `guildData` SET `suggestionsRevChannel` = ? WHERE `guild` = ?', [channel.id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::sETCHANNEL:SUCCESS', { SUGGESTIONS_CHANNEL: channel }))] })
        })
        break
      }
      case 'unsetchannel': {
        client.pool.query('UPDATE `guildData` SET `suggestionsRevChannel` = ? WHERE `guild` = ?', [null, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::UNSETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::UNSETCHANNEL:SUCCESS'))] })
        })
        break
      }
      case 'unsetrevisedchannel': {
        client.pool.query('UPDATE `guildData` SET `suggestionsChannel` = ? WHERE `guild` = ?', [null, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::UNSETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::UNSETCHANNEL:SUCCESS'))] })
        })
        break
      }
    }
  }
}
