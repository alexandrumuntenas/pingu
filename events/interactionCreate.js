const { cooldown } = require('../functions/commands')
const genericMessages = require('../functions/genericMessages')
const guildFetchData = require('../modules/guildFetchData')

module.exports.isCommand = async (client, interaction) => {
  const { commandName } = interaction
  await interaction.deferReply()
  if (
    interaction.channel.type === 'dm' ||
    interaction.author === client.user
  ) return
  guildFetchData(client, interaction.guild, async (guildData) => {
    interaction.database = guildData
    if (client.commands.has(commandName)) {
      const commandToExecute = client.commands.get(commandName)
      if (interaction.member.permissions.has(commandToExecute.permissions)) {
        if (cooldown.check(interaction.member, interaction.guild, commandToExecute)) {
          cooldown.add(interaction.member, interaction.guild, commandToExecute)
          await commandToExecute.executeInteraction(client, interaction.database.guildLanguage || 'en', interaction)
        } else {
          genericMessages.error.cooldown(interaction, interaction.database.guildLanguage || 'en', (parseInt(cooldown.ttl(interaction.member, interaction.guild, commandToExecute)) - Date.now()))
        }
      } else {
        genericMessages.error.permissionerror(interaction, interaction.database.guildLanguage || 'en')
      }
    } else {
      interaction.editReply({ content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `deploy`.' })
    }
  })
}
