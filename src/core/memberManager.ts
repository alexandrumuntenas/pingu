import { GuildMember } from 'discord.js'
import Module from './classes/Module'
import Consolex from './consolex'
import { PoolConnection } from './databaseManager'
class MemberManager {
  constructor () {
    throw new Error('Class not finished yet!')
  }

  async obtenerDatosDelUsuario (member: GuildMember) {
    try {
      const [memberData] = await PoolConnection.execute(
        'SELECT * FROM `memberData` WHERE member = ? AND guild = ?',
        [member.id, member.guild.id]
      ).then((result) =>
        Object.prototype.hasOwnProperty.call(result, 0)
          ? result[0]
          : this.crearUsuario(member)
      )

      return memberData[0]
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async actualizarDatosDelUsuario (
    member: GuildMember,
    datos: { modulo: Module; nuevosDatos: { [key: string]: any } } // skipcq: JS-0323
  ) {
    try {
      await PoolConnection.execute(
        'UPDATE `memberData` SET ?? = ? WHERE `guild` = ? AND `member` = ?',
        [
          datos.modulo.nombre,
          JSON.stringify(datos.nuevosDatos),
          member.guild.id,
          member.id
        ]
      )
      return this.obtenerDatosDelUsuario(member)
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  async crearUsuario (member: GuildMember) {
    try {
      await PoolConnection.execute(
        'INSERT INTO `memberData` (`guild`, `member`) VALUES (?, ?)',
        [member.guild.id, member.id]
      )
      return this.obtenerDatosDelUsuario(member)
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  eliminarDatosDelUsuario (member: GuildMember) {
    try {
      PoolConnection.execute(
        'DELETE FROM `memberData` WHERE `guild` = ? AND `member` = ?',
        [member.guild.id, member.id]
      )
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }
}

export default MemberManager
