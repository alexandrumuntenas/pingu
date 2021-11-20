const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 0,
  name: 'setprefix',
  description: 'Set the prefix for the bot',
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Set the prefix for the bot')
    .addStringOption(option => option.setName('newprefix').setDescription('Enter the new prefix').setRequired(true)),
  executeInteraction (client, locale, interaction) {
    if (interaction.guild.ownerId === interaction.member.id || interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [interaction.options.getString('newprefix'), interaction.guild.id], (err) => {
        if (err) client.Sentry.captureException(err)
      })
      genericMessages.success(interaction, getLocales(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${interaction.options.getString('newprefix')}\`` }))
    } else {
      genericMessages.error.permissionerror(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.member.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        genericMessages.legacy.success(message, getLocales(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${message.args[0]}\`` }))
      } else {
        genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}setprefix <newprefix>`)
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}
