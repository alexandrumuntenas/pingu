/**
 * Give all the configured roles to the new member
 * @param {GuildMember} member
 */

const { getGuildConfig, updateGuildConfig } = require('../functions/guildDataManager')

module.exports.giveMemberRoles = member => {
  getGuildConfig(member.guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'welcome') && Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'enabled')) {
      if (Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'roles')) {
        if (guildConfig.welcome.roles.length > 0) {
          guildConfig.welcome.roles.forEach(role => {
            const roleToGive = member.guild.roles.cache.get(role)
            if (roleToGive) member.roles.add(roleToGive)
          })
        }
      }
    }
  })
} // All this function was made by GH Copilot

const { MessageAttachment } = require('discord.js')

/**
 * Send the welcome message to the channel configured in the guild
 * @param {GuildMember} member
 */

const replaceBracePlaceholdersWithActualData = require('../functions/reemplazarPlaceholdersConDatosReales')

module.exports.sendWelcomeMessage = member => {
  getGuildConfig(member.guild, guildConfig => {
    if (!Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'channel')) return

    const channel = member.guild.channels.cache.get(guildConfig.welcome.channel)

    if (!channel) return

    const message = { content: replaceBracePlaceholdersWithActualData(guildConfig.welcome.message || '{member} joined {server}!', member) }

    if (Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'card') && Object.prototype.hasOwnProperty.call(guildConfig.welcome.card, 'enabled') && guildConfig.welcome.card.enabled) {
      module.exports.generateWelcomeCard(member, paths => {
        message.files = [new MessageAttachment(paths.attachmentSent)]
      })
    }

    channel.send(message)
  })
}

const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const randomstring = require('randomstring')
const isValidUrl = require('is-valid-http-url')
const isImageUrl = require('is-image-url')
const hexToRgba = require('hex-rgba')

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
 * Create the member welcome card
 * @param {GuildMember} member
 * @param {Function} callback
 */

module.exports.generateWelcomeCard = async (member, callback) => {
  const attachmentPath = `./modules/temp/${randomstring.generate({ charset: 'alphabetic' })}.png`

  const canvas = createCanvas(1100, 500)
  const finalImageComposition = canvas.getContext('2d')

  finalImageComposition.strokeStyle = 'rgba(0,0,0,0)'

  if (member.guild.configuration.welcome.welcomecard.background && isValidUrl(member.guild.configuration.welcome.welcomecard.background) && isImageUrl(member.guild.configuration.welcome.welcomecard.background)) {
    const background = await loadImage(member.guild.configuration.welcome.welcomecard.background)
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
      member.guild.configuration.welcome.welcomecard.overlay.color || '#272934',
      member.guild.configuration.welcome.welcomecard.overlay.opacity || 50
    )
    roundRect(finalImageComposition, 25, 25, 1050, 450, 10, finalImageComposition.fillStyle, finalImageComposition.strokeStyle)
  } else {
    finalImageComposition.fillStyle = member.guild.configuration.welcome.welcomecard.overlay.color || '#272934'
    finalImageComposition.fillRect(0, 0, canvas.width, canvas.height)
  }

  const title = replaceBracePlaceholdersWithActualData(member.guild.configuration.welcome.welcomecard.title || '{user.tag} just joined the server', member)
  const subtitle = replaceBracePlaceholdersWithActualData(member.guild.configuration.welcome.welcomecard.subtitle || 'Member #{guild.member_count}', member)

  finalImageComposition.font = applyText(canvas, title)
  finalImageComposition.fillStyle = '#ffffff'
  finalImageComposition.textAlign = 'center'
  finalImageComposition.fillText(title, canvas.width / 2, 387)

  finalImageComposition.font = applyText(canvas, subtitle, 30)
  finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.8)'
  finalImageComposition.fillText(subtitle, canvas.width / 2, 437)

  // Añadir avatar de usuario
  finalImageComposition.beginPath()
  finalImageComposition.arc(canvas.width / 2, 175, 125, 0, Math.PI * 2, true)
  finalImageComposition.closePath()
  finalImageComposition.strokeStyle = 'white'
  finalImageComposition.lineWidth = 10
  finalImageComposition.stroke()
  finalImageComposition.beginPath()
  finalImageComposition.arc(canvas.width / 2, 175, 100, 0, Math.PI * 2, true)
  finalImageComposition.closePath()
  finalImageComposition.clip()

  const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
  finalImageComposition.drawImage(avatar, (canvas.width / 2) - 100, 75, 200, 200)

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(attachmentPath, buffer)

  callback(attachmentPath)
}

/**
 * Do all the stuff that should be done when a member joins the guild
 * @param {GuildMember} member
 */

module.exports.doGuildMemberAdd = member => {
  getGuildConfig(member.guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'welcome') && Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'enabled')) {
      if (guildConfig.welcome.enabled) {
        module.exports.giveMemberRoles(member)
        module.exports.sendWelcomeMessage(member)
      }
    }
  })
}

module.exports.addJoinRole = (guild, role, callback) => {
  getGuildConfig(guild, guildConfig => {
    if (guildConfig.welcome.roles) {
      const { roles } = guildConfig.welcome

      roles.push(`${role.id}`)

      updateGuildConfig(guild, { column: 'welcome', newconfig: { roles } }, err => {
        if (err && callback) callback(err)
      })
    } else {
      const roles = [`${role.id}`]

      updateGuildConfig(guild, { column: 'welcome', newconfig: { roles } }, err => {
        if (err && callback) callback(err)
      })
    }

    if (callback) callback()
  })
}

module.exports.removeJoinRole = (guild, role, callback) => {
  getGuildConfig(guild, guildConfig => {
    if (guildConfig.welcome.roles) {
      delete guildConfig.welcome.roles[`${role.id}`]

      updateGuildConfig(guild, { column: 'welcome', newconfig: { roles: guildConfig.welcome.roles } }, err => {
        if (err && callback) callback(err)
      })
    }

    if (callback) callback()
  })
}
