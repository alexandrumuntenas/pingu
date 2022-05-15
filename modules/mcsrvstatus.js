/* eslint-disable node/no-callback-literal */
const { createCanvas, registerFont } = require('canvas')
const { writeFileSync } = require('fs')
const randomstring = require('randomstring')

registerFont('./fonts/Courier_Prime/CourierPrime-Regular.ttf', { family: 'Courier Prime Regular' })
registerFont('./fonts/Courier_Prime/CourierPrime-Italic.ttf', { family: 'Courier Prime Italic' })
registerFont('./fonts/Courier_Prime/CourierPrime-Bold.ttf', { family: 'Courier Prime Bold' })
registerFont('./fonts/Courier_Prime/CourierPrime-BoldItalic.ttf', { family: 'Courier Prime Bold Italic' })

/** Comprobar si texto solo tiene espacios; devuelve falso si solo hay 1 */

function tieneSoloEspacios (texto) {
  if (texto.length === 1) return false
  return texto.trim().length === 0
}

/**
 * Procesar la descripción recibida de un servidor de Minecraft
 * para convertirla en un bloque de Ansi, mostrando los colores
 * en Discord.
 * @param {Array<{color: String, text: String}>} motd - Resultado del ping del servidor de Minecraft (exactamente la propiedad: state.raw.vanilla.raw.description.extra)
 * @param {Function} callback
*/

module.exports.convertirMOTDaImagen = (motd, callback) => {
  if (!callback) throw new Error('Callback is required')

  const motdProcesado = module.exports.procesarMOTD(motd)
  const attachmentPath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.png`
  const canvas = createCanvas(1688, 144)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#16100c'
  ctx.fillRect(0, 0, 1688, 144)

  let posicionEjeX = 20
  let posicionEjeY = 60

  if (!motdProcesado[0].color) {
    ctx.fillStyle = '#FFFFFF'
  }

  motdProcesado.forEach(trozoDeTexto => {
    if (trozoDeTexto.text === '\n') {
      posicionEjeX = 20
      posicionEjeY += 64
    } else if (!tieneSoloEspacios(trozoDeTexto.text) || (tieneSoloEspacios(trozoDeTexto.text) && trozoDeTexto.color)) {
      if (trozoDeTexto.text.startsWith('\n')) {
        posicionEjeX = 20
        posicionEjeY += 64
      }
      ctx.font = `64px "Courier Prime ${trozoDeTexto.format || 'Regular'}"`
      ctx.fillStyle = trozoDeTexto.color || ctx.fillStyle
      ctx.fillText(trozoDeTexto.text, posicionEjeX, posicionEjeY)
      posicionEjeX += ctx.measureText(trozoDeTexto.text).width
      if (trozoDeTexto.text.endsWith('\n')) {
        posicionEjeX = 20
        posicionEjeY += 64
      }
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
  if (ping <= 150) return '<:connection_excellent:967782019721490462>'
  else if (ping > 150 && ping <= 350) return '<:connection_good:967782019713093642>'
  else if (ping > 350) return '<:connection_bad:967782019654381648>'
  return '<:connection_offline:975452352372965416>'
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
  6: '#ffaa00',
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

const formatoDeMinecraft = {
  r: 'Regular',
  o: 'Italic',
  l: 'Bold',
  n: 'Underline',
  m: 'Strike',
  k: 'Obfuscated'
}

/** Limpia los textos de los espacios iniciales y finales manteniendo el salto de linea, es decir
  * String.trim(), manteniendo saltos de línea.
*/

function limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea (texto) {
  if (texto.includes('\n')) {
    const textoProcesado = []
    const textoOfrecido = texto.split('\n')

    textoOfrecido.forEach(trozoDeTexto => {
      textoProcesado.push(trozoDeTexto.trim())
    })

    return textoProcesado.join('\n')
  }

  return texto
}

/**
 * Procesa el MOTD de un servidor de Minecraft para convertirlo
 * a una matriz procesable por convertirMOTDaImagen()
 * @param {Array} motd - MOTD de un servidor de Minecraft. Resultado del ping del servidor de Minecraft (exactamente la propiedad: state.raw.vanilla.raw.description.extra)
 */

module.exports.procesarMOTD = motd => {
  const motdProcesado = []

  if (!Array.isArray(motd)) motd = [motd]

  motd = motd.join('\n')

  motd.split('§').forEach(lineaDeTexto => {
    if (coloresDeMinecraft[lineaDeTexto.slice(0, 1)]) {
      motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(lineaDeTexto.slice(1)), color: coloresDeMinecraft[lineaDeTexto.slice(0, 1)] })
    } else if (formatoDeMinecraft[lineaDeTexto.slice(0, 1)]) {
      motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(lineaDeTexto.slice(1)), format: formatoDeMinecraft[lineaDeTexto.slice(0, 1)] })
    } else {
      motdProcesado.push({ text: limpiarTextosDeEspaciosInicialesFinalesVaciosManteniendoElSaltodeLinea(lineaDeTexto) })
    }
  })

  return motdProcesado
}

/**
 * Retirar de los textos el formato devuelto por los servidores de Minecraft
 * @param {String} texto - Texto a limpiar
 * @returns Texto limpio
 */

module.exports.limpiarFormatoDeLosTextos = (texto) => {
  const textoProcesadoPreparadoConFormato = module.exports.procesarMOTD(texto)
  const textoProcesado = []
  textoProcesadoPreparadoConFormato.forEach(trozoDeTexto => {
    textoProcesado.push(trozoDeTexto.text)
  })

  return textoProcesado.join(' ')
}

const { obtenerConfiguracionDelServidor, actualizarConfiguracionDelServidor } = require('../core/guildManager')

const mcsrv = require('mcsrv')
const Gamedig = require('gamedig')
const consolex = require('../core/consolex')

/**
 * Conectar con el servidor de minecraft y procesar toda su información
 * para que pueda ser usado por el bot.
 * @param {Object} host - Host de un servidor de Minecraft
 * @param {String} host.ip - IP del servidor de Minecraft
 * @param {Number} host.port - Puerto del servidor de Minecraft
 * @param {Function} callback
 * @returns {Object} - Objeto con la información del servidor de Minecraft
 */

module.exports.obtenerDatosDelServidor = (host, callback) => {
  if (!callback) throw new Error('Debe proporcionar un callback')

  const servidor = {}

  Gamedig.query({ type: 'minecraft', host: host.ip.trim(), port: host.port ? host.port : 25565 }).then((state) => {
    servidor.ping = { emoji: module.exports.pingAEmoji(state.raw.vanilla.ping), ms: state.raw.vanilla.ping || 'Unknown ping' }
    mcsrv(host.ip.trim()).then(server => {
      module.exports.convertirMOTDaImagen(server.motd.raw, motd => {
        servidor.motd = motd
      })
      servidor.online = server.online
      servidor.version = server.version || 'Unknown version'
      servidor.jugadores = `${server.players.online}/${server.players.max}` || 'Unknown players'
      servidor.direccion = server.hostname || `${host.ip}${host.port ? `:${host.port}` : ''}` || host.ip
      servidor.icono = Buffer.from(server.icon.split(',')[1], 'base64')

      return callback(servidor)
    }).catch(() => {
      return callback({})
    })
  }).catch(() => {
    return callback({})
  })
}

const { Attachment, EmbedBuilder } = require('discord.js')

module.exports.generarMensajeEnriquecidoConDatosDelServidor = (host, callback) => {
  module.exports.obtenerDatosDelServidor({ ip: host.ip.trim(), port: host.port }, datosDelServidor => {
    const serverIcon = new Attachment(datosDelServidor.icono || 'https://i.imgur.com/tO2mFKz.png', 'icon.png')
    const embed = new EmbedBuilder().setThumbnail('attachment://icon.png')

    if (datosDelServidor.online) {
      const serverMotd = new Attachment(datosDelServidor.motd, 'motd.png')
      embed.addFields([
        { name: ':radio_button: Version', value: datosDelServidor.version, inline: true },
        { name: ':busts_in_silhouette: Players', value: datosDelServidor.jugadores, inline: true },
        { name: `${datosDelServidor.ping.emoji} Ping`, value: `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', inline: true },
        { name: ':desktop: Address', value: datosDelServidor.direccion, inline: true }
      ]).setImage('attachment://motd.png')
        .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

      return callback({ files: [serverMotd, serverIcon], embeds: [embed] })
    }

    return callback({ files: [serverIcon], embeds: [embed.setDescription('Failed to fetch server data...')] })
  })
}

/* A partir de aquí solo habrá código relacionado con las tareas de actualización de datos */

function actualizarNumeroDeJugadoresDelSidebar (guild) {
  obtenerConfiguracionDelServidor(guild, config => {
    const sidebarPlayercount = process.Client.guilds.resolve(guild.id).channels.resolve(config.mcsrvstatus.sidebarPlayercount)
    if (config.mcsrvstatus.enabled && config.mcsrvstatus.sidebarPlayercount && sidebarPlayercount) {
      module.exports.obtenerDatosDelServidor({ ip: config.mcsrvstatus.host, port: config.mcsrvstatus.port }, servidor => {
        sidebarPlayercount.edit({ name: `🎭 Players: ${servidor.jugadores}` })
      })
    }
  })
}

const { createHash } = require('crypto')

function actualizarDatosDelPanel (guild) {
  obtenerConfiguracionDelServidor(guild, config => {
    if (config.mcsrvstatus.enabled && config.mcsrvstatus.messagePanelChannel) {
      module.exports.generarMensajeEnriquecidoConDatosDelServidor({ ip: config.mcsrvstatus.host, port: config.mcsrvstatus.port }, mensaje => {
        function fallback () {
          try {
            process.Client.channels.resolve(config.mcsrvstatus.messagePanelChannel).send(mensaje).then(newMessage => {
              actualizarConfiguracionDelServidor(guild, { column: 'mcsrvstatus', newconfig: { messagePanelId: newMessage.id } })
            })
          } catch {
            consolex.error(`No se pudo actualizar el panel del servidor ${createHash('sha256').update(guild.id).digest('hex')}`)
          }
        }

        try {
          process.Client.channels.resolve(config.mcsrvstatus.messagePanelChannel).messages.fetch(config.mcsrvstatus.messagePanelId).then(message => {
            message.edit(mensaje).catch(() => {
              fallback()
            })
          }).catch(() => {
            fallback()
          })
        } catch {
          consolex.error(`No se pudo actualizar el panel del servidor ${createHash('sha256').update(guild.id).digest('hex')}`)
        }
      })
    }
  })
}

module.exports.comenzarActualizarDatosDeLosServidores = () => {
  consolex.info('Actualizando datos de los de minecraft configurados...')
  process.Client.guilds.fetch().then(guilds => {
    guilds.forEach(guild => {
      actualizarNumeroDeJugadoresDelSidebar(guild)
      actualizarDatosDelPanel(guild)
    })
  })

  setInterval(() => {
    consolex.info('Actualizando datos de los de minecraft configurados...')
    process.Client.guilds.fetch().then(guilds => {
      guilds.forEach(guild => {
        actualizarNumeroDeJugadoresDelSidebar(guild)
        actualizarDatosDelPanel(guild)
      })
    })
  }, 300000)
}

module.exports.modeloDeConfiguracion = {
  enabled: 'boolean',
  host: 'string',
  port: 'number',
  sidebarPlayercount: 'string',
  messagePanelChannel: 'string',
  messagePanelId: 'string'
}
