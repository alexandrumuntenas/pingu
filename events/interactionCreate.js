const { cooldown } = require('../functions/commands')
const genericMessages = require('../functions/genericMessages')
const guildFetchData = require('../functions/guildFetchData')

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
        genericMessages.error.permissionerror(interaction, interaction.database.guildLanguage || 'en')
        return
      }
      if (cooldown.check(interaction.member, interaction.guild, commandToExecute)) {
        cooldown.add(interaction.member, interaction.guild, commandToExecute)
        if (client.statcord) client.statcord.postCommand(commandToExecute.name, '000000000000000')
        await commandToExecute.executeInteraction(client, interaction.database.guildLanguage || 'en', interaction)
      } else {
        genericMessages.error.cooldown(interaction, interaction.database.guildLanguage || 'en', (parseInt(cooldown.ttl(interaction.member, interaction.guild, commandToExecute)) - Date.now()))
      }
    } else {
      interaction.editReply({ content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `deploy`.' })
    }
  })
}
