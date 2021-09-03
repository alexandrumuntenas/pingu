const emojiStrip = require('emoji-strip')

module.exports = {
  main: (req, res, pool) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'LNV5Ljl')) {
      pool.query("UPDATE `guildData` SET `welcome_enabled` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    } else {
      pool.query("UPDATE `guildData` SET `welcome_enabled` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'AZGW50Tc4p')) {
      pool.query('UPDATE `guildData` SET `welcome_message` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.AZGW50Tc4p), req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'daLuxtTuG5')) {
      pool.query('UPDATE `guildData` SET `welcome_channel` = ? WHERE `guildData`.`guild` = ?', [emojiStrip(req.body.daLuxtTuG5), req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'vyKS7bC')) {
      pool.query("UPDATE `guildData` SET `welcome_image` = '1' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    } else {
      pool.query("UPDATE `guildData` SET `welcome_image` = '0' WHERE `guildData`.`guild` = ?", [req.user.Guild_ID])
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'nviCCd9jDc')) {
      const roles = new Set()
      if (Array.isArray(req.body.nviCCd9jDc)) {
        req.body.nviCCd9jDc.forEach(r => roles.add(r))
      } else {
        roles.add(req.body.nviCCd9jDc)
      }
      pool.query('UPDATE `guildData` SET `welcome_roles` = ? WHERE `guildData`.`guild` = ?', ['' + Array.from(roles) + '', req.user.Guild_ID])
    }
  }
}
