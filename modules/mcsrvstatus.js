const { createCanvas, registerFont } = require('canvas')
const { writeFileSync } = require('fs')
const randomstring = require('randomstring')

registerFont('./modules/sources/fonts/RedHatMono/RedHatMono-Semibold.ttf', {
  family: 'Red Hat Mono',
  weight: 'semibold'
})

/**
 * Procesar la descripción recibida de un servidor de Minecraft
 * para convertirla en un bloque de Ansi, mostrando los colores
 * en Discord.
 * @param {Array<{color: String, text: String}>} motd - Resultado del ping del servidor de Minecraft (exactamente la propiedad: state.raw.vanilla.raw.description.extra)
 * @param {Function} callback
*/

module.exports.convertirMOTDaImagen = (motd, callback) => {
  const attachmentPath = `./modules/temp/${randomstring.generate({ charset: 'alphabetic' })}.png`
  const canvas = createCanvas(1440, 144)
  const ctx = canvas.getContext('2d')

  if (!callback) throw new Error('Callback is required')

  let posicionEjeX = 0
  let posicionEjeY = 64
  ctx.font = '64px "Red Hat Mono Semibold"'
  motd.forEach(trozoDeTexto => {
    if (trozoDeTexto.text.startsWith('\n')) {
      posicionEjeX = 0
      posicionEjeY += 64
    }
    ctx.fillStyle = trozoDeTexto.color
    ctx.fillText(trozoDeTexto.text, posicionEjeX, posicionEjeY)
    posicionEjeX += ctx.measureText(trozoDeTexto.text).width
    if (trozoDeTexto.text.endsWith('\n')) {
      posicionEjeX = 0
      posicionEjeY += 64
    }
  })

  const buffer = canvas.toBuffer('image/png')
  writeFileSync(attachmentPath, buffer)

  return callback(attachmentPath)
}

module.exports.pingAEmoji = ping => {
  if (ping <= 50) return '<:the_connection_is_excellent:939550716555583508>'
  else if (ping > 50 && ping <= 200) return '<:the_connection_is_good:939550800965931049>'
  else if (ping > 200) return '<:the_connection_is_bad:939550935460478987>'
}
