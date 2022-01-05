const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const StackBlur = require('stackblur-canvas')
const randomstring = require('randomstring')
const isValidUrl = require('is-valid-http-url')
const isImageUrl = require('is-image-url')
const { millify } = require('millify')
const hexToRgba = require('hex-to-rgba')

registerFont('./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf', { family: 'Montserrat' })
module.exports = {
  welcomeCard: async (client, member, locale, database) => {
    const uniqueIdentifiers = {
      userAvatar: randomstring.generate({ charset: 'alphabetic' }),
      attachmentSent: randomstring.generate({ charset: 'alphabetic' })
    }

    const paths = {
      attachmentSent: `./modules/temp/${uniqueIdentifiers.attachmentSent}.png`
    }

    const canvas = createCanvas(1100, 500)
    const ctx = canvas.getContext('2d')

    // Establecer fondo del canvas
    let imgPath = ''
    if (database.welcomeImageCustomBackground && isValidUrl(database.welcomeImageCustomBackground) && isImageUrl(database.welcomeImageCustomBackground)) {
      imgPath = database.welcomeImageCustomBackground
      const background = await loadImage(imgPath)
      const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
      ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)

      // Establecer blured overlay
      ctx.fillStyle = hexToRgba(database.welcomeImageCustomOverlayColor || '#272934', (database.welcomeImageCustomOpacity / 100))
      ctx.fillRect(25, 25, 1050, 450)
      StackBlur.canvasRGBA(canvas, 25, 25, 1050, 450, database.welcomeImageCustomBlur)
    } else {
      ctx.fillStyle = '#272934'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const joinText = `${member.user.tag} just joined the server`
    const memberCountText = `Member #${member.guild.memberCount}`

    ctx.font = applyText(canvas, joinText)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(joinText, canvas.width / 2, 350)

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(memberCountText, canvas.width / 2, 425)

    // Añadir avatar de usuario

    if (database.welcomeImageRoundAvatar === 1) {
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 160, 100, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
    }

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    ctx.drawImage(avatar, canvas.width / 2 - 100, 60, 200, 200)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  },
  rankCard: async (client, member, locale, database) => {
    const uniqueIdentifiers = {
      userAvatar: randomstring.generate({ charset: 'alphabetic' }),
      attachmentSent: randomstring.generate({ charset: 'alphabetic' })
    }

    const paths = {
      attachmentSent: `./modules/temp/${uniqueIdentifiers.attachmentSent}.png`
    }

    const canvas = createCanvas(1100, 320)
    const ctx = canvas.getContext('2d')

    // Establecer fondo del canvas
    let imgPath = ''
    if (database.levelsImageCustomBackground && isValidUrl(database.levelsImageCustomBackground) && isImageUrl(database.levelsImageCustomBackground)) {
      imgPath = database.levelsImageCustomBackground
      const background = await loadImage(imgPath)
      const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
      ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)

      // Establecer blured overlay
      ctx.fillStyle = hexToRgba(database.levelsImageCustomOverlayColor || '#272934', (database.levelsImageCustomOpacity / 100))
      ctx.fillRect(25, 25, 1050, 270)
      StackBlur.canvasRGBA(canvas, 25, 25, 1050, 270, database.levelsImageCustomBlur)
      /* Next Release: 22T2
      ctx.fillRect(25, 25, 1050, 250)
      StackBlur.canvasRGBA(canvas, 25, 25, 1050, 250, database.levelsImageCustomBlur)
      */
    } else {
      ctx.fillStyle = '#272934'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Escribir usuario
    ctx.font = applyText(canvas, member.tag, 40)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(`${member.tag}`, 295, 180, 500)

    // Escribir nivel, experiencia y rango

    ctx.font = '50px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText(`Rank #${member.levelData.rank}  Level ${millify(member.levelData.memberLevel)}`, 1050, 100)

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(member.levelData.memberExperience)} / ${millify(((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)} XP`

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)

    ctx.fillStyle = 'rgba(255,255,255, 0.3)'
    ctx.fillRect(295, 200, 755, 70)

    // Añadir barra de progreso

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(295, 200, (Math.abs((member.levelData.memberExperience) / (((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)) * 1100), 70)

    // Escribir progreso actual (porcentaje)

    /* Next Release: 22T2
    ctx.fillStyle = 'rgba(255,255,255, 0.4)'
    ctx.fillRect(0, 300, 1100, 20)

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(0, 300, (Math.abs((member.levelData.memberExperience) / (((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)) * 1100), 20)

    */

    // Añadir avatar de usuario

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    ctx.drawImage(avatar, 50, 50, 220, 220)
    /* Next Release: 22T2
    ctx.drawImage(avatar, 50, 50, 200, 200)
    */

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  }
}

const applyText = (canvas, text, maxlimit) => {
  const ctx = canvas.getContext('2d')
  let fontSize = maxlimit || 100

  do {
    ctx.font = `${fontSize -= 1}px "Montserrat SemiBold"`
  } while (ctx.measureText(text).width > canvas.width - 125)

  return ctx.font
}
