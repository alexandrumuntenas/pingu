const Consolex = require('../functions/consolex')
const Database = require('../functions/databaseConnection')

module.exports.obtenerRespuestaPersonalizada = (guild, desencadenante, callback) => {
  if (!callback) throw new Error('Callback is required')

  Database.query('SELECT * FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ? LIMIT 1', [desencadenante.toLowerCase(), guild.id], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (Object.prototype.hasOwnProperty.call(result, '0') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyTrigger') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyReply') && Object.prototype.hasOwnProperty.call(result[0], 'autoreplyProperties')) {
      result[0].autoreplyProperties = JSON.parse(result[0].autoreplyProperties)
      callback(result[0])
    } else {
      callback()
    }
  })
}

const makeId = require('../functions/makeId')

/**
 * Crea una nueva respuesta personalizada.
 * @param {Guild} guild - El servidor
 * @param {Object} autoreply - Un objeto con los datos de la respuesta personalizada.
 * @param {Strong} autoreply.desencadenante - El desencadenante de la respuesta personalizada.
 * @param {String} autoreply.respuesta - La respuesta personalizada.
 * @param {Object} autoreply.propiedades - Un objeto con las propiedades de la respuesta personalizada.
 * @param {?Object} autoreply.propiedades.enviarEnUnMensajeEnriquecido - Un objeto con las propiedades del mensaje enriquecido.
 * @param {?Boolean} autorreply.propiedades.sendInEmbed.habilitado - Si se debe enviar en un mensaje enriquecido.
 * @param {?Object} autoreply.propiedades.sendInEmbed.titulo - El título del mensaje enriquecido.
 * @param {?Object} autoreply.propiedades.sendInEmbed.descripcion - La descripción del mensaje enriquecido.
 * @param {?Object} autoreply.propiedades.sendInEmbed.thumbnail - La URL del thumbnail del mensaje enriquecido.
 * @param {?Object} autoreply.propiedades.sendInEmbed.imagen - La URL de la imagen del mensaje enriquecido.
 * @param {?Object} autoreply.propiedades.sendInEmbed.url - La URL del mensaje enriquecido.
 * @param {Functions} callback - La función que se ejecutará cuando se haya creado la respuesta personalizada.
 * @returns {String} ID de la respuesta personalizada.
 */

module.exports.crearRespuestaPersonalizada = (guild, autoreply, callback) => {
  if (!callback) throw new Error('Callback is required')

  if (!Object.prototype.hasOwnProperty.call(autoreply, 'desencadenante')) throw new Error('Se requiere un desencadenante')

  if (!Object.prototype.hasOwnProperty.call(autoreply, 'respuesta')) throw new Error('Se requiere una respuesta')

  autoreply.properties = autoreply.properties || {}
  autoreply.properties.sendInEmbed = autoreply.properties.sendInEmbed || { enabled: false }
  autoreply.id = makeId(5)

  Database.query('INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyReply`, `autoreplyProperties`) VALUES (?, ?, ?, ?, ?)', [guild.id, autoreply.id, autoreply.trigger, autoreply.reply, JSON.stringify(autoreply.properties)], err => {
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

module.exports.handleAutoRepliesInMessageCreate = message => {
  module.exports.obtenerRespuestaPersonalizada(message.guild, message.content, replydata => {
    if (replydata && Object.prototype.hasOwnProperty.call(replydata, 'autoreplyProperties')) {
      const reply = {}
      if (replydata.autoreplyProperties.sendInEmbed.enabled) {
        const embed = new MessageEmbed()

        if (replydata.autoreplyProperties.sendInEmbed.title) embed.setTitle(replydata.autoreplyProperties.sendEmbed.title)

        if (replydata.autoreplyProperties.sendInEmbed.description) {
          embed.setDescription(replydata.autoreplyProperties.sendEmbed.description)
        } else embed.setDescription(replydata.autoreplyReply)

        if (replydata.autoreplyProperties.sendInEmbed.thumbnail) embed.setThumbnail(replydata.autoreplyProperties.sendEmbed.thumbnail)

        if (replydata.autoreplyProperties.sendInEmbed.image) embed.setImage(replydata.autoreplyProperties.sendEmbed.image)

        if (replydata.autoreplyProperties.sendInEmbed.url) embed.setURL(replydata.autoreplyProperties.sendEmbed.url)

        if (replydata.autoreplyProperties.sendInEmbed.color) embed.setColor(replydata.autoreplyProperties.sendEmbed.color)
        else embed.setColor('#2F3136')

        embed.setFooter({ text: 'Powered by Pingu || ⚠️ This is an autoreply made by this server.', iconURL: process.Client.user.displayAvatarURL() })

        reply.embeds = [embed]
      } else reply.content = replydata.autoreplyReply

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
  let fileContent = 'Pingu · The OSS Discord Bot. Learn more about Pingu at https://alexandrumuntenas.dev/pingu\n\n'
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
