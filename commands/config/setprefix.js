const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'setprefix',
  description: '⚙️ Set the prefix for the bot',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Set the prefix for the bot')
    .addStringOption(option => option.setName('newprefix').setDescription('Enter the new prefix').setRequired(true)),
  executeInteraction (client, locale, interaction) {
    client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [interaction.options.getString('newprefix'), interaction.guild.id], (err) => {
      if (err) client.Sentry.captureException(err)
    })
    interaction.editReply({ embeds: [Success(i18n(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${interaction.options.getString('newprefix')}\`` }))] })
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [message.args[0], message.guild.id], (err) => {
        if (err) client.Sentry.captureException(err)
      })
      message.reply({ embeds: [Success(i18n(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${message.args[0]}\`` }))] })
    } else {
      message.reply({ embeds: [Help('setprefix', i18n.help(locale, 'SETPREFIX::DESCRIPTION'), [{ option: 'newprefix', description: i18n.help(locale, 'SETPREFIX::OPTION:NEWPREFIX'), syntax: '<new prefix>' }])] })
    }
  }
}
