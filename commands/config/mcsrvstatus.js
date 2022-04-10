const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { updateGuildConfig } = require('../../functions/guildDataManager')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'mcsrvstatus',
  cooldown: 1000,
  description: '⚙️ Configure the Minecraft Server Status module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('setdefaulthost').setDescription('Set the default host for the Minecraft Server Status module').addStringOption(input => input.setName('host').setDescription('The host to use').setRequired(true)).addNumberOption(input => input.setName('port').setDescription('The port to use'))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setdefaulthost': {
        updateGuildConfig(interaction.guild, { column: 'mcsrvstatus', newconfig: { host: interaction.options.getString('host'), port: interaction.options.getNumber('port') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCSRVSTATUS::SETDEFAULTHOST:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'MCSRVSTATUS::SETDEFAULTHOST:SUCCESS', { HOST: interaction.options.getString('host') }))] })
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
