const emojiStrip = require('emoji-strip')

module.exports = {
  main: (req, res, pool) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'noLp3EI')) {
      pool.query("UPDATE `guildData` SET `farewell_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    } else {
      pool.query("UPDATE `guildData` SET `farewell_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'pfeZmgU')) {
      pool.query('UPDATE `guildData` SET `farewell_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.pfeZmgU), req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'tKDIdy1')) {
      pool.query('UPDATE `guildData` SET `farewell_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.tKDIdy1), req.user.Guild_ID])
    }
  }
}
