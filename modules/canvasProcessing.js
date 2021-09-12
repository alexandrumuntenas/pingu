const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const StackBlur = require('stackblur-canvas')
const randomstring = require('randomstring')
const getLocales = require('./getLocales')

registerFont('./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf', { family: 'Montserrat' })
module.exports = {
  welcomeCard: async (client, member, locale, backgroundId) => {
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
    const background = await loadImage(`./modules/sources/defaultBackgrounds/${backgroundId}.png`)
    const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
    ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)
    // background.src = './modules/sources/defaultBackgrounds/7.png'

    // Establecer blured overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    StackBlur.canvasRGBA(canvas, 25, 25, 1050, 450, 50)

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

    // Type 1 with Circles
    /*
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 160, 110, 0, Math.PI * 2, true) // 110 es el radio de la figura
    ctx.closePath()
    ctx.clip()
    */

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(canvas.width / 2 - 110, 50, 220, 220) // canvas.width - 110 para obtener el centrado de la figura

    // Añadir avatar de usuario

    // Type 1 with Circles
    /*
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 160, 100, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    */

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    ctx.drawImage(avatar, canvas.width / 2 - 100, 60, 200, 200)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  },
  rank: async () => {
    return 2
  }
}

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d')
  let fontSize = 100

  do {
    ctx.font = `${fontSize -= 1}px "Montserrat SemiBold"`
  } while (ctx.measureText(text).width > canvas.width - 125)

  return ctx.font
}
