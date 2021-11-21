const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const makeId = require('../../modules/makeId')

module.exports = {
  cooldown: 0,
  name: 'autoresponder',
  description: 'Configure the autoresponder',
  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Configure the autoresponder')
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a new autoresponder').addStringOption(option => option.setName('id').setDescription('Response ID').setRequired(true)).addStringOption(option => option.setName('trigger').setDescription('Response trigger').setRequired(true)).addStringOption(option => option.setName('reply').setDescription('Response reply').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove an autoresponder').addStringOption(option => option.setName('id').setDescription('Response ID').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    if (interaction.guild.ownerId === interaction.member.id || interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      switch (interaction.options.getSubcommand()) {
        case 'create': {
          client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [interaction.guild.id, interaction.options.getString('id'), interaction.options.getString('trigger'), interaction.options.getString('reply')], function (err) {
            if (err) client.Sentry.captureException(err)
            genericMessages.success(interaction, getLocales(locale, 'AUTORESPONDER_CREATE_SUCCESS', { AUTORESPONDER_ID: interaction.options.getString('id') }))
          })
          break
        }
        case 'remove': {
          client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [interaction.options.getString('id'), interaction.guild.id], function (err) {
            if (err) client.Sentry.captureException(err)
            genericMessages.success(interaction, getLocales(locale, 'AUTORESPONDER_REMOVE_SUCCESS', { AUTORESPONDER_ID: interaction.options.getString('id') }))
          })
          break
        }
      }
    } else {
      genericMessages.legacy.error.permissionerror(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.member.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      const filter = m => m.member.id === message.member.id
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'create': {
            if (message.args[1]) {
              message.channel.send({ content: `:arrow_right: ${getLocales(locale, 'AUTORESPONDER_CREATE_INSERTRIGGER')}` }).then((embedMenu) => {
                message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                  const autoresponderTrigger = collected.first().content.toLocaleLowerCase()
                  collected.first().delete()
                  embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'AUTORESPONDER_CREATE_INSERTRESPONSE')}` })
                  message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                    const autoresponderResponse = collected.first().content
                    collected.first().delete()
                    const autoresponderId = message.args[1] || makeId(12)
                    client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [message.guild.id, autoresponderId, autoresponderTrigger, autoresponderResponse], function (err) {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.legacy.success(message, getLocales(locale, 'AUTORESPONDER_CREATE_SUCCESS', { AUTORESPONDER_ID: autoresponderId }))
                    })
                  })
                })
              })
            } else {
              helpTray(message, locale)
            }
            break
          }
          case 'remove': {
            if (message.args[1]) {
              client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'AUTORESPONDER_REMOVE_SUCCESS', { AUTORESPONDER_ID: message.args[1] }))
              })
            } else {
              helpTray(message, locale)
            }
            break
          }
          default: {
            helpTray(message, locale)
            break
          }
        }
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}autoresponder <option>`, ['create (custom ID)', 'remove <ID>'])
}
