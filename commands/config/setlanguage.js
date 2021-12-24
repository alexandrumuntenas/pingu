const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

const avaliableLanguages = ['en', 'es']

module.exports = {
  name: 'setlanguage',
  description: '⚙️ Set the language for the bot',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('setlanguage')
    .setDescription('Set the language for the bot')
    .addStringOption(option =>
      option.setName('language')
        .setDescription('The language to set')
        .setRequired(true)
        .addChoice('Spanish', 'es')
        .addChoice('English', 'en')
        .setRequired(true)),
  executeInteraction (client, locale, interaction) {
    client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.options.getString('language'), interaction.guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    interaction.editReply({ embeds: [Success(i18n(interaction.options.getString('language'), 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${interaction.options.getString('language')}\`` }))] })
  },
  executeLegacy (client, locale, interaction) {
    if (interaction.args[0] && avaliableLanguages.includes(interaction.args[0])) {
      client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.args[0], interaction.guild.id], (err) => {
        if (err) client.Sentry.captureException(err)
      })
      interaction.reply({ embeds: [Success(i18n(interaction.args[0], 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${interaction.args[0]}\`` }))] })
    } else {
      interaction.reply({ embeds: [Help('setlanguage', i18n.help(locale, 'SETLANGUAGE::DESCRIPTION'), [{ option: 'es', description: 'Spanish' }, { option: 'en', description: 'English' }])] })
    }
  }
}
