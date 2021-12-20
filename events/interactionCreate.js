const { cooldown } = require('../functions/commands')
const { Error } = require('../modules/constructor/messageBuilder')
const guildFetchData = require('../functions/guildFetchData')
const getLocales = require('../i18n/getLocales')
const humanizeduration = require('humanize-duration')

module.exports.isCommand = async (client, interaction) => {
  const { commandName } = interaction
  interaction.replyData = await interaction.deferReply({ fetchReply: true })
  if (
    interaction.channel.type === 'dm' ||
    interaction.author === client.user
  ) return
  guildFetchData(client, interaction.guild, async (guildData) => {
    interaction.database = guildData
    if (client.commands.has(commandName)) {
      const commandToExecute = client.commands.get(commandName)
      if (commandToExecute.permissions && !interaction.member.permissions.has(commandToExecute.permissions)) {
        interaction.editReply({ embeds: [Error(getLocales(interaction.database.guildLanguage || 'en', 'COMMAND_PERMISSION_ERROR'))] })
        return
      }
      if (cooldown.check(interaction.member, interaction.guild, commandToExecute)) {
        cooldown.add(interaction.member, interaction.guild, commandToExecute)
        if (client.statcord) client.statcord.postCommand(commandToExecute.name, '000000000000000')
        await commandToExecute.executeInteraction(client, interaction.database.guildLanguage || 'en', interaction)
      } else {
        interaction.editReply({ embeds: [Error(getLocales(interaction.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: interaction.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] })
      }
    } else {
      interaction.editReply({ content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `deploy`.' })
    }
  })
}
