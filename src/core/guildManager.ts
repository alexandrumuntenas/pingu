import Consolex from './consolex'
import Module from '../classes/Module'
import procesarObjetosdeConfiguracion from './utils/procesarObjetosdeConfiguracion'

// import * as YAML from 'js-yaml'
// import * as randomstring from 'randomstring'

import { PoolConnection, tablasDisponibles } from './databaseManager'
import { Guild } from 'discord.js'
import { ClientModuleManager, ClientUser } from '../client'
// import { writeFileSync, readFileSync } from 'fs'

class GuildManager {
  guilds: Object

  constructor () {
    this.guilds = ClientUser.guilds.cache.toJSON()
  }

  actulizarConfiguracionDelServidor (guild: Guild, datos: { modulo: Module, nuevaConfiguracion: Object }) {
    if (!ClientModuleManager.comprobarSiElModuloExiste(datos.modulo.nombre)) {
      throw new Error('The module does not exist')
    }
    this.obtenerConfiguracionDelServidor(guild).then((configuracionDelServidor) => {
      if (typeof configuracionDelServidor[datos.modulo.nombre] === 'object' && !Array.isArray(configuracionDelServidor[datos.modulo.nombre]) && configuracionDelServidor[datos.modulo.nombre] !== null) {
        configuracionDelServidor[datos.modulo.nombre] =
            procesarObjetosdeConfiguracion(configuracionDelServidor[datos.modulo.nombre], datos.nuevaConfiguracion)
        try {
          PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(configuracionDelServidor[datos.modulo.nombre]), guild.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      } else if (typeof datos.nuevaConfiguracion === 'object' && Array.isArray(configuracionDelServidor[datos.modulo.nombre]) && datos.nuevaConfiguracion !== null) {
        try {
          PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(datos.nuevaConfiguracion), guild.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      } else {
        try {
          PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, datos.nuevaConfiguracion, guild.id])
          return null
        } catch (err) {
          Consolex.gestionarError(err)
        }
      }
    })
  };

  async crearNuevoRegistroDeServidor (guild: Guild) {
    const configuracionDelServidor = {}

    PoolConnection.execute('INSERT INTO `guildConfigurations` (guild) VALUES (?)', [guild.id]).then(() => {
      ClientModuleManager.modulosDisponibles.forEach((modulo) => {
        configuracionDelServidor[modulo.nombre] = modulo.configuracionPredeterminada
        this.actulizarConfiguracionDelServidor(guild, { modulo, nuevaConfiguracion: modulo.configuracionPredeterminada })
      })
    })
  }

  async obtenerConfiguracionDelServidor (guild: Guild): Promise<Object> {
    try {
      const configuracionDelServidor = await PoolConnection.execute('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild.id]).then((result) => result[0])
      const configuracionDelServidorProcesado = {}
      if (configuracionDelServidor) {
        Object.keys(configuracionDelServidor).forEach((module) => {
          try {
            configuracionDelServidorProcesado[module] = JSON.parse(configuracionDelServidor[module].trim())
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
      const configuracionDelServidor = await PoolConnection.execute('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild.id]).then((result) => result[0])

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
          PoolConnection.execute(`DELETE FROM ${table} WHERE guild = ?`, [guild.id])
        } catch (err) {
          Consolex.gestionarError(err)
        }
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  /* async importarConfiguracionDelServidor (guild: Guild, configuracionDelServidor: Object) {
    const configuracionDelFicheroYAML = {}
    try {
      Object.keys().forEach((modulo) => {
        this.actulizarConfiguracionDelServidor(guild, { modulo: ClientModuleManager.getModulo(modulo), nuevaConfiguracion: configuracionDelServidor[modulo] })
      })
    } catch (err) {
      Consolex.gestionarError(err)
    }
  } */
}

export default GuildManager
