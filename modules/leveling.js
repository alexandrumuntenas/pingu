const Consolex = require('../functions/consolex')
const Database = require('../functions/databaseConnection')

const { getMember, updateMember } = require('../functions/memberManager')
const { getGuildConfig } = require('../functions/guildDataManager')
const CooldownManager = require('../functions/cooldownManager')

/**
 * Get experiece by chatting.
 * @param {Message} message
 */

module.exports.getExperience = message => {
  if (CooldownManager.check(message.member, message.guild, 'module.leveling.getexperience')) {
    CooldownManager.add(message.member, message.guild, { name: 'module.leveling.getexperience', cooldown: 60000 })
    getGuildConfig(message.guild, guildConfig => {
      getMember(message.member, memberData => {
        memberData.lvlExperience = parseInt(memberData.lvlExperience, 10) + Math.round((Math.random() * (25 - 15)) + 15)

        if (memberData.lvlExperience >= (((memberData.lvlLevel * memberData.lvlLevel) * guildConfig.leveling.difficulty) * 100)) {
          module.exports.sendLevelUpMessage(message)
          return updateMember(message.member, { lvlLevel: parseInt(memberData.lvlLevel, 10) + 1, lvlExperience: memberData.lvlExperience - (((memberData.lvlLevel * memberData.lvlLevel) * guildConfig.leveling.difficulty) * 100) })
        }

        try {
          updateMember(message.member, { lvlExperience: memberData.lvlExperience })
        } catch (err) {
          if (err) Consolex.handleError(err)
        }

        return null
      })
    })
  }
}

const reemplazarPlaceholdersConDatosReales = require('../functions/reemplazarPlaceholdersConDatosReales')

module.exports.sendLevelUpMessage = message => {
  getGuildConfig(message.guild, guildConfig => {
    if (guildConfig.leveling.enabled) {
      getMember(message, memberData => {
        const channelWhereLevelUpMessageIsSent = message.guild.channels.cache.get(guildConfig.leveling.channel)
        const content = reemplazarPlaceholdersConDatosReales(guildConfig.leveling.message || 'GG {player}, you just advanced to level {level}!', message.member, { newlevel: parseInt(memberData.lvlLevel, 10) + 1, oldlevel: parseInt(memberData.lvlLevel, 10) })

        if (channelWhereLevelUpMessageIsSent) {
          channelWhereLevelUpMessageIsSent.send({ content })
        } else {
          switch (guildConfig.leveling.channel) {
            case 'same': {
              message.reply({ content })
              break
            }
            case 'dm': {
              try {
                message.author.send({ content })
              } catch (err) {
                if (err) Consolex.debug('Error al intentar entregar mensaje de avance de nivel a un usuario')
              }
              break
            }
            default: {
              break
            }
          }
        }
      })
    }
  })
}

/**
 *  Get the guild leaderboard.
 * @param {Guild} guild
 * @param {Function} callback
 */

module.exports.getLeaderboard = (guild, callback) => {
  if (!callback) throw new Error('Callback is required.')

  Database.query('SELECT * FROM `memberData` WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC LIMIT 25', [guild.id], (err, members) => {
    if (err) Consolex.handleError(err)

    if (callback && members && Object.prototype.hasOwnProperty.call(members, '0')) {
      let memberCount = 0
      members.forEach(async member => {
        try {
          member.user = await process.Client.users.fetch(member.member) // skipcq: JS-0040
        } catch {
          member.user = { username: 'Mysterious User', discriminator: '0000' } // skipcq: JS-0040
        } finally {
          memberCount++
        }

        if (memberCount === members.length) return callback(members)
      })
    } else callback()
  })
}

const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const randomstring = require('randomstring')
const isValidUrl = require('is-valid-http-url')
const isImageUrl = require('is-image-url')
const hexToRgba = require('hex-rgba')
const { millify } = require('millify')

registerFont('./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf', {
  family: 'Montserrat'
})

function applyText (canvas, text, maxlimit) {
  const finalImageComposition = canvas.getContext('2d')
  let fontSize = maxlimit || 100

  do {
    finalImageComposition.font = `${(fontSize -= 1)}px "Montserrat SemiBold"`
  } while (finalImageComposition.measureText(text).width > canvas.width - 125)

  return finalImageComposition.font
}

// Code from https://stackoverflow.com/a/3368118/17821331
// Fix: Comprobar si se puede mejorar. ¡Eslint no para de gritar!
// eslint-disable-next-line max-params
function roundRect (finalImageComposition, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }

  if (typeof radius === 'undefined') {
    radius = 5
  }

  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    // eslint-disable-next-line guard-for-in
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }

  finalImageComposition.beginPath()
  finalImageComposition.moveTo(x + radius.tl, y)
  finalImageComposition.lineTo(x + width - radius.tr, y)
  finalImageComposition.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  finalImageComposition.lineTo(x + width, y + height - radius.br)
  finalImageComposition.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  )
  finalImageComposition.lineTo(x + radius.bl, y + height)
  finalImageComposition.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  finalImageComposition.lineTo(x, y + radius.tl)
  finalImageComposition.quadraticCurveTo(x, y, x + radius.tl, y)
  finalImageComposition.closePath()
  if (fill) {
    finalImageComposition.fill()
  }

  if (stroke) {
    finalImageComposition.stroke()
  }
}

/**
 * Generate the rank card of the member.
 * @param {GuildMember} member
 * @param {Function} callback
 * @returns {String} The path of the rank card.
 */

module.exports.generateRankCard = (member, callback) => {
  if (!callback) throw new Error('Callback is required.')

  getMember(member, async memberData => {
    const attachmentPath = `./modules/temp/${randomstring.generate({ charset: 'alphabetic' })}.png`

    const canvas = createCanvas(1100, 320)
    const finalImageComposition = canvas.getContext('2d')

    finalImageComposition.strokeStyle = 'rgba(0,0,0,0)'

    // Establecer fondo del canvas
    if (member.guild.configuration.leveling.card.background && isValidUrl(member.guild.configuration.leveling.card.background) && isImageUrl(member.guild.configuration.leveling.card.background)) {
      const background = await loadImage(member.guild.configuration.leveling.card.background)
      const scale = Math.max(
        canvas.width / background.width,
        canvas.height / background.height
      )
      finalImageComposition.drawImage(
        background,
        (canvas.width / 2) - ((background.width / 2) * scale),
        (canvas.height / 2) - ((background.height / 2) * scale),
        background.width * scale,
        background.height * scale
      )

      finalImageComposition.fillStyle = hexToRgba(
        member.guild.configuration.leveling.card.overlay.color || '#272934',
        member.guild.configuration.leveling.card.overlay.opacity || 50
      )
      roundRect(finalImageComposition, 16, 16, 1068, 290, 10, finalImageComposition.fillStyle, finalImageComposition.strokeStyle)
    } else {
      finalImageComposition.fillStyle = member.guild.configuration.leveling.card.overlay.color || '#272934'
      finalImageComposition.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Escribir usuario
    finalImageComposition.font = applyText(canvas, member.user.tag, 40)
    finalImageComposition.textAlign = 'left'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.8)'
    finalImageComposition.fillText(`${member.user.tag}`, 295, 180, 500)

    // Escribir nivel, experiencia y rango
    finalImageComposition.font = '50px "Montserrat SemiBold"'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.5)'
    finalImageComposition.textAlign = 'right'
    finalImageComposition.fillText(`Rank #${memberData.lvlRank}  Level ${millify(memberData.lvlLevel)}`, 1050, 100)

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(memberData.lvlExperience)} / ${millify(((memberData.lvlLevel * memberData.lvlLevel) * member.guild.configuration.leveling.difficulty) * 100)} XP`

    finalImageComposition.font = '30px "Montserrat SemiBold"'
    finalImageComposition.textAlign = 'right'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.8)'
    finalImageComposition.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)
    finalImageComposition.fillStyle = 'rgba(255,255,255, 0.3)'
    roundRect(finalImageComposition, 295, 200, 755, 70, 10, finalImageComposition.fillStyle, finalImageComposition.strokeStyle)

    // Añadir barra de progreso
    finalImageComposition.fillStyle = 'rgb(255,255,255)'
    roundRect(finalImageComposition, 295, 200, Math.abs(memberData.lvlExperience / (((memberData.lvlLevel * memberData.lvlLevel) * member.guild.configuration.leveling.difficulty) * 100)) * 755, 70, 10, finalImageComposition.fillStyle, finalImageComposition.strokeStyle)

    // Añadir avatar de usuario
    finalImageComposition.beginPath()
    finalImageComposition.arc(159, 159, 102, 0, Math.PI * 2, true)
    finalImageComposition.closePath()
    finalImageComposition.clip()

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    finalImageComposition.drawImage(avatar, 57, 57, 204, 204)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(attachmentPath, buffer)

    callback(attachmentPath)
  })
}

/**
 * Reset the leaderboard from the guild.
 * @param {Guild} guild
 * @param {Function} callback
 * @returns {?String} Error
 */

module.exports.resetLeaderboard = (guild, callback) => {
  if (!guild) throw new Error('Guild is required.')
  if (!callback) throw new Error('Callback is required.')

  Database.query('DELETE FROM memberData WHERE guild = ?', [guild.id], err => {
    if (err) {
      Consolex.handleError(err)
      return callback(err)
    }
    return callback(null)
  })
}
