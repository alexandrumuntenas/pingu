module.exports = (con, guild) => {
  con.query('DELETE FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) console.log(err)
    con.query('DELETE FROM `guildLevels` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guildWarns` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guildCustomCommands` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guildAutoResponder` WHERE guild = ?', [guild.id])
  })
}
