/* eslint-disable valid-typeof */
/* eslint-disable node/no-callback-literal */
/** @module GuildDataManager */

const Database = require('./databaseManager')
const Consolex = require('./consolex')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

/**
 * Obtiene la configuración de un guild específico.
 * @param {Guild} guild - El guild del cual se quiere obtener la configuración.
 * @returns Object - La configuración del guild.
 */

module.exports.obtenerConfiguracionDelServidor = async (guild) => {
  try {
    const [guildData] = await Database.execute('SELECT * FROM `guildData` WHERE guild = ?', [guild.id]).then(result => result[0])

    if (guildData) {
      Object.keys(guildData).forEach(module => {
        try {
          guildData[module] = JSON.parse(guildData[module].trim())
        } catch (err2) {
          if (!err2.constructor.name === 'SyntaxError') Consolex.gestionarError(err2)
        }
      })

      if (guildData.common === null) {
        try {
          Database.execute('UPDATE `guildData` SET ?? = ? WHERE guild = ?', ['common', JSON.stringify({ language: 'es-ES', prefix: '!', interactions: { enabled: true } }), guild.id])
          return module.exports.obtenerConfiguracionDelServidor(guild)
        } catch (err2) {
          Consolex.gestionarError(err2)
        }
      }

      return guildData || {}
    } else {
      try {
        Database.execute('INSERT INTO `guildData` (guild) VALUES (?)', [guild.id])
        return module.exports.obtenerConfiguracionDelServidor(guild)
      } catch (err2) {
        Consolex.gestionarError(err2)
      }
    }
  } catch (err) {
    Consolex.gestionarError(err)
  }
}

function procesarObjetosdeConfiguracion (config, newconfig) {
  let count = 0
  if (newconfig instanceof Object === false) return newconfig
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
        return config
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
 */

module.exports.actualizarConfiguracionDelServidor = async (guild, botmodule) => {
  if (!comprobarSiElModuloExiste(botmodule.column || botmodule.modulo)) throw new Error('The module does not exist')

  botmodule.column = botmodule.modulo || botmodule.column

  module.exports.obtenerConfiguracionDelServidor(guild).then(guildConfig => {
    if (typeof guildConfig[botmodule.column] === 'object' && !Array.isArray(guildConfig[botmodule.column]) && guildConfig[botmodule.column] !== null) {
      procesarObjetosdeConfiguracion(guildConfig[botmodule.column], botmodule.newconfig, newModuleConfig => {
        guildConfig[botmodule.column] = newModuleConfig
        try {
          Database.execute('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(guildConfig[botmodule.column]), guild.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
          return err
        }
      })
    } else if (typeof botmodule.newconfig === 'object' && Array.isArray(guildConfig[botmodule.column]) && botmodule.newconfig !== null) {
      try {
        Database.execute('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, JSON.stringify(botmodule.newconfig), guild.id])
        return null
      } catch (err) {
        Consolex.gestionarError(err)
        return err
      }
    } else {
      try {
        Database.execute('UPDATE `guildData` SET ?? = ? WHERE guild = ?', [botmodule.column, botmodule.newconfig, guild.id])
        return null
      } catch (err) {
        Consolex.gestionarError(err)
        return err
      }
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
  Database.tablasDisponibles.forEach(table => {
    Database.execute(`DELETE FROM ${table} WHERE guild = ?`, [guild.id], err => {
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

const Downloader = require('nodejs-file-downloader')

async function descargarArchivoDeConfiguracionYAML (url, callback) {
  const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({ charset: 'alphabetic' })}.yml`

  const downloader = new Downloader({
    url,
    directory: './temp',
    filename: nombreTemporalAleatorioDelArchivo
  })
  try {
    await downloader.download()
    return callback({ ubicacionArchivo: `./temp/${nombreTemporalAleatorioDelArchivo}` })
  } catch (error) {
    return callback({ error: error.message })
  }
}

/**
 * @param {Object} modeloDeConfiguracion
 * @param {Object} configuracionAComparar
 * @param {Object} callback
 */

function loopDeComprobacion (modeloDeConfiguracion, configuracionAComparar, callback) {
  const errores = []
  const configuracionProcesada = {}
  const propiedadesModeloConfiguracion = Object.keys(modeloDeConfiguracion)
  const propiedadesConfiguracionAComparar = Object.keys(configuracionAComparar || {})

  let posicionArray = 0

  propiedadesModeloConfiguracion.forEach(propiedad => {
    if (propiedadesConfiguracionAComparar.includes(propiedad)) {
      if (typeof modeloDeConfiguracion[propiedad] === 'object') {
        loopDeComprobacion(modeloDeConfiguracion[propiedad], configuracionAComparar[propiedad], procesado => {
          if (procesado.error) errores.push(procesado.error)
          else configuracionProcesada[propiedad] = procesado.configuracionProcesada
          posicionArray++
        })
      } else {
        if (typeof configuracionAComparar[propiedad] === modeloDeConfiguracion[propiedad]) configuracionProcesada[propiedad] = configuracionAComparar[propiedad]
        else errores.push(`La propiedad ${propiedad} no es del tipo ${modeloDeConfiguracion[propiedad]}`)
        posicionArray++
      }
    } else {
      errores.push(`La propiedad ${propiedad} no existe en la configuración`)
      posicionArray++
    }

    if (posicionArray === propiedadesModeloConfiguracion.length) {
      return callback({ configuracionProcesada, errores: errores.length ? errores : [] })
    }
  })
}

function ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion (configuracionImportada, callback) {
  const errores = []
  const configuracionProcesada = {}

  let posicionArray = 0

  modulosDisponibles.forEach(module => {
    if (Object.prototype.hasOwnProperty.call(configuracionImportada, module.nombre)) {
      loopDeComprobacion(module.modeloDeConfiguracion, configuracionImportada[module.nombre], procesado => {
        if (procesado.error) errores.concat(procesado.error)
        configuracionProcesada[module.nombre] = procesado.configuracionProcesada
      })
    } else {
      errores.push(`El módulo ${module.nombre} no existe en la configuración`)
    }

    posicionArray++
    if (posicionArray === modulosDisponibles.length) {
      return callback({ configuracionProcesada, errores: errores.length ? errores : [] })
    }
  })
}

const { readFileSync } = require('fs')

module.exports.importarDatosDelServidorEnFormatoYAML = (guild, url, callback) => {
  if (!callback) throw new Error('Se necesita un callback')

  descargarArchivoDeConfiguracionYAML(url, descarga => {
    if (descarga.error) return callback(descarga.error)
    ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(YAML.load(readFileSync(descarga.ubicacionArchivo, { encoding: 'utf-8' })), ({ configuracionProcesada, errores }) => {
      let posicionArrayModulos = 0
      modulosDisponibles.forEach(modulo => {
        module.exports.actualizarConfiguracionDelServidor(guild, { column: modulo.nombre, newconfig: configuracionProcesada[modulo.nombre] || {} }, (err) => {
          if (err) errores.push(`Base de datos: Error al actualizar la configuración del módulo ${modulo.nombre}`)
        })
        posicionArrayModulos++

        if (posicionArrayModulos === modulosDisponibles.length) {
          const erroresTotalesEnString = errores.length ? errores.join('\n') : null
          return callback(erroresTotalesEnString)
        }
      })
    })
  })
}
