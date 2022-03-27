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
  const canvas = createCanvas(1568, 144)
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
  if (ping <= 150) return '<:the_connection_is_excellent:939550716555583508>'
  else if (ping > 150 && ping <= 350) return '<:the_connection_is_good:939550800965931049>'
  else if (ping > 350) return '<:the_connection_is_bad:939550935460478987>'
}

const coloresDeMinecraft = {
  dark_red: '#AA0000',
  red: '#FF5555',
  gold: '#FFAA00',
  yellow: '#FFFF55',
  dark_green: '#00AA00',
  green: '#55FF55',
  aqua: '#55FFFF',
  dark_aqua: '#00AAAA',
  dark_blue: '#0000AA',
  blue: '#5555FF',
  light_purple: '#FF55FF',
  dark_purple: '#AA00AA',
  white: '#FFFFFF',
  gray: '#AAAAAA',
  dark_gray: '#555555',
  black: '#000000',
  0: '#000000',
  1: '#0000AA',
  2: '#00AA00',
  3: '#00AAAA',
  4: '#AA0000',
  5: '#AA00AA',
  6: '#AA5500',
  7: '#AAAAAA',
  8: '#555555',
  9: '#5555FF',
  a: '#55FF55',
  b: '#55FFFF',
  c: '#FF5555',
  d: '#FF55FF',
  e: '#FFFF55',
  f: '#FFFFFF'
}

const formatoCodigoChat = {
  o: 'Italic',
  l: 'Bold',
  m: 'Strikethrough',
  n: 'Underline',
  k: 'Obfuscated',
  r: ''
}

const comprobarSiTextoEsUnColorHexadecimal = /^#(?<hex>[0-9a-f]{3}){1,2}$/i
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
      const text = limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(trozoDeTexto.substring(1))
      if (coloresDeMinecraft[codigoOriginal]) {
        motdProcesado.push({ color: coloresDeMinecraft[codigoOriginal], text })
      } else {
        motdProcesado.push({ text, format: formatoCodigoChat[codigoOriginal] || formatoCodigoChat.r })
      }
    })
    return motdProcesado
  } else if (Array.isArray(motd)) {
    motd.forEach(trozoDeTexto => {
      if (Object.prototype.hasOwnProperty.call(trozoDeTexto, 'text') && Object.prototype.hasOwnProperty.call(trozoDeTexto, 'color') && comprobarSiTextoEsUnColorHexadecimal.test(trozoDeTexto.color)) motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(trozoDeTexto.text), color: trozoDeTexto.color })
      else if (Object.prototype.hasOwnProperty.call(trozoDeTexto, 'text') && Object.prototype.hasOwnProperty.call(trozoDeTexto, 'color')) motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(trozoDeTexto.text), color: coloresDeMinecraft[trozoDeTexto.color] || coloresDeMinecraft.f })
      else if (Object.prototype.hasOwnProperty.call(trozoDeTexto, 'text')) motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(trozoDeTexto.text) })
      else motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(trozoDeTexto) })
    })
    motdProcesado[0].text = motdProcesado[0].text.replace(/^\s+/, '')
    return motdProcesado
  }
  return []
}

/** Limpia los textos de los espacios iniciales y finales manteniendo el salto de linea, es decir
  * String.trim(), manteniendo saltos de línea.
*/

function limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea (texto) {
  if (texto.includes('\n')) {
    const textoProcesado = []
    texto = texto.split('\n')

    texto.forEach(trozoDeTexto => {
      textoProcesado.push(trozoDeTexto.trim())
    })

    return textoProcesado.join('\n')
  }

  return texto
}
