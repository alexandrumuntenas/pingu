const { Collection } = require('discord.js')
const genericMessages = require('../functions/genericMessages')
const guildFetchData = require('../modules/guildFetchData')
const cooldown = new Collection()

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
      if (!cooldown.has(`${commandName}${interaction.member.id}${interaction.guild.id}`)) {
        cooldown.set(`${commandName}${interaction.member.id}${interaction.guild.id}`, (Date.now() + parseInt(client.commands.get(commandName).cooldown || 10000)))
        setTimeout(() => {
          cooldown.delete(`${commandName}${interaction.member.id}${interaction.guild.id}`)
        }, client.commands.get(commandName).cooldown || 10000)
        await client.commands.get(commandName).executeInteraction(client, interaction.database.guildLanguage || 'en', interaction)
      } else {
        const cooldownTime = cooldown.get(`${commandName}${interaction.member.id}${interaction.guild.id}`)
        genericMessages.legacy.error.cooldown(interaction, interaction.database.guildLanguage || 'en', (parseInt(cooldownTime) - Date.now()))
      }
    } else {
      interaction.editReply({ content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `deploy`.' })
    }
  })
}
