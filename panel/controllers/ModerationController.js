const emojiStrip = require('emoji-strip')

module.exports = {
  main: (req, res, pool) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'Y2adeog')) {
      pool.query("UPDATE `guildData` SET `moderator_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    } else {
      pool.query("UPDATE `guildData` SET `moderator_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    }
  },
  modules: {
    warnLimit: (req, res, pool) => {
      if (Object.prototype.hasOwnProperty.call(req.body, 'OxV1juz')) {
        pool.query("UPDATE `guildData` SET `moderator_warnLimit_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
      } else {
        pool.query("UPDATE `guildData` SET `moderator_warnLimit_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'DHLJ2YI')) {
        pool.query('UPDATE `guildData` SET `moderator_warnLimit_limit` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.DHLJ2YI), req.user.Guild_ID])
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'AkeMlvn')) {
        pool.query('UPDATE `guildData` SET `moderator_warnLimit_action` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.AkeMlvn), req.user.Guild_ID])
      }
    },
    noNSFWonSFW: (req, res, pool) => {
      if (Object.prototype.hasOwnProperty.call(req.body, 'VIIkgwa')) {
        pool.query("UPDATE `guildData` SET `moderator_noNsfwOnSfw_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
      } else {
        pool.query("UPDATE `guildData` SET `moderator_noNsfwOnSfw_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'r5Cl5vu')) {
        pool.query('UPDATE `guildData` SET `moderator_noNsfwOnSfw_action` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.r5Cl5vu), req.user.Guild_ID])
      }
    }
  }
}
