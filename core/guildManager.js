/** @module GuildDataManager */

const Database = require('./databaseConnection')
const Consolex = require('./consolex')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

/**
 * Obtiene la configuración de un guild específico.
 * @param {Guild} guild - El guild del cual se quiere obtener la configuración.
 * @param {Function} callback - La función que se ejecutará cuando se obtenga la configuración.
 * @returns Object - La configuración del guild.
 */

module.exports.obtenerConfiguracionDelServidor = (guild, callback) => {
  Database.query('SELECT * FROM `guildData` WHERE guild = ?', [guild.id], (err, result) => {
    if (err) Consolex.gestionarError(err)

    if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
      Object.keys(result[0]).forEach(module => {
        try {
          result[0][module] = JSON.parse(result[0][module].trim())
        } catch (err2) {
          if (!err2.constructor.name === 'SyntaxError') Consolex.gestionarError(err2)
        }
      })

      if (result[0].common === null) {
        Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', ['common', JSON.stringify({ language: 'es-ES', prefix: '!', interactions: { enabled: true } }), guild.id], err2 => {
          if (err2) Consolex.gestionarError(err2)
          return module.exports.obtenerConfiguracionDelServidor(guild, callback)
        })
      }

      if (callback) callback(result[0] || {})
    } else {
      Database.query('INSERT INTO `guildData` (guild) VALUES (?)', [guild.id], err2 => {
        if (err2) Consolex.gestionarError(err2)
        module.exports.obtenerConfiguracionDelServidor(guild, callback)
      })
    }
  })
}

/** Procesa la configuración de un objeto. */

function procesarObjetosdeConfiguracion (config, newconfig, callback) {
  let count = 0
  if (newconfig instanceof Object === false) callback(newconfig)
  else {
    const newConfigProperties = Object.keys(newconfig)
    newConfigProperties.forEach(property => {
      if (Object.prototype.hasOwnProperty.call(config, property) && typeof newconfig[property] === 'object') {
        procesarObjetosdeConfiguracion(config[property], newconfig[property], newConfig => {
          config[property] = newConfig
          count += 1
        })
      } else {
        config[property] = newconfig[property]
        count += 1
      }

      if (count === newConfigProperties.length) {
        callback(config)
      }
    })
  }
}

const { comprobarSiElModuloExiste, modulosDisponibles } = require('./moduleManager')

/**
 * Actualiza la configuración de un guild.
 * @param {Guild} guild - El guild del cual se quiere actualizar la configuración.
 * @param {Object} botmodule - El módulo del cual se quiere actualizar la configuración.
 * @param {?String} botmodule.column - ¡Deprecated! La columna del módulo del cual se quiere actualizar la configuración.
 * @param {?String} botmodule.modulo - La columna del módulo del cual se quiere actualizar la configuración.
 * @param {JSON} botmodule.newconfig - La nueva configuración del módulo.
 * @param {Function} callback - La función que se ejecutará cuando se actualice la configuración.
 */

module.exports.actualizarConfiguracionDelServidor = (guild, botmodule, callback) => {
  if (!comprobarSiElModuloExiste(botmodule.column || botmodule.modulo)) throw new Error('The module does not exist')

  botmodule.column = botmodule.modulo || botmodule.column

  module.exports.obtenerConfiguracionDelServidor(guild, guildConfig => {
    if (typeof guildConfig[botmodule.column] === 'object' && !Array.isArray(guildConfig[botmodule.column]) && guildConfig[botmodule.column] !== null) {
      procesarObjetosdeConfiguracion(guildConfig[botmodule.column], botmodule.newconfig, newModuleConfig => {
        guildConfig[botmodule.column] = newModuleConfig
        Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(guildConfig[botmodule.column]), guild.id], err => {
          if (err) {
            Consolex.gestionarError(err)
            return callback(err)
          }

          if (callback) {
            return callback()
          }

          return null
        })
      })
    } else if (typeof botmodule.newconfig === 'object' && botmodule.newconfig !== null) {
      Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id], err => {
        if (err) {
          Consolex.gestionarError(err)
          return callback(err)
        }

        if (callback) {
          return callback()
        }

        return null
      })
    } else {
      Database.query('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id], err => {
        if (err) {
          Consolex.gestionarError(err)
          return callback(err)
        }

        if (callback) {
          return callback()
        }

        return null
      })
    }
  })
}

const rest = new REST({ version: '9' })

if (process.env.ENTORNO === 'publico') rest.setToken(process.env.PUBLIC_TOKEN)
else rest.setToken(process.env.INSIDER_TOKEN)

const { Collection } = require('discord.js')

/**
 * Crea el listado de interacciones de un servidor bajo demanda
 * @param {Object} guildConfig - La configuración del servidor.
 * @param {Function} callback - La función que se ejecutará cuando se haya creado el listado de interacciones.
 * @returns {Object} - El listado de interacciones.
 */

function crearListadoDeInteraccionesDeUnGuild (guildConfig, callback) {
  if (!callback) throw new Error('Callback function is required')

  // eslint-disable-next-line node/no-callback-literal
  if (Object.prototype.hasOwnProperty.call(guildConfig, 'interactions') && !guildConfig.interactions.showinteractions) return callback({})

  let interactionList = new Collection()

  process.Client.modulos.forEach(module => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, module.nombre) && guildConfig[module.nombre].enabled) {
      interactionList = interactionList.concat(process.Client.comandos.filter(command => command.module === module.nombre) || [])
    }
  })

  interactionList = interactionList.concat(process.Client.comandos.filter(command => !command.module) || [])

  if (!guildConfig.common.interactions.showcfginteractions) interactionList = interactionList.filter(command => !command.isConfigurationCommand)

  return callback(interactionList.map(command => command.interactionData.toJSON()))
}

/**
 * Subir interacciones de un servidor.
 * @param {Guild} guild - El servidor del cual se quiere subir las interacciones.
 * @param {Function} callback - La función que se ejecutará cuando se haya subido las interacciones.
 */

module.exports.subirInteraccionesDelServidor = (guild, callback) => {
  if (!callback) throw new Error('Callback is required')
  module.exports.obtenerConfiguracionDelServidor(guild, guildConfig => {
    crearListadoDeInteraccionesDeUnGuild(guildConfig, guildInteractionList => {
      console.log(guildInteractionList)
      rest.put(
        Routes.applicationGuildCommands(process.Client.user.id, guild.id), { body: guildInteractionList })
        .catch(err => {
          if (err) return callback(err)
          return callback()
        }).then(() => { callback() })
    })
  })
}

/**
 * Elimina todos los datos de un servidor de la base de datos del bot.
 * @param {Guild} guild - El servidor del cual se quiere eliminar los datos.
 */

module.exports.eliminarDatosDelServidor = guild => {
  const databaseTables = ['guildData', 'guildAutoReply', 'guildCustomCommands', 'memberData', 'guildSuggestions']
  databaseTables.forEach(table => {
    Database.query(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], err => {
      if (err) Consolex.gestionarError(err)
    })
  })
}

const YAML = require('js-yaml')
const randomstring = require('randomstring')

const { writeFileSync } = require('fs')

module.exports.exportarDatosDelServidorEnFormatoYAML = (guild, callback) => {
  module.exports.obtenerConfiguracionDelServidor(guild, guildConfig => {
    if (guildConfig && typeof guildConfig === 'object') {
      const attachmentPath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.yml`
      writeFileSync(attachmentPath, YAML.dump(guildConfig))
      return callback(attachmentPath)
    }
  })
}

/**
 * @param {String} modulo
 * @param {Object} configuracionParaComparar
 */

function ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion (configuracionParaComparar, callback) {
  const errores = []
  const configuracionProcesada = {}
  let posicionArrayModulos = 0

  modulosDisponibles.forEach(modulo => {
    const datosDelModulo = modulosDisponibles.filter(module => module.nombre === modulo)[0]
    if (datosDelModulo && Object.prototype.hasOwnProperty.call(datosDelModulo, 'configuracion')) {
      datosDelModulo.configuracion.forEach(parametro => {
        if (Object.prototype.hasOwnProperty.call(configuracionParaComparar, parametro.nombre)) {
          // eslint-disable-next-line valid-typeof
          if (configuracionParaComparar[parametro.nombre] && typeof configuracionParaComparar[parametro.nombre] === parametro.tipo) {
            configuracionProcesada[parametro.nombre] = configuracionParaComparar[parametro.nombre]
          } else {
            errores.push(`El parámetro ${parametro.nombre} debe ser de tipo ${parametro.tipo}`)
          }
        } else {
          errores.push(`El parámetro ${parametro.nombre} no existe`)
        }
      })
    } else {
      errores.push(`El módulo ${modulo.nombre} no tiene configuración`)
    }

    posicionArrayModulos++

    if (posicionArrayModulos === modulosDisponibles.length) {
      return callback(errores, configuracionProcesada)
    }
  })
}

const { readFileSync } = require('fs')

module.exports.importarDatosDelServidorEnFormatoYAML = (guild, filePath, callback) => {
  const archivoDeConfiguracionProcesado = YAML.load(readFileSync('./modeloejemplo.yml', { encoding: 'utf-8' }))
  ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(archivoDeConfiguracionProcesado, (errores, configuracionProcesada) => {
    modulosDisponibles.forEach(modulo => {
      module.exports.actualizarConfiguracionDelServidor(guild, { column: modulo.nombre, newconfig: archivoDeConfiguracionProcesado[modulo] })
    })
  })
}
