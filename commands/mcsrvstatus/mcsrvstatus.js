const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  name: 'mcsrvstatus',
  cooldown: 1000,
  description: '⚙️ Configure the Minecraft Server Status module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('setdefaulthost').setDescription('Set the default host for the Minecraft Server Status module').addStringOption(input => input.setName('host').setDescription('The host to use').setRequired(true)).addNumberOption(input => input.setName('port').setDescription('The port to use')))
    .addSubcommand(sc => sc.setName('setpanelchannel').setDescription('Set the channel where the Minecraft Server Status panel will be sent').addChannelOption(input => input.setName('channel').setDescription('The channel where to post updates').setRequired(true).addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
    .addSubcommand(sc => sc.setName('sidebarplayercount').setDescription('Set the sidebar player count channel').addChannelOption(input => input.setName('channel').setDescription('The channel where to post updates').setRequired(true).addChannelTypes([ChannelType.GuildVoice, ChannelType.GuildStageVoice]))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setdefaulthost': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'mcsrvstatus', newconfig: { host: interaction.options.getString('host'), port: interaction.options.getNumber('port') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCSRVSTATUS::SETDEFAULTHOST:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'MCSRVSTATUS::SETDEFAULTHOST:SUCCESS', { HOST: interaction.options.getString('host') }))] })
        })
        break
      }
      case 'setpanelchannel': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'mcsrvstatus', newconfig: { messagePanelChannel: interaction.options.getChannel('channel').id } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCSRVSTATUS::SETPANELCHANNEL:ERROR'))] })
          interaction.options.getChannel('channel').send('<:Blurple_verified_plain:938094790132764682> ').then(msg => {
            actualizarConfiguracionDelServidor(interaction.guild, { column: 'mcsrvstatus', newconfig: { messagePanelId: msg.id } }, err => {
              if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCSRVSTATUS::SETPANELCHANNEL:ERROR'))] })
            })
          })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'MCSRVSTATUS::SETPANELCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'sidebarplayercount': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'mcsrvstatus', newconfig: { sidebarPlayercount: interaction.options.getChannel('channel').id } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCSRVSTATUS::SIDEBARPLAYERCOUNT:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'MCSRVSTATUS::SIDEBARPLAYERCOUNT:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
