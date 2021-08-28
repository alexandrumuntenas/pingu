module.exports = (con, guild) => {
  const chx = guild.channels.cache.filter(chx => chx.type === 'text').find(x => x.position === 0)
  con.query('SELECT * FROM `guildData` WHERE `guild` LIKE ?', [guild.id], (err, result) => {
    if (err) console.log(err)
    if (!result[0]) {
      con.query('INSERT INTO `guildData` (`guild`, `guild_prefix`,`guild_language`,`welcome_channel`,`welcome_message`,`farewell_channel`,`farewell_message`,`leveling_rankup_channel`,`leveling_rankup_message`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [guild.id, '/', 'en', chx.id, 'Bienvenido {user} a {server}', chx.id, '¡Adiós {user}!', chx.id, 'GG! {user} ha subido al nivel {nivel-nuevo}'], (err, result) => {
        if (err) console.log(err)
      })
    }
  })
}
