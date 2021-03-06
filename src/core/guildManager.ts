import Consolex from './consolex.js'
import Module from './classes/Module.js'
import procesarObjetosdeConfiguracion from './utils/procesarObjetosdeConfiguracion.js'
import ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion from './utils/ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion.js'

import * as YAML from 'js-yaml'
import * as Downloader from 'nodejs-file-downloader'
import * as randomstring from 'randomstring'

import { PoolConnection, tablasDisponibles } from './databaseManager.js'
import { Guild } from 'discord.js'
import { ClientModuleManager, ClientUser } from '../client.js'
import { writeFileSync, readFileSync } from 'fs'

class GuildManager {
  guilds: Object

  constructor () {
    this.guilds = ClientUser.guilds.cache.toJSON()
  }

  actulizarConfiguracionDelServidor (guild: Guild, datos: { modulo: Module; nuevaConfiguracion: { [key: string]: any } }) { // skipcq: JS-0323
    if (!ClientModuleManager.comprobarSiElModuloExiste(datos.modulo.nombre)) {
      throw new Error('The module does not exist')
    }

    datos.modulo.nombre = datos.modulo.nombre.toLocaleLowerCase()
    this.obtenerConfiguracionDelServidor(guild).then((configuracionDelServidor: { [index: string]: any }) => {
      if (typeof configuracionDelServidor[datos.modulo.nombre] === 'object' && !Array.isArray(configuracionDelServidor[datos.modulo.nombre]) && configuracionDelServidor[datos.modulo.nombre] !== null) {
        configuracionDelServidor[datos.modulo.nombre] = procesarObjetosdeConfiguracion(configuracionDelServidor[datos.modulo.nombre], datos.nuevaConfiguracion)
        try {
          PoolConnection.query('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(configuracionDelServidor[datos.modulo.nombre]), guild?.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      } else if (typeof datos.nuevaConfiguracion === 'object' && Array.isArray(configuracionDelServidor[datos.modulo.nombre]) && datos.nuevaConfiguracion !== null) {
        try {
          PoolConnection.query('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(datos.nuevaConfiguracion), guild?.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      } else {
        try {
          PoolConnection.query('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(datos.nuevaConfiguracion), guild?.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      }
    }
    ).catch(err => Consolex.gestionarError(err))
  }

  async crearNuevoRegistroDeServidor (guild: Guild) {
    const configuracionDelServidor: { [index: string]: any } = {}
    try {
      await PoolConnection.query('INSERT INTO `guildConfigurations` (guild) VALUES (?)', [guild?.id])
      ClientModuleManager.modulosDisponibles.forEach((modulo) => {
        configuracionDelServidor[modulo.nombre] = modulo.configuracionPredeterminada
        this.actulizarConfiguracionDelServidor(guild, { modulo, nuevaConfiguracion: modulo.configuracionPredeterminada })
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async obtenerConfiguracionDelServidor (guild: Guild | null): Promise<{ [key: string]: any }> {
    if (!(guild instanceof Guild)) throw new Error('El "Guild"" especificado no existe.')

    const configuracionDelServidor: { [index: string]: any } = await PoolConnection.query('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild?.id]).then((result) => result[0]).catch((obtenerDatosError) => Consolex.gestionarError(obtenerDatosError))
    const configuracionDelServidorProcesado: { [index: string]: any } = {}

    if (!configuracionDelServidor) {
      this.crearNuevoRegistroDeServidor(guild).then(() => {
        return this.obtenerConfiguracionDelServidor(guild)
      }).catch(err => Consolex.gestionarError(err))
    }

    try {
      Object.keys(configuracionDelServidor).forEach((module) => {
        try {
          configuracionDelServidorProcesado[module] = JSON.parse(configuracionDelServidor[module])
        } catch (jsonParseError) {
          if (jsonParseError instanceof Error && jsonParseError.constructor.name !== SyntaxError.name) { Consolex.gestionarError(jsonParseError) }
        }
      })
    } catch (error) {
      Consolex.gestionarError(error)
    }

    return configuracionDelServidorProcesado
  }

  async obtenerConfiguracionDelServidorPorModulo (guild: Guild | null, modulo: string) {
    if (!(guild instanceof Guild)) throw new Error('El "Guild"" especificado no existe.')
    try {
      const configuracionDelServidor: { [index: string]: any } = await PoolConnection.query('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild?.id]).then((result) => result[0])

      if (configuracionDelServidor && typeof modulo === 'string') {
        return configuracionDelServidor[modulo.toLowerCase()] || { guild: guild?.id }
      }

      try {
        this.crearNuevoRegistroDeServidor(guild)
          .then(() => {
            return this.obtenerConfiguracionDelServidorPorModulo(guild, modulo)
          })
          .catch((err) => Consolex.gestionarError(err))
      } catch (err2) {
        Consolex.gestionarError(err2)
      }
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  eliminarRegistroDeServidor (guild: Guild) {
    try {
      tablasDisponibles.forEach((table) => {
        try {
          PoolConnection.query(`DELETE FROM ${table} WHERE guild = ?`, [guild?.id])
        } catch (err) {
          Consolex.gestionarError(err)
        }
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async exportarConfiguracionDelServidor (guild: Guild | null): Promise<string> {
    if (!(guild instanceof Guild)) throw new Error('El "Guild" especificado no existe.')

    const AttachmentBuilderPath = `./temp/${randomstring.generate({
      charset: 'alphabetic'
    })}.yml`
    const configuracionDelServidor = await this.obtenerConfiguracionDelServidor(guild)

    if (configuracionDelServidor && typeof configuracionDelServidor === 'object'
    ) {
      writeFileSync(AttachmentBuilderPath, YAML.dump(configuracionDelServidor))
    } else {
      this.crearNuevoRegistroDeServidor(guild)
        .then(() => {
          return this.exportarConfiguracionDelServidor(guild)
        })
        .catch((err) => {
          Consolex.gestionarError(err)
        })
    }

    return AttachmentBuilderPath
  }

  async importarConfiguracionDelServidor (guild: Guild | null, attachmentBuilderSource: string | undefined): Promise<string> {
    if (!(guild instanceof Guild)) throw new Error('El "Guild" especificado no existe.')
    if (typeof attachmentBuilderSource !== 'string') throw new Error('El "Guild" especificado no existe.')

    const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({
      charset: 'alphabetic'
    })}.yml`

    // eslint-disable-next-line new-cap
    await new Downloader.default({
      url: attachmentBuilderSource,
      directory: './temp',
      fileName: nombreTemporalAleatorioDelArchivo
    }).download()

    const datosAjustados = ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(YAML.load(readFileSync(`./temp/${nombreTemporalAleatorioDelArchivo}`, { encoding: 'utf-8' })))
    const errores = datosAjustados.errores
    const configuracionProcesada: { [index: string]: any } = datosAjustados.configuracionProcesada

    const registro = [
      `Importando configuraci??n para el servidor ${guild?.name}`,
      `Guild: ${guild?.id}`,
      `Fecha (horario del bot): ${new Date().toLocaleString()}`,
      ...errores
    ]

    let posicionArrayModulos = 0

    ClientModuleManager.modulosDisponibles.forEach((modulo) => {
      try {
        registro.push(`INF: Importando configuraci??n para el m??dulo ${modulo.nombre}`)
        this.actulizarConfiguracionDelServidor(guild, {
          modulo,
          nuevaConfiguracion: configuracionProcesada[modulo.nombre] || {}
        })
      } catch (actualizarConfiguracionDelServidorError) {
        registro.push(`ERR: Problemas al importar la configuraci??n para el m??dulo ${modulo.nombre}: ${actualizarConfiguracionDelServidorError}`)
      }
      posicionArrayModulos++

      if (
        posicionArrayModulos === ClientModuleManager.modulosDisponibles.length
      ) {
        registro.push('INF: Importaci??n finalizada')
      }
    })

    return registro.length ? registro.join('\n') : 'No log'
  }
}

export default GuildManager
