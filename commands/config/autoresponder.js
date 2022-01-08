const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'autoresponder',
  description: '⚙️ Configure the autoresponder',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Configure the autoresponder')
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a new autoresponder').addStringOption(option => option.setName('id').setDescription('Response ID').setRequired(true)).addStringOption(option => option.setName('trigger').setDescription('Response trigger').setRequired(true)).addStringOption(option => option.setName('reply').setDescription('Response reply').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove an autoresponder').addStringOption(option => option.setName('id').setDescription('Response ID').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'create': {
        client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [interaction.guild.id, interaction.options.getString('id'), interaction.options.getString('trigger'), interaction.options.getString('reply')], function (err) {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::CREATE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'AUTORESPONDER::CREATE:SUCCESS', { RESPONSE: interaction.options.getString('id') }))] })
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [interaction.options.getString('id'), interaction.guild.id], function (err) {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::REMOVE:ERROR'))] })
          interaction.editReply({ embeds: [Success(interaction, i18n(locale, 'AUTORESPONDER::REMOVE:SUCCESS', { RESPONSE: interaction.options.getString('id') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('autoresponder', i18n(locale, 'AUTORESPONDER::HELPTRAY:DESCRIPTION'), [{ option: 'create', description: i18n(locale, 'AUTORESPONDER::HELPTRAY:OPTION:CREATE'), syntax: 'create <ID>', isNsfw: false }, { option: 'remove', description: i18n(locale, 'AUTORESPONDER::HELPTRAY:OPTION:REMOVE'), syntax: 'remove <ID>', isNsfw: false }])
    const filter = m => m.member.id === message.member.id

    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, [0, 1]))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'create': {
        message.channel.send({ content: `:arrow_right: ${i18n(locale, 'AUTORESPONDER::CREATE:TRIGGERINSERT')}` }).then((embedMenu) => {
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            const autoresponderTrigger = collected.first().content.toLocaleLowerCase()
            collected.first().delete()
            embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'AUTORESPONDER::CREATE:RESPONSE')}` })
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              const autoresponderResponse = collected.first().content
              collected.first().delete()
              const autoresponderId = message.args[1]
              client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [message.guild.id, autoresponderId, autoresponderTrigger, autoresponderResponse], function (err) {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::CREATE:ERROR'))] })
                message.reply({ embeds: [Success(i18n(locale, 'AUTORESPONDER::CREATE:SUCCESS', { RESPONSE: autoresponderId }))] })
              })
            })
          })
        })
        break
      }
      case 'remove': {
        client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
          if (err) client.logError(err)
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'AUTORESPONDER::REMOVE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'AUTORESPONDER::REMOVE:SUCCESS', { RESPONSE: message.args[1] }))] })
        })
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
