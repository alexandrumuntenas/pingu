/* eslint-disable valid-typeof */
/** @module GuildDataManager */

const Database = require('./databaseManager')
const consolex = require('./consolex')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

/**
 * Obtiene la configuración de un guild específico.
 * @param {Guild} guild - El guild del cual se quiere obtener la configuración.
 * @returns Object - La configuración del guild.
 */

module.exports.obtenerConfiguracionDelServidor = async (guild) => {
  try {
    const [configuracionDelServidor] = await Database.execute('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild.id]).then(result => result[0])

    if (configuracionDelServidor) {
      Object.keys(configuracionDelServidor).forEach(module => {
        try {
          configuracionDelServidor[module] = JSON.parse(configuracionDelServidor[module].trim())
        } catch (err2) {
          if (!err2.constructor.name === 'SyntaxError') consolex.gestionarError(err2)
        }
      })

      if (configuracionDelServidor.common === null) {
        try {
          await Database.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', ['common', JSON.stringify({ language: 'es-ES', prefix: '!', interactions: { enabled: true } }), guild.id])
          return module.exports.obtenerConfiguracionDelServidor(guild)
        } catch (err2) {
          consolex.gestionarError(err2)
        }
        module.exports.actualizarConfiguracionDelServidor(guild, { column: 'common', newconfig: { language: 'es-ES', prefix: '!', interactions: { enabled: true } } }).then()
      }

      return configuracionDelServidor || {}
    }

    try {
      await Database.execute('INSERT INTO `guildConfigurations` (guild) VALUES (?)', [guild.id])
      return module.exports.obtenerConfiguracionDelServidor(guild)
    } catch (err2) {
      consolex.gestionarError(err2)
    }
  } catch (err) {
    consolex.gestionarError(err)
  }
}

const { comprobarSiElModuloExiste, modulosDisponibles } = require('./moduleManager')
const procesarObjetosdeConfiguracion = require('./utils/procesarObjetosdeConfiguracion')

/**
 * Actualiza la configuración de un guild.
 * @param {Guild} guild - El guild del cual se quiere actualizar la configuración.
 * @param {Object} botmodule - El módulo del cual se quiere actualizar la configuración.
 * @param {?String} botmodule.column - ¡Deprecated! La columna del módulo del cual se quiere actualizar la configuración.
 * @param {?String} botmodule.modulo - La columna del módulo del cual se quiere actualizar la configuración.
 * @param {JSON} botmodule.newconfig - La nueva configuración del módulo.
 */

module.exports.actualizarConfiguracionDelServidor = async (guild, botmodule) => {
  if (!comprobarSiElModuloExiste(botmodule.column || botmodule.modulo)) throw new Error('The module does not exist')

  botmodule.column = botmodule.modulo || botmodule.column

  module.exports.obtenerConfiguracionDelServidor(guild).then(configuracionDelServidor => {
    if (typeof configuracionDelServidor[botmodule.column] === 'object' && !Array.isArray(configuracionDelServidor[botmodule.column]) && configuracionDelServidor[botmodule.column] !== null) {
      configuracionDelServidor[botmodule.column] = procesarObjetosdeConfiguracion(configuracionDelServidor[botmodule.column], botmodule.newconfig)
      try {
        Database.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(configuracionDelServidor[botmodule.column]), guild.id])
        return null
      } catch (err) {
        consolex.gestionarError(err)
      }
    } else if (typeof botmodule.newconfig === 'object' && Array.isArray(configuracionDelServidor[botmodule.column]) && botmodule.newconfig !== null) {
      try {
        Database.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id])
        return null
      } catch (err) {
        consolex.gestionarError(err)
      }
    } else {
      try {
        Database.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id])
        return null
      } catch (err) {
        consolex.gestionarError(err)
      }
    }
  })
}

const rest = new REST({ version: '9' })

if (process.env.ENTORNO === 'publico') rest.setToken(process.env.PUBLIC_TOKEN)
else rest.setToken(process.env.INSIDER_TOKEN)

const crearListadoDeInteraccionesDeUnGuild = require('./utils/crearListadoDeInteraccionesDeUnGuild')

/**
 * Subir interacciones de un servidor.
 * @param {Guild} guild - El servidor del cual se quiere subir las interacciones.
 */

module.exports.subirInteraccionesDelServidor = async (guild) => {
  module.exports.obtenerConfiguracionDelServidor(guild).then(configuracionDelServidor => {
    rest.put(
      Routes.applicationGuildCommands(process.Client.user.id, guild.id), { body: crearListadoDeInteraccionesDeUnGuild(configuracionDelServidor) })
      .catch(err => {
        return consolex.gestionarError(err)
      }).then(() => { return null })
  })
}

/**
 * Elimina todos los datos de un servidor de la base de datos del bot.
 * @param {Guild} guild - El servidor del cual se quiere eliminar los datos.
 */

module.exports.eliminarDatosDelServidor = guild => {
  Database.tablasDisponibles.forEach(table => {
    try {
      Database.execute(`DELETE FROM ${table} WHERE guild = ?`, [guild.id])
    } catch (err) {
      consolex.gestionarError(err)
    }
  })
}

const YAML = require('js-yaml')
const randomstring = require('randomstring')

const { writeFileSync } = require('fs')

module.exports.exportarDatosDelServidorEnFormatoYAML = (guild) => {
  module.exports.obtenerConfiguracionDelServidor(guild).then(configuracionDelServidor => {
    if (configuracionDelServidor && typeof configuracionDelServidor === 'object') {
      const attachmentPath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.yml`
      writeFileSync(attachmentPath, YAML.dump(configuracionDelServidor))
      return attachmentPath
    }
  })
}

const { readFileSync } = require('fs')
const descargarArchivoDeConfiguracionYAML = require('./utils/descargarArchivoDeConfiguracionYAML')
const ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion = require('./utils/ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion')

module.exports.importarDatosDelServidorEnFormatoYAML = (guild, url) => {
  descargarArchivoDeConfiguracionYAML(url).then(descarga => {
    if (descarga.error) return descarga.error
    ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(YAML.load(readFileSync(descarga.ubicacionArchivo, { encoding: 'utf-8' })), ({ configuracionProcesada, errores }) => {
      let posicionArrayModulos = 0
      modulosDisponibles.forEach(modulo => {
        module.exports.actualizarConfiguracionDelServidor(guild, { column: modulo.nombre, newconfig: configuracionProcesada[modulo.nombre] || {} }).catch(err => {
          errores.push(`Base de datos: Error al actualizar la configuración del módulo ${modulo.nombre}`)
        })
        posicionArrayModulos++

        if (posicionArrayModulos === modulosDisponibles.length) {
          const erroresTotalesEnString = errores.length ? errores.join('\n') : null
          return erroresTotalesEnString
        }
      })
    })
  })
}
