const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const { addJoinRole, removeJoinRole, fetchJoinRoles } = require('../../modules/joinroles')

module.exports = {
  name: 'joinroles',
  description: 'Manage join roles',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('joinroles')
    .setDescription('Manage join roles')
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List the Join Roles'))
    .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a new join role').addRoleOption(option => option.setName('role').setDescription('Role to give').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a join role').addRoleOption(option => option.setName('role').setDescription('Role to remove').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'list': {
        fetchJoinRoles(client, interaction.guild, (roles) => {
          let itemsProcessed = 0
          let body = ''
          if (roles && Array.isArray(roles)) {
            if (roles.length > 0) {
              roles.forEach(role => {
                itemsProcessed++
                body = `${body} <@&${role.roleID}>`
                if (itemsProcessed === roles.length) genericMessages.info.status(interaction, getLocales(locale, 'JOINROLES_LIST', { ROLES: body }))
              })
            } else {
              genericMessages.info.status(interaction, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
            }
          } else {
            genericMessages.info.status(interaction, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
          }
        })
        break
      }
      case 'add': {
        addJoinRole(client, { guild: interaction.guild, role: interaction.options.getRole('role') }, () => genericMessages.success(interaction, getLocales(locale, 'JOINROLES_ADD', { ROLE: interaction.options.getRole('role') })))
        break
      }
      case 'remove': {
        removeJoinRole(client, { guild: interaction.guild, role: interaction.options.getRole('role') }, () => genericMessages.success(interaction, getLocales(locale, 'JOINROLES_REMOVE', { ROLE: interaction.options.getRole('role') })))
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'list': {
          fetchJoinRoles(client, message.guild, (roles) => {
            let itemsProcessed = 0
            let body = ''
            if (roles && Array.isArray(roles)) {
              if (roles.length > 0) {
                roles.forEach(role => {
                  itemsProcessed++
                  body = `${body} <@&${role.roleID}>`
                  if (itemsProcessed === roles.length) genericMessages.legacy.Info.status(message, getLocales(locale, 'JOINROLES_LIST', { ROLES: body }))
                })
              } else {
                genericMessages.legacy.Info.status(message, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
              }
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
            }
          })
          break
        }
        case 'add': {
          if (message.mentions.roles.first()) {
            message.mentions.roles.forEach(role => addJoinRole(client, { guild: message.guild, role: role }, () => genericMessages.legacy.success(message, getLocales(locale, 'JOINROLES_ADD', { ROLE: role }))))
          } else {
            helpTray(message, locale)
          }
          break
        }
        case 'remove': {
          if (message.mentions.roles.first()) {
            message.mentions.roles.forEach(role => removeJoinRole(client, { guild: message.guild, role: role }, () => genericMessages.legacy.success(message, getLocales(locale, 'JOINROLES_REMOVE', { ROLE: role }))))
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
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}joinroles <option>`, ['list', 'add @myrole (@myrole2 ··>)', 'remove @myrole (@myrole2 ··>)'])
}
