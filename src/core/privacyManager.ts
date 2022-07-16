import { Guild, GuildMember } from "discord.js"
import Consolex from "./consolex"
import { PoolConnection, tablasDisponibles } from "./databaseManager"

class PrivacyManager {
  dataTakeout () {
    return 'Not implemented'
  }

  eliminarGuildMemberData (member: GuildMember): void {
    const tablasConDatosDeUsuario = tablasDisponibles.filter((tabla) => tabla.startsWith('member'))

    tablasConDatosDeUsuario.forEach((tabla) => {
      PoolConnection.execute('DELETE FROM ?? WHERE member = ? AND guild = ?', [tabla, member.id, member.guild.id]).catch((error) => {
        Consolex.gestionarError(error)
      })
    })
  }

  eliminarGuildData (guild: Guild) {
    const tablasConDatosDeServidor = tablasDisponibles.filter((tabla) => tabla.startsWith('guild'))

    tablasConDatosDeServidor.forEach((tabla) => {
      PoolConnection.execute('DELETE FROM ?? WHERE guild = ?', [tabla, guild.id]).catch((error) => {
        Consolex.gestionarError(error)
      })
    })
  }
}

export default PrivacyManager
