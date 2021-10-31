const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const StackBlur = require('stackblur-canvas')
const randomstring = require('randomstring')
const getLocales = require('./getLocales')
const isValidUrl = require('is-valid-http-url')
const { millify } = require('millify')

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
    if (database.welcomeImageCustomBackground && isValidUrl(database.welcomeImageCustomBackground)) {
      imgPath = database.welcomeImageCustomBackground
    } else {
      imgPath = `./modules/sources/defaultBackgrounds/${database.welcomeImageBackground || 1}.png`
    }
    const background = await loadImage(imgPath)
    const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
    ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)

    // Establecer blured overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${database.welcomeImageCustomOpacity / 100})`
    ctx.fillRect(25, 25, 1050, 450)
    StackBlur.canvasRGBA(canvas, 25, 25, 1050, 450, database.welcomeImageCustomBlur)

    const joinText = getLocales(locale, 'GUILDMEMBERADD_USER_HAS_JOINED_THE_GUILD', { USER: member.user.tag })
    const memberCountText = getLocales(locale, 'GUILDMEMBERADD_MEMBER_COUNT', { COUNT: member.guild.memberCount })

    ctx.font = applyText(canvas, joinText)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(joinText, canvas.width / 2, 350)

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(memberCountText, canvas.width / 2, 425)

    // Añadir backdrop en avatar de usuario

    if (database.welcomeImageRoundAvatar === 1) {
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 160, 110, 0, Math.PI * 2, true) // 110 es el radio de la figura
      ctx.closePath()
      ctx.clip()
    }

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(canvas.width / 2 - 110, 50, 220, 220) // canvas.width - 110 para obtener el centrado de la figura

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
    if (database.levelsImageCustomBackground && isValidUrl(database.levelsImageCustomBackground)) {
      imgPath = database.levelsImageCustomBackground
    } else {
      imgPath = `./modules/sources/defaultBackgrounds/${database.levelsImageBackground || 1}.png`
    }
    const background = await loadImage(imgPath)
    const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
    ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)

    // Establecer blured overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${database.levelsImageCustomOpacity / 100})`
    ctx.fillRect(25, 25, 1050, 270)
    StackBlur.canvasRGBA(canvas, 25, 25, 1050, 270, database.levelsImageCustomBlur)

    // Escribir usuario

    ctx.font = applyText(canvas, member.tag, 40)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(`${member.tag}`, 295, 180)

    // Escribir nivel

    ctx.font = '180px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText(millify(member.levelData.memberLevel), 1050, 180)

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(member.levelData.memberExperience)} / ${millify(((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)}`

    ctx.font = '40px "Montserrat SemiBold"'
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(actualVSrequired, 1025, 250)

    // Añadir barra de progreso (backdrop)

    ctx.fillStyle = 'rgba(255,255,255, 0.3)'
    ctx.fillRect(295, 200, 755, 70)

    // Añadir barra de progreso

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(295, 200, Math.round((member.levelData.memberExperience * 100) / 755), 70)

    // Añadir backdrop en avatar de usuario

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(50, 50, 220, 220) // canvas.width - 110 para obtener el centrado de la figura

    // Añadir avatar de usuario

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    ctx.drawImage(avatar, 60, 60, 200, 200)

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
