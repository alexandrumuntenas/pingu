const Consolex = require('../core/consolex')
const Database = require('../functions/databaseConnection')

/**
 * Get member data from the database.
 * @param {GuildMember} member - The Member to get the data for
 * @param {Function} callback - The callback function
 * @callback memberData - The member data
 */

module.exports.getMember = (member, callback) => {
  if (!callback) throw Error('You didn\'t provide a callback.')

  Database.query('SELECT * FROM `memberData` WHERE member = ? AND guild = ?', [member.id, member.guild.id], (err, memberData) => {
    if (err) Consolex.gestionarError(err)

    if (memberData && Object.prototype.hasOwnProperty.call(memberData, 0)) { //! THIS SECTION HAS TO BE REMOVED AND SPLIT IN THE FUTURE
      Database.query('SELECT member, ROW_NUMBER() OVER (ORDER BY CAST(lvlLevel AS unsigned) DESC, CAST(lvlExperience AS unsigned) DESC) AS lvlRank FROM memberData WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC', [member.guild.id], (err2, result) => {
        if (err2) Consolex.gestionarError(err2)

        if (result && Object.prototype.hasOwnProperty.call(result, '0')) {
          result.filter(r => r.member === member.id).forEach(r => {
            memberData[0].lvlRank = r.lvlRank
          })

          callback(memberData[0])
        }
      })
    } else {
      module.exports.createMember(member, () => {
        module.exports.getMember(member, callback)
      })
    }
  })
}

/**
 * Create a new member entry in the database.
 * @param {GuildMember} member - The Member to create the data for
 * @param {Function} callback - The callback function
 */

module.exports.createMember = (member, callback) => {
  Database.query('INSERT INTO `memberData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], err => {
    if (err) Consolex.gestionarError(err)

    if (callback) callback()
  })
}

/**
 * Update the member's data from the database.
 * @param {GuildMember} member - The Member to update the data for
 * @param {Object} memberDataToUpdate - The data to update
 * @param {?String} memberDataToUpdate.lvlExperience - Member Experience
 * @param {?String} memberDataToUpdate.lvlLevel - Member Level
 * @param {?String} memberDataToUpdate.ecoBalance - Member Balance
 * @param {?Array} memberDataToUpdate.ecoInventory - Member Inventory
 * @param {Function} callback - The callback function
 */

module.exports.updateMember = (member, memberDataToUpdate, callback) => {
  if (!memberDataToUpdate) throw Error('You didn\' provide any data to update.')

  module.exports.getMember(member, memberData => {
    Database.query('UPDATE `memberData` SET `lvlLevel` = ?, `lvlExperience` = ? WHERE `guild` = ? AND `member` = ?', [memberDataToUpdate.lvlLevel || memberData.lvlLevel, memberDataToUpdate.lvlExperience || memberData.lvlExperience, member.guild.id, member.id], err => {
      if (err) Consolex.gestionarError(err)

      if (callback) callback()
    })
  })
}

/**
 * Delete a member's data from the database.
 * @param {Member} member
 * @param {Function} callback
 */
module.exports.deleteMember = (member, callback) => {
  Database.query('DELETE FROM `memberData` WHERE `guild` = ? AND `member` = ?', [member.guild.id, member.id], err => {
    if (err) Consolex.gestionarError(err)

    if (callback) callback()
  })
}
