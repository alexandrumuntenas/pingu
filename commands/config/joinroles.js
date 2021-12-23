const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { Success, Status, Help } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')
const { addJoinRole, removeJoinRole, fetchJoinRoles } = require('../../modules/joinroles')

module.exports = {
  module: 'joinroles',
  name: 'joinroles',
  description: '⚙️ Manage join roles',
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
                if (itemsProcessed === roles.length) interaction.editReply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST', { ROLES: body }))] })
              })
            } else {
              interaction.editReply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST_NOROLES'))] })
            }
          } else {
            interaction.editReply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST_NOROLES'))] })
          }
        })
        break
      }
      case 'add': {
        addJoinRole(client, { guild: interaction.guild, role: interaction.options.getRole('role') }, () => interaction.editReply({ embeds: [Success(getLocales(locale, 'JOINROLES_ADD', { ROLE: interaction.options.getRole('role') }))] }))
        break
      }
      case 'remove': {
        removeJoinRole(client, { guild: interaction.guild, role: interaction.options.getRole('role') }, () => interaction.editReply({ embeds: [Success(getLocales(locale, 'JOINROLES_REMOVE', { ROLE: interaction.options.getRole('role') }))] }))
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
                  if (itemsProcessed === roles.length) message.reply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST', { ROLES: body }))] })
                })
              } else {
                message.reply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST_NOROLES'))] })
              }
            } else {
              message.reply({ embeds: [Status(getLocales(locale, 'JOINROLES_LIST_NOROLES'))] })
            }
          })
          break
        }
        case 'add': {
          if (message.mentions.roles.first()) {
            message.mentions.roles.forEach(role => addJoinRole(client, { guild: message.guild, role: role }, () => message.reply({ embeds: [Success(getLocales(locale, 'JOINROLES_ADD', { ROLE: role }))] })))
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'remove': {
          if (message.mentions.roles.first()) {
            message.mentions.roles.forEach(role => removeJoinRole(client, { guild: message.guild, role: role }, () => message.reply({ embeds: [Success(getLocales(locale, 'JOINROLES_REMOVE', { ROLE: role }))] })))
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        default: {
          message.reply({ embeds: [helpTray] })
          break
        }
      }
    } else {
      message.reply({ embeds: [helpTray] })
    }
  }
}

const helpTray = Help('joinroles', 'Manage join roles', [{ option: 'list', description: 'List the Join Roles', syntax: '', isNsfw: false }, { option: 'add', description: 'Add a new join role', syntax: '@myrole (@myrole2 ··>)', isNsfw: false }, { option: 'remove', description: 'Remove a join role', syntax: '@myrole (@myrole2 ··>)', isNsfw: false }])
