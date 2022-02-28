const Consolex = require('../functions/consolex')
const CooldownManager = require('../functions/cooldownManager')

const { error, timer } = require('../functions/defaultMessages')
const { getGuildConfigNext } = require('../functions/guildDataManager.js')
const i18n = require('../i18n/i18n')
const humanizeduration = require('humanize-duration')

async function isCommand (interaction) {
  if (
    interaction.channel.type === 'dm' ||
    interaction.author === process.Client.user
  ) {
    return
  }

  interaction.deferReply = await interaction.deferReply({ fetchReply: true })
  getGuildConfigNext(interaction.guild, async guildConfig => {
    interaction.guild.configuration = guildConfig
    if (process.Client.commands.has(interaction.commandName)) {
      const interactionToRun = process.Client.commands.get(interaction.commandName)

      if (interactionToRun.module && !guildConfig[interactionToRun.module].enabled) {
        return interaction.editReply({ embeds: [error(i18n(interaction.guild.configuration.language || 'es', 'COMMAND::NOT_ENABLED'))] })
      }

      if (interactionToRun.permissions && !interaction.member.permissions.has(interactionToRun.permissions)) {
        interaction.editReply({ embeds: [error(i18n(interaction.guild.configuration.language || 'es', 'COMMAND::PERMISSION_ERROR'))] })
        return
      }

      if (CooldownManager.check(interaction.member, interaction.guild, interactionToRun.name)) {
        CooldownManager.add(interaction.member, interaction.guild, interactionToRun)

        await interactionToRun.runInteraction(interaction.guild.configuration.common.language || 'es', interaction)
      } else {
        interaction.editReply({ embeds: [timer(i18n(interaction.guild.configuration.language || 'es', 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(interaction.member, interaction.guild, interactionToRun.name), { round: true, language: interaction.guild.configuration.common.language || 'en', fallbacks: ['en'] }) }))] })
      }
    } else {
      interaction.editReply({ content: i18n(interaction.guild.configuration.common.language || 'es', 'COMMAND::NOT_FOUND') })
    }
  })
}

module.exports = {
  name: 'interactionCreate',
  execute: async interaction => {
    if (interaction.isCommand()) {
      isCommand(interaction).catch(Consolex.handleError)
    }
  }
}
