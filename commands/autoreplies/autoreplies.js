const { Permissions, MessageAttachment } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { crearRespuestaPersonalizada, eliminarRespuestaPersonalizda, generateTxtWithAllTheGuildAutoReplies } = require('../../modules/autoreplies')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'autoreplies',
  module: 'autoreplies',
  cooldown: 1000,
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('add').setDescription('Create an autoreply.')
      .addStringOption(input => input.setName('trigger').setRequired(true).setDescription('The trigger of the autoreply.'))
      .addStringOption(input => input.setName('reply').setRequired(true).setDescription('The reply for the trigger.'))
      .addBooleanOption(input => input.setName('sendinembed').setDescription('Whether or not the reply should be sent in an embed.'))
      .addStringOption(input => input.setName('sendinembed_title').setDescription('The title of the embed.'))
      .addStringOption(input => input.setName('sendinembed_description').setDescription('The description of the embed.'))
      .addStringOption(input => input.setName('sendinembed_thumbnail').setDescription('The thumbnail of the embed.'))
      .addStringOption(input => input.setName('sendinembed_image').setDescription('The image of the embed.'))
      .addStringOption(input => input.setName('sendinembed_url').setDescription('The url of the embed.'))
      .addStringOption(input => input.setName('sendinembed_color').setDescription('The color of the embed.'))
      .addRoleOption(input => input.setName('role').setDescription('Give a role when the command is used.')))
    .addSubcommand(sc => sc.setName('remove').setDescription('Remove an autoreply.')
      .addStringOption(input => input.setName('trigger').setRequired(true).setDescription('The trigger of the autoreply.')))
    .addSubcommand(sc => sc.setName('list').setDescription('Generates a TXT with all the autoreplies.')),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'add': {
        crearRespuestaPersonalizada(interaction.guild, { trigger: interaction.options.getString('trigger'), reply: interaction.options.getString('reply'), properties: { sendInEmbed: { enabled: interaction.options.getBoolean('sendinembed'), title: interaction.options.getString('sendinembed_title'), description: interaction.options.getString('sendinembed_description'), thumbnail: interaction.options.getString('sendinembed_thumbnail'), image: interaction.options.getString('sendinembed_image'), url: interaction.options.getString('sendinembed_url'), color: interaction.options.getString('sendinembed_color') } } }, (err) => {
          if (err) return interaction.editReply({ embeds: [plantillas.plantillas.error(i18n(locale, 'AUTOREPLY::ADD:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'AUTOREPLY::ADD:plantillas.conexito', { MESSAGE: interaction.options.getString('trigger') }))] })
        })
        break
      }
      case 'remove': {
        eliminarRespuestaPersonalizda(interaction.guild, interaction.options.getString('trigger'), (err) => {
          if (err) return interaction.editReply({ embeds: [plantillas.plantillas.error(i18n(locale, 'AUTOREPLY::REMOVE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'AUTOREPLY::REMOVE:plantillas.conexito', { MESSAGE: interaction.options.getString('trigger') }))] })
        })
        break
      }
      case 'list': {
        generateTxtWithAllTheGuildAutoReplies(interaction.guild, (txtPath) => {
          interaction.editReply({ files: [new MessageAttachment(txtPath, 'autoreplies.txt')] })
        })
        break
      }
      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
