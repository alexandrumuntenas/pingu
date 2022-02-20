const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const {
  Success,
  Status,
  Help,
  Error
} = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const {
  addJoinRole,
  removeJoinRole,
  fetchJoinRoles
} = require('../../modules/joinroles')

module.exports = {
  module: 'joinroles',
  name: 'joinroles',
  description: '⚙️ Manage join roles',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('joinroles')
    .setDescription('Manage join roles')
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List the Join Roles')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a new join role')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to give')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a join role')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role to remove')
            .setRequired(true)
        )
    ),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'list': {
        fetchJoinRoles(client, interaction.guild, (roles) => {
          let itemsProcessed = 0
          let body = ''
          if (roles && Array.isArray(roles) && roles.length > 0) {
            roles.forEach((role) => {
              itemsProcessed++
              body = `${body} <@&${role.roleID}>`
              if (itemsProcessed === roles.length) {
                interaction.editReply({
                  embeds: [
                    Status(i18n(locale, 'JOINROLES::LIST', { ROLES: body }))
                  ]
                })
              }
            })
          } else {
            if (roles) {
              return interaction.editReply({
                embeds: [Error(i18n(locale, 'JOINROLES::LIST:ERROR'))]
              })
            }
            interaction.editReply({
              embeds: [Status(i18n(locale, 'JOINROLES::LIST:NOROLES'))]
            })
          }
        })
        break
      }
      case 'add': {
        addJoinRole(
          client,
          {
            guild: interaction.guild,
            role: interaction.options.getRole('role')
          },
          (err) => {
            if (err) {
              return interaction.editReply({
                embeds: [Error(i18n(locale, 'JOINROLES::ADD:ERROR'))]
              })
            }
            interaction.editReply({
              embeds: [
                Success(
                  i18n(locale, 'JOINROLES::ADD:SUCCESS', {
                    ROLE: interaction.options.getRole('role')
                  })
                )
              ]
            })
          }
        )
        break
      }
      case 'remove': {
        removeJoinRole(
          client,
          {
            guild: interaction.guild,
            role: interaction.options.getRole('role')
          },
          (err) => {
            if (err) {
              return interaction.editReply({
                embeds: [Error(i18n(locale, 'JOINROLES::REMOVE:ERROR'))]
              })
            }
            interaction.editReply({
              embeds: [
                Success(
                  i18n(locale, 'JOINROLES::REMOVE:ERROR', {
                    ROLE: interaction.options.getRole('role')
                  })
                )
              ]
            })
          }
        )
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help(
      'joinroles',
      i18n(locale, 'JOINROLES::HELPTRAY:DESCRIPTION'),
      [
        {
          option: 'list',
          description: i18n(locale, 'JOINROLES::HELPTRAY:OPTION:LIST'),
          syntax: 'list',
          isNsfw: false
        },
        {
          option: 'add',
          description: i18n(locale, 'JOINROLES::HELPTRAY:OPTION:ADD'),
          syntax: 'add @myrole (@myrole2 ··>)',
          isNsfw: false
        },
        {
          option: 'remove',
          description: i18n(locale, 'JOINROLES::HELPTRAY:OPTION:REMOVE'),
          syntax: 'remove @myrole (@myrole2 ··>)',
          isNsfw: false
        }
      ]
    )
    if (
      !(message.args && Object.prototype.hasOwnProperty.call(message.args, 0))
    ) { return message.reply({ embeds: [helpTray] }) }
    switch (message.args[0]) {
      case 'list': {
        fetchJoinRoles(client, message.guild, (roles) => {
          let itemsProcessed = 0
          let body = ''
          if (roles && Array.isArray(roles) && roles.length > 0) {
            roles.forEach((role) => {
              itemsProcessed++
              body = `${body} <@&${role.roleID}>`
              if (itemsProcessed === roles.length) {
                message.reply({
                  embeds: [
                    Status(i18n(locale, 'JOINROLES::LIST', { ROLES: body }))
                  ]
                })
              }
            })
          } else {
            if (roles) {
              return message.reply({
                embeds: [Error(i18n(locale, 'JOINROLES::LIST:ERROR'))]
              })
            }
            message.reply({
              embeds: [Status(i18n(locale, 'JOINROLES::LIST:NOROLES'))]
            })
          }
        })
        break
      }
      case 'add': {
        if (!message.mentions.roles.first()) { return message.reply({ embeds: [helpTray] }) }
        message.mentions.roles.forEach((role) =>
          addJoinRole(client, { guild: message.guild, role: role }, (err) => {
            if (err) {
              return message.reply({
                embeds: [Error(i18n(locale, 'JOINROLES::ADD:ERROR'))]
              })
            }
            message.reply({
              embeds: [
                Success(i18n(locale, 'JOINROLES::ADD:SUCCESS', { ROLE: role }))
              ]
            })
          })
        )
        break
      }
      case 'remove': {
        if (!message.mentions.roles.first()) { return message.reply({ embeds: [helpTray] }) }
        message.mentions.roles.forEach((role) =>
          removeJoinRole(
            client,
            { guild: message.guild, role: role },
            (err) => {
              if (err) {
                return message.reply({
                  embeds: [Success(i18n(locale, 'JOINROLES::REMOVE:ERROR'))]
                })
              }
              message.reply({
                embeds: [
                  Success(
                    i18n(locale, 'JOINROLES::REMOVE:SUCCESS', { ROLE: role })
                  )
                ]
              })
            }
          )
        )
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
