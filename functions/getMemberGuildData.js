module.exports = (client, member, callback) => {
  client.pool.query('SELECT * FROM `memberData` WHERE member = ? AND guild = ?', [member.id, member.guild.id], (err, result) => {
    if (err) client.logError(err)
    if (result && Object.prototype.hasOwnProperty.call(result, 0)) { if (callback) callback(result[0]) } else {
      client.pool.query('INSERT INTO `memberdata` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
        if (err) client.logError(err)
        module.exports(client, member, callback)
      })
    }
  })
}
