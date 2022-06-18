import Consolex from './consolex'
import Module from './classes/Module'
import procesarObjetosdeConfiguracion from './utils/procesarObjetosdeConfiguracion'
import ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion from './utils/ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion'

import * as YAML from 'js-yaml'
import * as Downloader from 'nodejs-file-downloader'
import * as randomstring from 'randomstring'

import { PoolConnection, tablasDisponibles } from './databaseManager'
import { Guild } from 'discord.js'
import { ClientModuleManager, ClientUser } from '../client'
import { writeFileSync, readFileSync } from 'fs'

class GuildManager {
  guilds: Object

  constructor () {
    this.guilds = ClientUser.guilds.cache.toJSON()
  }

  actulizarConfiguracionDelServidor (
    guild: Guild,
    datos: { modulo: Module; nuevaConfiguracion: { [key: string]: any } } // skipcq: JS-0323
  ) {
    if (!ClientModuleManager.comprobarSiElModuloExiste(datos.modulo.nombre)) {
      throw new Error('The module does not exist')
    }
    this.obtenerConfiguracionDelServidor(guild).then(
      (configuracionDelServidor) => {
        if (
          typeof configuracionDelServidor[datos.modulo.nombre] === 'object' &&
          !Array.isArray(configuracionDelServidor[datos.modulo.nombre]) &&
          configuracionDelServidor[datos.modulo.nombre] !== null
        ) {
          configuracionDelServidor[datos.modulo.nombre] =
            procesarObjetosdeConfiguracion(
              configuracionDelServidor[datos.modulo.nombre],
              datos.nuevaConfiguracion
            )
          try {
            PoolConnection.execute(
              'UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?',
              [
                datos.modulo.nombre,
                JSON.stringify(configuracionDelServidor[datos.modulo.nombre]),
                guild.id
              ]
            )
            return null
          } catch (err) {
            Consolex.gestionarError(err)
          }
        } else if (
          typeof datos.nuevaConfiguracion === 'object' &&
          Array.isArray(configuracionDelServidor[datos.modulo.nombre]) &&
          datos.nuevaConfiguracion !== null
        ) {
          try {
            PoolConnection.execute(
              'UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?',
              [
                datos.modulo.nombre,
                JSON.stringify(datos.nuevaConfiguracion),
                guild.id
              ]
            )
            return null
          } catch (err) {
            Consolex.gestionarError(err)
          }
        } else {
          try {
            PoolConnection.execute(
              'UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?',
              [datos.modulo.nombre, datos.nuevaConfiguracion, guild.id]
            )
            return null
          } catch (err) {
            Consolex.gestionarError(err)
          }
        }
      }
    ).catch(err => Consolex.gestionarError(err))
  }

  async crearNuevoRegistroDeServidor (guild: Guild) {
    const configuracionDelServidor = {}
    try {
      await PoolConnection.execute(
        'INSERT INTO `guildConfigurations` (guild) VALUES (?)',
        [guild.id]
      )
      ClientModuleManager.modulosDisponibles.forEach((modulo) => {
        configuracionDelServidor[modulo.nombre] =
          modulo.configuracionPredeterminada
        this.actulizarConfiguracionDelServidor(guild, {
          modulo,
          nuevaConfiguracion: modulo.configuracionPredeterminada
        })
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async obtenerConfiguracionDelServidor (guild: Guild): Promise<Object> {
    try {
      const configuracionDelServidor = await PoolConnection.execute(
        'SELECT * FROM `guildConfigurations` WHERE guild = ?',
        [guild.id]
      ).then((result) => result[0])
      const configuracionDelServidorProcesado = {}
      if (configuracionDelServidor) {
        Object.keys(configuracionDelServidor).forEach((module) => {
          try {
            configuracionDelServidorProcesado[module] = JSON.parse(
              configuracionDelServidor[module].trim()
            )
          } catch (err2) {
            if (err2.constructor.name !== SyntaxError.name) {
              Consolex.gestionarError(err2)
            }
          }
        })

        return configuracionDelServidorProcesado || { guild: guild.id }
      }

      try {
        this.crearNuevoRegistroDeServidor(guild).then(() => {
          return this.obtenerConfiguracionDelServidor(guild)
        }).catch(err => Consolex.gestionarError(err))
      } catch (err2) {
        Consolex.gestionarError(err2)
      }
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async obtenerConfiguracionDelServidorPorModulo (guild: Guild, modulo: string) {
    try {
      const configuracionDelServidor = await PoolConnection.execute(
        'SELECT * FROM `guildConfigurations` WHERE guild = ?',
        [guild.id]
      ).then((result) => result[0])

      if (configuracionDelServidor && typeof modulo === 'string') {
        return configuracionDelServidor[modulo.toLowerCase()] || { guild: guild.id }
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
          PoolConnection.execute(`DELETE FROM ${table} WHERE guild = ?`, [
            guild.id
          ])
        } catch (err) {
          Consolex.gestionarError(err)
        }
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async exportarConfiguracionDelServidor (guild: Guild): Promise<string> {
    const attachmentPath = `./temp/${randomstring.generate({
      charset: 'alphabetic'
    })}.yml`
    const configuracionDelServidor = await this.obtenerConfiguracionDelServidor(
      guild
    )

    if (
      configuracionDelServidor &&
      typeof configuracionDelServidor === 'object'
    ) {
      writeFileSync(attachmentPath, YAML.dump(configuracionDelServidor))
      return attachmentPath
    } else {
      this.crearNuevoRegistroDeServidor(guild)
        .then(() => {
          return this.exportarConfiguracionDelServidor(guild)
        })
        .catch((err) => {
          Consolex.gestionarError(err)
        })
    }
  }

  async importarConfiguracionDelServidor (
    guild: Guild,
    attachmentSource: string
  ) {
    const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({
      charset: 'alphabetic'
    })}.yml`

    // eslint-disable-next-line new-cap
    await new Downloader.default({
      url: attachmentSource,
      directory: './temp',
      fileName: nombreTemporalAleatorioDelArchivo
    }).download()

    const { configuracionProcesada, errores } =
      ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(
        YAML.load(
          readFileSync(nombreTemporalAleatorioDelArchivo, {
            encoding: 'utf-8'
          })
        )
      )

    const registro = [
      `Importando configuración para el servidor ${guild.name}`,
      `Guild: ${guild.id}`,
      `Fecha (horario del bot): ${new Date().toLocaleString()}`,
      ...errores
    ]

    let posicionArrayModulos = 0

    ClientModuleManager.modulosDisponibles.forEach((modulo) => {
      try {
        registro.push(
          `INF: Importando configuración para el módulo ${modulo.nombre}`
        )
        this.actulizarConfiguracionDelServidor(guild, {
          modulo,
          nuevaConfiguracion: configuracionProcesada[modulo.nombre] || {}
        })
      } catch (err) {
        registro.push(
          `ERR: Problemas al importar la configuración para el módulo ${modulo.nombre}: ${err.message}`
        )
      }
      posicionArrayModulos++

      if (
        posicionArrayModulos === ClientModuleManager.modulosDisponibles.length
      ) {
        registro.push('INF: Importación finalizada')
        const cantidadDeErrores = registro.filter((registro) =>
          registro.startsWith('ERR:')
        ).length

        const registroProcesado = registro.length ? registro.join('\n') : null
        return { registroProcesado, cantidadDeErrores }
      }
    })
  }
}

export default GuildManager
