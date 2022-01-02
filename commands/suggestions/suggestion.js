const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const { approveSuggestion, rejectSuggestion } = require('../../modules/suggestions')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'suggestions',
  name: 'suggestion',
  description: 'Command to handle suggestions',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder().setName('suggestion').setDescription('Command to handle suggestions')
    .addSubcommand(sc => sc.setName('approve').setDescription('Approve a suggestion.').addStringOption(option => option.setName('id').setDescription('ID of the suggestion to approve.').setRequired(true)))
    .addSubcommand(sc => sc.setName('reject').setDescription('Reject a suggestion.').addStringOption(option => option.setName('id').setDescription('ID of the suggestion to reject.').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Reason for rejection.'))),
  executeInteraction: async (client, locale, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'approve': {
        approveSuggestion(client, { suggestionId: interaction.options.getString('id'), suggestionGuild: interaction.guild.id, suggestionSupervisor: interaction.member.id }, (status) => {
          if (status === 500) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
          if (status === 404) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::APPROVE:NOEXIST', { SUGGESTION_ID: interaction.options.getString('id') }))] })
          const suggestionAuthor = interaction.guild.members.resolve(status.suggestionAuthor)
          const suggestionEmbed = new MessageEmbed().addField(i18n(locale, 'SUGGESTION::SUBMITTER'), `${suggestionAuthor.user.tag || 'Somebody :eyes:'} (${status.suggestionAuthor})`).addField(i18n(locale, 'SUGGESTION'), status.suggestionContent).setThumbnail(interaction.member.displayAvatarURL()).setColor('GREEN').setFooter(`${i18n(locale, 'STATUS')}: ${i18n(locale, 'SUGGESTION::APPROVED')}\n${i18n(locale, 'SUGGESTION::REVISOR')}: ${interaction.member.user.tag} (${interaction.member.id})\nSuggestion ID: ${status.suggestionId}\nServer ID: ${interaction.guild.id}\nDate`).setTimestamp()

          if (interaction.database.suggestionsRevChannel && interaction.guild.channels.cache.get(interaction.database.suggestionsRevChannel)) interaction.guild.channels.cache.get(interaction.database.suggestionsRevChannel).send({ embeds: [suggestionEmbed] })
          else interaction.guild.channels.cache.get(interaction.database.suggestionsChannel).messages.fetch(status.suggestionMessageId).then(message => message.edit({ embeds: [suggestionEmbed] }))
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::APPROVE:SUCCESS', { SUGGESTION_ID: interaction.options.getString('id') }))] })
        })
        break
      }
      case 'reject': {
        rejectSuggestion(client, { suggestionId: interaction.options.getString('id'), suggestionGuild: interaction.guild.id, suggestionSupervisor: interaction.member.id }, (status) => {
          if (status === 500) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
          if (status === 404) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS::REJECT:NOEXIST', { SUGGESTION_ID: interaction.options.getString('id') }))] })
          const suggestionAuthor = interaction.guild.members.resolve(status.suggestionAuthor)
          const suggestionEmbed = new MessageEmbed().addField(i18n(locale, 'SUGGESTION::SUBMITTER'), `${suggestionAuthor.user.tag || 'Somebody :eyes:'} (${status.suggestionAuthor})`).addField(i18n(locale, 'SUGGESTION'), status.suggestionContent).setThumbnail(interaction.member.displayAvatarURL()).setColor('RED').setFooter(`${i18n(locale, 'SUGGESTION::STATUS')}: ${i18n(locale, 'SUGGESTION::REJECTED')}\n${i18n(locale, 'SUGGESTION::REVISOR')}: ${interaction.member.user.tag} (${interaction.member.id})\nSuggestion ID: ${status.suggestionId}\nServer ID: ${interaction.guild.id}\nDate`).setTimestamp()

          if (interaction.database.suggestionsRevChannel && interaction.guild.channels.cache.get(interaction.database.suggestionsRevChannel)) interaction.guild.channels.cache.get(interaction.database.suggestionsRevChannel).send({ embeds: [suggestionEmbed] })
          else interaction.guild.channels.cache.get(interaction.database.suggestionsChannel).messages.fetch(status.suggestionMessageId).then(message => message.edit({ embeds: [suggestionEmbed] }))
          return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTIONS::REJECT:SUCCESS', { SUGGESTION_ID: interaction.options.getString('id') }))] })
        })
        break
      }
    }
  }
}
