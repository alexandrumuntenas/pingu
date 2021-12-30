const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { createSuggestion } = require('../../modules/suggestions')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const makeId = require('../../modules/makeId')

module.exports = {
  module: 'suggestions',
  name: 'suggest',
  description: 'Make a suggestion',
  cooldown: 3600000,
  interactionData: new SlashCommandBuilder().setName('suggest').setDescription('Make a suggestion')
    .addStringOption(option => option.setName('suggestion').setDescription('The suggestion to make.').setRequired(true)),
  executeInteraction: async (client, locale, interaction) => {
    const suggestion = interaction.options.getString('suggestion')
    if (interaction.database.suggestionsChannel) {
      if (!suggestion) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTION_NO_INPUT'))] })
      const suggestionId = makeId(5)
      const suggestionEmbed = new MessageEmbed().addField(i18n(locale, 'SUGGESTION_SUBMITTER'), `${interaction.member.user.tag} (${interaction.member.id})`).addField(i18n(locale, 'SUGGESTION_SUGGESTION'), suggestion).setThumbnail(interaction.member.displayAvatarURL()).setColor('#2F3136').setFooter(`${i18n(locale, 'SUGGESTION_STATUS')}: ${i18n(locale, 'SUGGESTION_PENDING')}\nSuggestion ID: ${suggestionId}\nServer ID: ${interaction.guild.id}\nDate`).setTimestamp()
      await interaction.guild.channels.fetch(interaction.database.suggestionsChannel).then(channel => {
        channel.send({ embeds: [suggestionEmbed] }).then((_reply) => {
          createSuggestion(client, { suggestionId: suggestionId, suggestionContent: suggestion, suggestionAuthor: interaction.member.id, suggestionGuild: interaction.guild.id, suggestionMessage: _reply.id }, (status) => {
            if (status === 500) return interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTION_CREATION_ERROR'))] })
            return interaction.editReply({ embeds: [Success(i18n(locale, 'SUGGESTION_CREATED', { SUGGESTION_ID: suggestionId }))] })
          })
        })
      })
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'SUGGESTIONS_NOT_CONFIGURED'))] })
    }
  }
}
