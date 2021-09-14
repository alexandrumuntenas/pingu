module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [interaction.guild.id], async (err, result, rows) => {
    if (err) client.log.error(err)
    await interaction.deferReply({ ephemeral: true })

    const command = client.commands.get(interaction.commandName)

    interaction.database = result[0]

    if (!command) return

    try {
      await command.execute(client, result[0].guild_language || 'en', interaction, true)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  })
}
