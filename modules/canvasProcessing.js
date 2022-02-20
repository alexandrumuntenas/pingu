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
module.exports = {
  welcomeCard: async (client, member, locale, database) => {
    const uniqueIdentifiers = {
      attachmentSent: randomstring.generate({ charset: 'alphabetic' })
    }

    const paths = {
      attachmentSent: `./modules/temp/${uniqueIdentifiers.attachmentSent}.png`
    }

    const canvas = createCanvas(1100, 500)
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = 'rgba(0,0,0,0)'
    // Establecer fondo del canvas
    let imgPath = ''
    if (
      database.welcomeImageCustomBackground &&
      isValidUrl(database.welcomeImageCustomBackground) &&
      isImageUrl(database.welcomeImageCustomBackground)
    ) {
      imgPath = database.welcomeImageCustomBackground
      const background = await loadImage(imgPath)
      const scale = Math.max(
        canvas.width / background.width,
        canvas.height / background.height
      )
      ctx.drawImage(
        background,
        canvas.width / 2 - (background.width / 2) * scale,
        canvas.height / 2 - (background.height / 2) * scale,
        background.width * scale,
        background.height * scale
      )
      ctx.fillStyle = hexToRgba(
        database.welcomeImageCustomOverlayColor || '#272934',
        database.welcomeImageCustomOpacity || 50
      )
      roundRect(ctx, 25, 25, 1050, 450, 10, ctx.fillStyle, ctx.strokeStyle)
    } else {
      ctx.fillStyle = '#272934'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const title = `${member.user.tag} just joined the server`
    // TODO: Permitir a los usuarios cambiar el título y el subtitulo.
    // const title = "TEXT WILL BE FROM THE DATABASE"
    const subtitle = `Member #${member.guild.memberCount}`

    ctx.font = applyText(canvas, title)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(title, canvas.width / 2, 387)

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(subtitle, canvas.width / 2, 437)

    // Añadir avatar de usuario
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 175, 125, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 10
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 175, 100, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    const avatar = await loadImage(
      member.user.displayAvatarURL({ format: 'png', size: 512 })
    )
    ctx.drawImage(avatar, canvas.width / 2 - 100, 75, 200, 200)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  },
  generateRankCard: async (member, guildConfig) => {
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
    ctx.strokeStyle = 'rgba(0,0,0,0)'
    let imgPath = ''
    if (
      guildConfig.levelsImageCustomBackground &&
      isValidUrl(guildConfig.levelsImageCustomBackground) &&
      isImageUrl(guildConfig.levelsImageCustomBackground)
    ) {
      imgPath = guildConfig.levelsImageCustomBackground
      const background = await loadImage(imgPath)
      const scale = Math.max(
        canvas.width / background.width,
        canvas.height / background.height
      )
      ctx.drawImage(
        background,
        canvas.width / 2 - (background.width / 2) * scale,
        canvas.height / 2 - (background.height / 2) * scale,
        background.width * scale,
        background.height * scale
      )

      ctx.fillStyle = hexToRgba(
        guildConfig.levelsImageCustomOverlayColor || '#272934',
        guildConfig.levelsImageCustomOpacity || 50
      )
      roundRect(ctx, 16, 16, 1068, 290, 10, ctx.fillStyle, ctx.strokeStyle)
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
    ctx.fillText(
      `Rank #${member.levelData.lvlRank}  Level ${millify(
        member.levelData.lvlLevel
      )}`,
      1050,
      100
    )

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(
      member.levelData.lvlExperience
    )} / ${millify(
      member.levelData.lvlLevel *
        member.levelData.lvlLevel *
        guildConfig.levelsDifficulty *
        100
    )} XP`

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)

    ctx.fillStyle = 'rgba(255,255,255, 0.3)'
    roundRect(ctx, 295, 200, 755, 70, 10, ctx.fillStyle, ctx.strokeStyle)

    // Añadir barra de progreso

    ctx.fillStyle = 'rgb(255,255,255)'
    roundRect(
      ctx,
      295,
      200,
      Math.abs(
        member.levelData.lvlExperience /
          (member.levelData.lvlLevel *
            member.levelData.lvlLevel *
            guildConfig.levelsDifficulty *
            100)
      ) * 755,
      70,
      10,
      ctx.fillStyle,
      ctx.strokeStyle
    )

    // Añadir avatar de usuario
    ctx.beginPath()
    ctx.arc(159, 159, 102, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    const avatar = await loadImage(
      member.user.displayAvatarURL({ format: 'png', size: 512 })
    )
    ctx.drawImage(avatar, 57, 57, 204, 204)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  }
}

const applyText = (canvas, text, maxlimit) => {
  const ctx = canvas.getContext('2d')
  let fontSize = maxlimit || 100

  do {
    ctx.font = `${(fontSize -= 1)}px "Montserrat SemiBold"`
  } while (ctx.measureText(text).width > canvas.width - 125)

  return ctx.font
}

// Code from https://stackoverflow.com/a/3368118/17821331
function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
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
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  )
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}
