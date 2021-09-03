module.exports = {
  main: (req, res, pool) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'EEScEqQw')) {
      pool.query('UPDATE `guildData` SET `guild_prefix` = ? WHERE `guild` = ?', [req.body.EEScEqQw, req.user.Guild_ID])
    } else {
      pool.query('UPDATE `guildData` SET `guild_prefix` = ? WHERE `guild` = ?', ['!', req.user.Guild_ID])
    }
  }
}
