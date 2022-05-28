module.exports.modeloDeConfiguracion = {
  enabled: 'boolean'
}

const consolex = require('../core/consolex')
const Database = require('../core/databaseManager')

function traducirAntiguasPropiedadesALasNuevas (propiedades) {
  if (Object.prototype.hasOwnProperty.call(propiedades, 'sendInEmbed')) {
    propiedades.enviarEnEmbed = { habilitado: propiedades.sendInEmbed.enabled || false, titulo: propiedades.sendInEmbed.title || null, descripcion: propiedades.sendInEmbed.description || null, thumbnail: propiedades.sendInEmbed.thumbnail || null, imagen: propiedades.sendInEmbed.image || null, color: propiedades.sendInEmbed.color || null, url: propiedades.sendInEmbed.url || null }

    Object.keys(propiedades.enviarEnEmbed).forEach(key => {
      if (propiedades.enviarEnEmbed[key] === null) {
        delete propiedades.enviarEnEmbed[key]
      }
    })

    delete propiedades.sendInEmbed
  }

  return propiedades
}

module.exports.obtenerRespuestaPersonalizada = async (guild, desencadenante) => {
  try {
    let [respuestaPersonalizada] = await Database.execute('SELECT * FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ? LIMIT 1', [desencadenante.toLowerCase(), guild.id]).then(result => result[0])

    if (Object.prototype.hasOwnProperty.call(respuestaPersonalizada, '0') && Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'autoreplyReply') && Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'autoreplyProperties')) {
      respuestaPersonalizada = { desencadenante: respuestaPersonalizada.autoreplyTrigger, respuesta: respuestaPersonalizada.autoreplyReply, propiedades: traducirAntiguasPropiedadesALasNuevas(JSON.parse(respuestaPersonalizada.autoreplyProperties)) }
      return respuestaPersonalizada || {}
    }

    return {}
  } catch (err) {
    consolex.gestionarError(err)
  }
}

const crearTextoAleatorio = require('randomstring').generate

/**
 * @param {Guild} guild - El servidor
 * @param {Object} respuestaPersonalizada - Un objeto con los datos de la respuesta personalizada.
 * @param {Strong} respuestaPersonalizada.desencadenante - El desencadenante de la respuesta personalizada.
 * @param {String} respuestaPersonalizada.respuesta - La respuesta personalizada.
 * @param {Object} respuestaPersonalizada.propiedades - Un objeto con las propiedades de la respuesta personalizada.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed - Un objeto con las propiedades del mensaje enriquecido.
 * @param {?Boolean} respuestaPersonalizada.propiedades.enviarEnEmbed.habilitado - Si se debe enviar en un mensaje enriquecido.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed.titulo - El título del mensaje enriquecido.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed.descripcion - La descripción del mensaje enriquecido.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed.thumbnail - La URL del thumbnail del mensaje enriquecido.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed.imagen - La URL de la imagen del mensaje enriquecido.
 * @param {?Object} respuestaPersonalizada.propiedades.enviarEnEmbed.url - La URL del mensaje enriquecido.
 * @returns {String} Identificador de la respuesta personalizada.
 */

module.exports.crearRespuestaPersonalizada = async (guild, respuestaPersonalizada) => {
  if (!Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'desencadenante')) throw new Error('Se requiere un desencadenante')

  if (!Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'respuesta')) throw new Error('Se requiere una respuesta')

  respuestaPersonalizada.propiedades = respuestaPersonalizada.propiedades || {}
  respuestaPersonalizada.propiedades.enviarEnEmbed = respuestaPersonalizada.propiedades.enviarEnEmbed || { habilitado: false }
  respuestaPersonalizada.identificador = crearTextoAleatorio({ length: 10, charset: 'alphanumeric' })

  try {
    await Database.execute('INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyReply`, `autoreplyProperties`) VALUES (?, ?, ?, ?, ?)', [guild.id, respuestaPersonalizada.identificador, respuestaPersonalizada.desencadenante, respuestaPersonalizada.respuesta, JSON.stringify(respuestaPersonalizada.propiedades)])
    return module.exports.obtenerRespuestaPersonalizada(guild, respuestaPersonalizada.desencadenante)
  } catch (err) {
    consolex.gestionarError(err)
  }
}

module.exports.eliminarRespuestaPersonalizada = (guild, identificadorRespuestaPersonalizada) => {
  try {
    Database.execute('DELETE FROM `guildAutoReply` WHERE `autoreplyID` = ? AND `guild` = ?', [identificadorRespuestaPersonalizada, guild.id])
  } catch (err) {
    consolex.gestionarError(err)
  }
}

module.exports.obtenerRespuestasPersonalizadas = async (guild) => {
  try {
    return await Database.execute('SELECT * FROM `guildAutoReply` WHERE `guild` = ?', [guild.id]).then(result => Object.prototype.hasOwnProperty.call(result, 0) ? result : [])
  } catch (err) {
    consolex.gestionarError(err)
  }
}

const randomstring = require('randomstring')
const fs = require('fs')

module.exports.generarDocumentoConTodasLasRespuestasPersonalizadasDelServidor = async (guild) => {
  let fileContent = '𝗣𝗶𝗻𝗴𝘂 · 𝗧𝗵𝗲 𝗢𝗦𝗦 𝗕𝗼𝘁.\n𝘓𝘦𝘢𝘳𝘯 𝘮𝘰𝘳𝘦 𝘢𝘣𝘰𝘶𝘵 𝘗𝘪𝘯𝘨𝘶 𝘢𝘵 𝘩𝘵𝘵𝘱𝘴://𝘢𝘭𝘦𝘹𝘢𝘯𝘥𝘳𝘶𝘮𝘶𝘯𝘵𝘦𝘯𝘢𝘴.𝘥𝘦𝘷/𝘱𝘪𝘯𝘨𝘶'
  const filePath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.txt`

  module.exports.obtenerRespuestasPersonalizadas(guild).then((replies) => {
    replies.forEach(reply => {
      fileContent += `Autoreply ID: ${reply.autoreplyID}\nAutoreply Trigger: ${reply.autoreplyTrigger}\nAutoreply Reply:${reply.autoreplyReply}\nProperties: ${reply.autoreplyProperties}\n--------------------\n`
    })

    fs.writeFileSync(filePath, fileContent)

    return filePath
  })
}

const { EmbedBuilder } = require('discord.js')

module.exports.hooks = [{
  evento: 'messageCreate',
  tipo: 'noPrefix',
  funcion: message => {
    module.exports.obtenerRespuestaPersonalizada(message.guild, message.content).then(respuestaPersonalizada => {
      if (respuestaPersonalizada && Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'propiedades')) {
        const reply = {}
        if (respuestaPersonalizada.propiedades.enviarEnEmbed.enabled) {
          const embed = new EmbedBuilder()

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.title) embed.setTitle(respuestaPersonalizada.propiedades.sendEmbed.title)

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.description) {
            embed.setDescription(respuestaPersonalizada.propiedades.sendEmbed.description)
          } else embed.setDescription(respuestaPersonalizada.respuesta)

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.thumbnail) embed.setThumbnail(respuestaPersonalizada.propiedades.sendEmbed.thumbnail)

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.imagen) embed.setImage(respuestaPersonalizada.propiedades.sendEmbed.image)

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.url) embed.setURL(respuestaPersonalizada.propiedades.sendEmbed.url)

          if (respuestaPersonalizada.propiedades.enviarEnEmbed.color) embed.setColor(respuestaPersonalizada.propiedades.sendEmbed.color)
          else embed.setColor('#2F3136')

          embed.setFooter({ text: 'Powered by Pingu || ⚠️ This is an autoreply made by this server.', iconURL: process.Client.user.displayAvatarURL() })

          reply.embeds = [embed]
        } else reply.content = respuestaPersonalizada.respuesta

        try {
          message.channel.send(reply)
        } catch (err) {
          consolex.gestionarError(err)
        }
      }
    })
  }
}]
