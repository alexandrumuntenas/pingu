const emojiStrip = require('emoji-strip')

module.exports = {
  main: (req, res, pool) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'QTMVmdD')) {
      pool.query("UPDATE `guildData` SET `leveling_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    } else {
      pool.query("UPDATE `guildData` SET `leveling_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'Q8xq8vO')) {
      pool.query('UPDATE `guildData` SET `leveling_rankup_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.Q8xq8vO), req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'ELMb9ge')) {
      pool.query('UPDATE `guildData` SET `leveling_rankup_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.ELMb9ge), req.user.Guild_ID])
    }
  }
}
