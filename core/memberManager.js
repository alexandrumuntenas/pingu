const consolex = require('../core/consolex')
const Database = require('../core/databaseManager')

/**
 * Get member data from the database.
 * @param {GuildMember} member - The Member to get the data for
 * @callback memberData - The member data
 */

module.exports.getMember = async (member) => {
  try {
    const [memberData] = await Database.execute('SELECT * FROM `memberData` WHERE member = ? AND guild = ?', [member.id, member.guild.id]).then(result => Object.prototype.hasOwnProperty.call(result, 0) ? result[0] : module.exports.createMember(member))
    // TODO: GET THIS OUT!
    Database.execute('SELECT member, ROW_NUMBER() OVER (ORDER BY CAST(lvlLevel AS unsigned) DESC, CAST(lvlExperience AS unsigned) DESC) AS lvlRank FROM memberData WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC', [member.guild.id], (err2, result) => {
      if (err2) consolex.gestionarError(err2)

      if (result && Object.prototype.hasOwnProperty.call(result, '0')) {
        result.filter(r => r.member === member.id).forEach(r => {
          memberData[0].lvlRank = r.lvlRank
        })

        return memberData[0]
      }
    })
  } catch (err) {
    consolex.gestionarError(err)
  }
}

/**
 * Create a new member entry in the database.
 * @param {GuildMember} member - The Member to create the data for
 */

module.exports.createMember = async (member) => {
  try {
    await Database.execute('INSERT INTO `memberData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id])
    return module.exports.getMember(member)
  } catch (err) {
    consolex.gestionarError(err)
  }
}

/**
 * Update the member's data from the database.
 * @param {GuildMember} member - The Member to update the data for
 * @param {Object} memberDataToUpdate - The data to update
 * @param {?String} memberDataToUpdate.lvlExperience - Member Experience
 * @param {?String} memberDataToUpdate.lvlLevel - Member Level
 * @param {?String} memberDataToUpdate.ecoBalance - Member Balance
 * @param {?Array} memberDataToUpdate.ecoInventory - Member Inventory
 */

module.exports.updateMember = async (member, memberDataToUpdate) => {
  module.exports.getMember(member).then(memberData => {
    Database.execute('UPDATE `memberData` SET `lvlLevel` = ?, `lvlExperience` = ? WHERE `guild` = ? AND `member` = ?', [memberDataToUpdate.lvlLevel || memberData.lvlLevel, memberDataToUpdate.lvlExperience || memberData.lvlExperience, member.guild.id, member.id])
      .catch(err => consolex.gestionarError(err))
      .then(() => {
        return module.exports.getMember(member)
      })
  })
}

/**
 * Delete a member's data from the database.
 * @param {Member} member
 */
module.exports.deleteMember = (member) => {
  try {
    Database.execute('DELETE FROM `memberData` WHERE `guild` = ? AND `member` = ?', [member.guild.id, member.id])
  } catch (err) {
    consolex.gestionarError(err)
  }
}
