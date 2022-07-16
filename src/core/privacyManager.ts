import { Guild, GuildMember, User } from 'discord.js'
import { writeFileSync } from 'fs'
import { PoolConnection, tablasDisponibles } from './databaseManager'

import Consolex from './consolex'
import * as randomstring from 'randomstring'

class PrivacyManager {
  tablasConDatosDeUsuario: string[]
  tablasConDatosDeServidor: string[]

  constructor () {
    this.tablasConDatosDeServidor = tablasDisponibles.filter((tabla) => tabla.startsWith('guild'))
    this.tablasConDatosDeUsuario = tablasDisponibles.filter((tabla) => tabla.startsWith('member'))
  }

  dataUserDataTakeout (user: User): string {
    const documentoConTodosLosDatos: { [index: string]: any } = {}
    const rutaDocumento = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.png`

    this.tablasConDatosDeUsuario.forEach((tabla) => {
      PoolConnection.execute('SELECT * FROM ?? WHERE member ?', [tabla, user.id]).catch((error) => {
        Consolex.gestionarError(error)
      }).then((datos: any) => {
        if (Object.prototype.hasOwnProperty.call(datos, 0)) {
          documentoConTodosLosDatos[tabla] = datos[0]
        }
      })
    })

    writeFileSync(rutaDocumento, JSON.stringify(documentoConTodosLosDatos))

    return rutaDocumento
  }

  eliminarGuildMemberData (member: GuildMember): void {
    this.tablasConDatosDeUsuario.forEach((tabla) => {
      PoolConnection.execute('DELETE FROM ?? WHERE member = ? AND guild = ?', [tabla, member.id, member.guild.id]).catch((error) => {
        Consolex.gestionarError(error)
      })
    })
  }

  eliminarGuildData (guild: Guild) {
    this.tablasConDatosDeServidor.forEach((tabla) => {
      PoolConnection.execute('DELETE FROM ?? WHERE guild = ?', [tabla, guild.id]).catch((error) => {
        Consolex.gestionarError(error)
      })
    })
  }
}

export default PrivacyManager
