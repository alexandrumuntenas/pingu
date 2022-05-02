const Consolex = require('../functions/consolex')
const CooldownManager = require('../functions/cooldownManager')

const { plantillas } = require('../functions/messageManager')
const { obtenerConfiguracionDelServidor } = require('../functions/guildManager.js')
const i18n = require('../i18n/i18n')
const humanizeduration = require('humanize-duration')

async function isCommand (interaction) {
  if (interaction.channel.type === 'dm' || interaction.author === process.Client.user) return

  interaction.deferredReply = await interaction.deferReply({ fetchReply: true }) // skipcq: JS-0040
  obtenerConfiguracionDelServidor(interaction.guild, async guildConfig => {
    interaction.guild.configuration = guildConfig
    if (process.Client.comandos.has(interaction.commandName)) {
      const interactionToRun = process.Client.comandos.get(interaction.commandName)

      if (interactionToRun.module && !guildConfig[interactionToRun.module].enabled) {
        return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.configuration.language, 'COMMAND::NOT_ENABLED'))] })
      }

      if (interactionToRun.permissions && !interaction.member.permissions.has(interactionToRun.permissions)) {
        return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.configuration.language, 'COMMAND::PERMISSION_ERROR'))] })
      }

      if (CooldownManager.check(interaction.member, interaction.guild, interactionToRun.name)) {
        CooldownManager.add(interaction.member, interaction.guild, interactionToRun)

        await interactionToRun.runInteraction(interaction.guild.configuration.common.language, interaction)
      } else {
        return interaction.editReply({ embeds: [plantillas.contador(i18n(interaction.guild.configuration.common.language, 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(interaction.member, interaction.guild, interactionToRun.name), { round: true, language: interaction.guild.configuration.common.language || 'en-US', fallbacks: ['en-US'] }) }))] })
      }
    } else {
      return interaction.editReply({ content: i18n(interaction.guild.configuration.common.language, 'COMMAND::NOT_FOUND') })
    }
  })
}

module.exports = {
  name: 'interactionCreate',
  execute: async interaction => { // skipcq: JS-0116
    if (interaction.isCommand()) {
      isCommand(interaction).catch(Consolex.gestionarError)
    }
  }
}
