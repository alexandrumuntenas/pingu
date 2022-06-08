const consolex = require('../core/consolex')
const CooldownManager = require('../core/cooldownManager')

const { plantillas } = require('../core/messageManager')
const { obtenerConfiguracionDelServidor } = require('../core/guildManager.js')
const i18n = require('../core/i18nManager')
const humanizeduration = require('humanize-duration')

async function isChatInputCommand (interaction) {
  if (interaction.channel.type === 'dm' || interaction.author === Client.user) return

  interaction.deferredReply = await interaction.deferReply({ fetchReply: true }) // skipcq: JS-0040
  obtenerConfiguracionDelServidor(interaction.guild).then(async configuracionDelServidor => {
    interaction.guild.configuration = configuracionDelServidor
    if (Client.comandos.has(interaction.commandName)) {
      const interactionToRun = Client.comandos.get(interaction.commandName)

      if (interactionToRun.module && !configuracionDelServidor[interactionToRun.module].enabled) {
        return interaction.editReply({ embeds: [plantillas.error(i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::NOT_ENABLED'))] })
      }

      if (interactionToRun.permissions && !interaction.member.permissions.has(interactionToRun.permissions)) {
        return interaction.editReply({ embeds: [plantillas.error(i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::PERMISSION_ERROR'))] })
      }

      if (CooldownManager.check(interaction.member, interaction.guild, interactionToRun.name)) {
        CooldownManager.add(interaction.member, interaction.guild, interactionToRun)

        await interactionToRun.runInteraction(interaction)
      } else {
        return interaction.editReply({ embeds: [plantillas.contador(i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(interaction.member, interaction.guild, interactionToRun.name), { round: true, language: interaction.guild.configuration.common.language || 'en-US', fallbacks: ['en-US'] }) }))] })
      }
    } else {
      return interaction.editReply({ content: i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::NOT_FOUND') })
    }
  })
}

module.exports = {
  name: 'interactionCreate',
  execute: async interaction => { // skipcq: JS-0116
    if (interaction.isCommand()) {
      isChatInputCommand(interaction).catch(consolex.gestionarError)
    }
  }
}