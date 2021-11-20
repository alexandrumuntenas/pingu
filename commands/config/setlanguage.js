const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

const avaliableLanguages = ['en', 'es']

module.exports = {
  cooldown: 0,
  name: 'setlanguage',
  description: 'Set the language for the bot',
  data: new SlashCommandBuilder()
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
    if (interaction.guild.ownerId === interaction.member.id || interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.options.getString('language'), interaction.guild.id], (err) => {
        if (err) client.Sentry.captureException(err)
      })
      genericMessages.success(interaction, getLocales(interaction.options.getString('language'), 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${interaction.options.getString('language')}\`` }))
    } else {
      genericMessages.error.permissionerror(interaction, locale)
    }
  },
  executeLegacy (client, locale, interaction) {
    if (interaction.guild.ownerId === interaction.member.id || interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (interaction.args[0] && avaliableLanguages.includes(interaction.args[0])) {
        client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.args[0], interaction.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.legacy.success(interaction, getLocales(interaction.args[0], 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${interaction.args[0]}\`` }))
      } else {
        genericMessages.legacy.Info.help(interaction, locale, `${interaction.database.guildPrefix}setlanguage <language>`, ['en', 'es'])
      }
    } else {
      genericMessages.legacy.error.permissionerror(interaction, locale)
    }
  }
}
