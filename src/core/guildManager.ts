import Consolex from './consolex'
import Module from '../classes/Module'
import procesarObjetosdeConfiguracion from './utils/procesarObjetosdeConfiguracion'
import ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion from './utils/ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion'
import descargarArchivoDeConfiguracion from './utils/descargarArchivoDeConfiguracionYAML'

import * as YAML from 'js-yaml'
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
    datos: { modulo: Module; nuevaConfiguracion: Object }
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
    )
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
        })
      } catch (err2) {
        Consolex.gestionarError(err2)
      }
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async obtenerConfiguracionDelServidorPorModulo (guild: Guild, modulo: Module) {
    try {
      const configuracionDelServidor = await PoolConnection.execute(
        'SELECT * FROM `guildConfigurations` WHERE guild = ?',
        [guild.id]
      ).then((result) => result[0])

      if (configuracionDelServidor) {
        return configuracionDelServidor[modulo.nombre] || { guild: guild.id }
      }

      try {
        this.crearNuevoRegistroDeServidor(guild).then(() => {
          return this.obtenerConfiguracionDelServidorPorModulo(guild, modulo)
        })
      } catch (err2) {
        Consolex.gestionarError(err2)
      }
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async eliminarRegistroDeServidor (guild: Guild) {
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
      this.crearNuevoRegistroDeServidor(guild).then(() => {
        return this.exportarConfiguracionDelServidor(guild)
      })
    }
  }

  async importarConfiguracionDelServidor (guild: Guild, attachmentSource: string) {
    descargarArchivoDeConfiguracion(attachmentSource)
      .catch(error => { throw new Error(error) })
      .then((descarga) => {
        const configuracionProcesada = ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(YAML.load(readFileSync(descarga.ubicacionArchivo, { encoding: 'utf-8' })))

        let posicionArrayModulos = 0
        ClientModuleManager.modulosDisponibles.forEach((modulo) => {
          module.exports
            .actualizarConfiguracionDelServidor(guild, {modulo: modulo.nombre, newconfig: configuracionProcesada[modulo.nombre] || {}
            }).catch((err) => {
              errores.push(`Base de datos: Error al actualizar la configuración del módulo ${modulo.nombre}. Error:\n${err}`)
            })
          posicionArrayModulos++

          if (
            posicionArrayModulos ===
              ClientModuleManager.modulosDisponibles.length
          ) {
            const erroresTotalesEnString = errores.length
              ? errores.join('\n')
              : null
            return erroresTotalesEnString
          }
        }
        )
      })
  }
}

export default GuildManager
