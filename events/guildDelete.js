module.exports = (con, guild) => {
  con.query('DELETE FROM `guild_data` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) console.log(err)
    con.query('DELETE FROM `guild_levels` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guild_warns` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guild_commands` WHERE guild = ?', [guild.id])
    con.query('DELETE FROM `guild_responses` WHERE guild = ?', [guild.id])
  })
}
