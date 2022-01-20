const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Success } = require('../../modules/constructor/messageBuilder');
const i18n = require('../../i18n/i18n');

module.exports = {
  name: 'autoresponder',
  description: '⚙️ Configure the autoresponder',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Configure the autoresponder')
    .addSubcommand((subcommand) => subcommand.setName('create').setDescription('Create a new autoresponder').addStringOption((option) => option.setName('id').setDescription('Response ID').setRequired(true)).addStringOption((option) => option.setName('trigger').setDescription('Response trigger').setRequired(true))
.addStringOption((option) => option.setName('reply').setDescription('Response reply').setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Remove an autoresponder').addStringOption((option) => option.setName('id').setDescription('Response ID').setRequired(true))),
  executeInteraction(client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'create': {
        client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [interaction.guild.id, interaction.options.getString('id'), interaction.options.getString('trigger'), interaction.options.getString('reply')], (err) => {
          if (err) client.logError(err);
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::CREATE:ERROR'))] });
          interaction.editReply({ embeds: [Success(i18n(locale, 'AUTORESPONDER::CREATE:SUCCESS', { RESPONSE: interaction.options.getString('id') }))] });
        });
        break;
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [interaction.options.getString('id'), interaction.guild.id], (err) => {
          if (err) client.logError(err);
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::REMOVE:ERROR'))] });
          interaction.editReply({ embeds: [Success(interaction, i18n(locale, 'AUTORESPONDER::REMOVE:SUCCESS', { RESPONSE: interaction.options.getString('id') }))] });
        });
        break;
      }
    }
  }
};
