const { createCanvas, registerFont } = require('canvas')
const { writeFileSync } = require('fs')
const randomstring = require('randomstring')

registerFont('./modules/sources/fonts/CourierPrime/CourierPrime-Regular.ttf', { family: 'Courier Prime Regular' })
registerFont('./modules/sources/fonts/CourierPrime/CourierPrime-Italic.ttf', { family: 'Courier Prime Italic' })
registerFont('./modules/sources/fonts/CourierPrime/CourierPrime-Bold.ttf', { family: 'Courier Prime Bold' })
registerFont('./modules/sources/fonts/CourierPrime/CourierPrime-BoldItalic.ttf', { family: 'Courier Prime Bold Italic' })

/**
 * Procesar la descripción recibida de un servidor de Minecraft
 * para convertirla en un bloque de Ansi, mostrando los colores
 * en Discord.
 * @param {Array<{color: String, text: String}>} motd - Resultado del ping del servidor de Minecraft (exactamente la propiedad: state.raw.vanilla.raw.description.extra)
 * @param {Function} callback
*/

module.exports.convertirMOTDaImagen = (motd, callback) => {
  const motdProcesado = module.exports.procesarMOTD(motd)
  const attachmentPath = `./modules/temp/${randomstring.generate({ charset: 'alphabetic' })}.png`
  const canvas = createCanvas(1440, 144)
  const ctx = canvas.getContext('2d')

  if (!callback) throw new Error('Callback is required')

  let posicionEjeX = 0
  let posicionEjeY = 64
  motdProcesado.forEach(trozoDeTexto => {
    if (trozoDeTexto.text.startsWith('\n')) {
      posicionEjeX = 0
      posicionEjeY += 64
    }
    ctx.font = `64px "Courier Prime ${trozoDeTexto.format || 'Regular'}"`
    ctx.fillStyle = trozoDeTexto.color || ctx.fillStyle
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

/**
 * Relaciona un emoji con una calificación de ping.
 * @param {Number} ping
 * @returns Emoji
 */

module.exports.pingAEmoji = ping => {
  if (ping <= 50) return '<:the_connection_is_excellent:939550716555583508>'
  else if (ping > 50 && ping <= 200) return '<:the_connection_is_good:939550800965931049>'
  else if (ping > 200) return '<:the_connection_is_bad:939550935460478987>'
}

/**
 * Traduce el código de color de chat de Minecraft a su
 * respectivo valor color hexadecimal.
 * @param {String} color - Color como Código de Chat
 * @returns {String} Valor Hexadecimal del color
 */

module.exports.convertirColorCodigoChatAHexadecimal = color => {
  switch (color) {
    case '0': {
      return '#000000'
    }
    case '1': {
      return '#0000AA'
    }
    case '2': {
      return '#00AA00'
    }
    case '3': {
      return '#00AAAA'
    }
    case '4': {
      return '#AA0000'
    }
    case '5': {
      return '#AA00AA'
    }
    case '6': {
      return '#AA5500'
    }
    case '7': {
      return '#AAAAAA'
    }
    case '8': {
      return '#555555'
    }
    case '9': {
      return '#5555FF'
    }
    case 'a': {
      return '#55FF55'
    }
    case 'b': {
      return '#55FFFF'
    }
    case 'c': {
      return '#FF5555'
    }
    case 'd': {
      return '#FF55FF'
    }
    case 'e': {
      return '#FFFF55'
    }
    case 'f': {
      return '#FFFFFF'
    }
    case 'r': {
      return '#FFFFFF'
    }
    default: {
      return color
    }
  }
}

module.exports.convertirFormatoCodigoChataPropiedad = formato => {
  switch (formato) {
    case 'o': {
      return 'Italic'
    }
    case 'l': {
      return 'Bold'
    }
    case 'm': {
      return 'Strikethrough'
    }
    case 'n': {
      return 'Underline'
    }
    case 'k': {
      return 'Obfuscated'
    }
    default: {
      return formato
    }
  }
}

const cssColorNameToHex = require('convert-css-color-name-to-hex')

/**
 * Procesa el MOTD de un servidor de Minecraft para convertirlo
 * a una matriz procesable por convertirMOTDaImagen()
 * @param {String || Array} motd - MOTD de un servidor de Minecraft. Resultado del ping del servidor de Minecraft (exactamente la propiedad: state.raw.vanilla.raw.description.extra)
 */

module.exports.procesarMOTD = motd => {
  const motdProcesado = []
  if (typeof motd === 'string') {
    motd.trim().split('§').forEach(trozoDeTexto => {
      const codigoOriginal = trozoDeTexto.substring(0, 1)
      const color = module.exports.convertirColorCodigoChatAHexadecimal(codigoOriginal)
      let text = trozoDeTexto.substring(1)
      if (text.includes('\n')) {
        const newText = []
        text = text.split('\n')

        text.forEach(trozoDeTexto => {
          newText.push(trozoDeTexto.trim())
        })

        text = newText.join('\n')
      }
      if (codigoOriginal === color) {
        motdProcesado.push({ text, format: module.exports.convertirFormatoCodigoChataPropiedad(codigoOriginal) })
      } else {
        motdProcesado.push({ color, text })
      }
    })
    console.log(motdProcesado)
    return motdProcesado
  } else if (Array.isArray(motd)) {
    motd.forEach(trozoDeTexto => {
      /** Procesar nombres CSS de colro a hexadecimales */
    })
  }
  return []
}
