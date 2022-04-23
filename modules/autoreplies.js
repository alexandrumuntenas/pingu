const Consolex = require('../functions/consolex')
const Database = require('../functions/databaseConnection')

module.exports.obtenerRespuestaPersonalizada = (guild, desencadenante, callback) => {
  if (!callback) throw new Error('Callback is required')

  Database.query('SELECT * FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ? LIMIT 1', [desencadenante.toLowerCase(), guild.id], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyReply') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyProperties')) {
      const respuestaPersonalizada = { desencadenante: result[0].autoreplyTrigger, respuesta: result[0].autoreplyReply, propiedades: JSON.parse(result[0].autoreplyProperties) }
      callback(respuestaPersonalizada)
    } else {
      callback()
    }
  })
}

const crearTextoAleatorio = require('randomstring').generate

/**
 * Crea una nueva respuesta personalizada.
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
 * @param {Functions} callback - La función que se ejecutará cuando se haya creado la respuesta personalizada.
 * @returns {String} Identificador de la respuesta personalizada.
 */

// TODO: Pasar a través de callback el identificador de la respuesta personalizada

module.exports.crearRespuestaPersonalizada = (guild, respuestaPersonalizada, callback) => {
  if (!callback) throw new Error('Se requiere un callback')

  if (!Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'desencadenante')) throw new Error('Se requiere un desencadenante')

  if (!Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'respuesta')) throw new Error('Se requiere una respuesta')

  respuestaPersonalizada.propiedades = respuestaPersonalizada.propiedades || {}
  respuestaPersonalizada.propiedades.enviarEnEmbed = respuestaPersonalizada.propiedades.enviarEnEmbed || { habilitado: false }
  respuestaPersonalizada.identificador = crearTextoAleatorio({ length: 10, charset: 'alphanumeric' })

  Database.query('INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyReply`, `autoreplyProperties`) VALUES (?, ?, ?, ?, ?)', [guild.id, respuestaPersonalizada.identificador, respuestaPersonalizada.desencadenante, respuestaPersonalizada.respuesta, JSON.stringify(respuestaPersonalizada.propiedades)], err => {
    if (err) {
      Consolex.gestionarError(err)
      callback(err)
      throw err
    }

    return callback()
  })
}

module.exports.eliminarRespuestaPersonalizada = (guild, identificadorRespuestaPersonalizada) => {
  Database.query('DELETE FROM `guildAutoReply` WHERE `autoreplyID` = ? AND `guild` = ?', [identificadorRespuestaPersonalizada, guild.id], err => {
    if (err) {
      Consolex.gestionarError(err)
      throw err
    }
  })
}

const { MessageEmbed } = require('discord.js')

/**
 * Handle an auto reply.
 * @param {Message} message
 * @deprecated Reemplazado por {@link functions:eventManager.funcionesDeTerceros}
 */

// TODO: Incorporar con el eventManager.

module.exports.handleAutoRepliesInMessageCreate = message => {
  module.exports.obtenerRespuestaPersonalizada(message.guild, message.content, respuestaPersonalizada => {
    if (respuestaPersonalizada && Object.prototype.hasOwnProperty.call(respuestaPersonalizada, 'propiedades')) {
      const reply = {}
      if (respuestaPersonalizada.propiedades.enviarEnEmbed.enabled) {
        const embed = new MessageEmbed()

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
        Consolex.gestionarError(err)
      }
    }
  })
}

const randomstring = require('randomstring')
const fs = require('fs')

/**
 * Generate a .txt
 * @param {Guild} guild
 * @param {Function} callback
 * @returns {String} Path to the generated file
 */

module.exports.generarDocumentoConTodasLasRespuestasPersonalizadasDelServidor = (guild, callback) => {
  let fileContent = '𝗣𝗶𝗻𝗴𝘂 · 𝗧𝗵𝗲 𝗢𝗦𝗦 𝗕𝗼𝘁.\n𝘓𝘦𝘢𝘳𝘯 𝘮𝘰𝘳𝘦 𝘢𝘣𝘰𝘶𝘵 𝘗𝘪𝘯𝘨𝘶 𝘢𝘵 𝘩𝘵𝘵𝘱𝘴://𝘢𝘭𝘦𝘹𝘢𝘯𝘥𝘳𝘶𝘮𝘶𝘯𝘵𝘦𝘯𝘢𝘴.𝘥𝘦𝘷/𝘱𝘪𝘯𝘨𝘶'
  const filePath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.txt`

  module.exports.obtenerRespuestasPersonalizadas(guild, (replies) => {
    replies.forEach(reply => {
      fileContent += `Autoreply ID: ${reply.autoreplyID}\nAutoreply Trigger: ${reply.autoreplyTrigger}\nAutoreply Reply:${reply.autoreplyReply}\nProperties: ${reply.autoreplyProperties}\n--------------------\n`
    })

    fs.writeFileSync(filePath, fileContent)

    callback(filePath)
  })
}

/**
 * Get all the auto replies in a guild.
 * @param {Guild} guild - The guild to get the replies from.
 * @param {Function} callback - The callback to call.
 * @returns {Array} Array of autoreply objects.
 */

module.exports.obtenerRespuestasPersonalizadas = (guild, callback) => {
  if (!callback) throw new Error('Callback is required')

  Database.query('SELECT * FROM `guildAutoReply` WHERE `guild` = ?', [guild.id], (err, result) => {
    if (err) {
      Consolex.gestionarError(err)
      throw err
    }

    if (Object.prototype.hasOwnProperty.call(result, '0') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyReply') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyProperties')) {
      callback(result)
    } else {
      // eslint-disable-next-line node/no-callback-literal
      callback([])
    }
  })
}
