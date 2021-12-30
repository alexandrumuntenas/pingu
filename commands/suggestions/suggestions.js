const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'suggestions',
  description: 'Configure the suggestions module of your server',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder().setName('suggestions').setDescription('Configure the suggestions module of your server')
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the channel where the suggestions are sent.').addChannelOption(option => option.setName('channel').setDescription('Channel where the suggestions are sent.').setRequired(true)))
    .addSubcommand(sc => sc.setName('setrevisedchannel').setDescription('Set the channel where revised suggestions are sent.').addChannelOption(option => option.setName('channel').setDescription('Channel where the revised suggestions are sent.').setRequired(true))),
  executeInteraction: async (client, locale, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'setchannel': {
        const channel = interaction.options.getChannel('channel')
        if (!channel) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS_SETCHANNEL_NOCHANNEL'))] })

        client.pool.query('UPDATE `guildData` SET `suggestionsChannel` = ? WHERE `guild` = ?', [channel.id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS_SETCHANNEL_ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS_SETCHANNEL_SUCCESFULLY', { SUGGESTIONS_CHANNEL: channel }))] })
        })
        break
      }
      case 'setrevisedchannel': {
        const channel = interaction.options.getChannel('channel')
        if (!channel) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS_SETCHANNEL_NOCHANNEL'))] })

        client.pool.query('UPDATE `guildData` SET `suggestionsRevChannel` = ? WHERE `guild` = ?', [channel.id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS_SETCHANNEL_ERROR'))] })
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS_SETCHANNEL_SUCCESFULLY', { SUGGESTIONS_CHANNEL: channel }))] })
        })
        break
      }
    }
  }
}
