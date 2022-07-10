import * as randomstring from 'randomstring'
import Consolex from '../../core/consolex'
import { PoolConnection } from '../../core/databaseManager'

class AutoReply {
  guild: string
  desencadenante: string
  propiedades: {
    respuesta: string;
    enviarEnEmbed: {
      habilitado: boolean;
      titulo: string;
      descripcion: string;
      thumbnail: string;
      imagen: string;
      url: string;
    };
  }

  identificador: string

  constructor (
    guild: string,
    respuestaPersonalizada: {
      desencadenante: string;
      propiedades: {
        respuesta: string;
        enviarEnEmbed: {
          habilitado: boolean;
          titulo: string;
          descripcion: string;
          thumbnail: string;
          imagen: string;
          url: string;
        };
      };
    }
  ) {
    this.guild = guild
    this.desencadenante = respuestaPersonalizada.desencadenante
    this.propiedades = respuestaPersonalizada.propiedades
    this.identificador = randomstring.generate({
      length: 10,
      charset: 'alphanumeric'
    })

    this.guardarRespuestaPersonalizada().catch((guardarRespuestaPersonalizadaError) => Consolex.gestionarError(guardarRespuestaPersonalizadaError))
  }

  async guardarRespuestaPersonalizada (): Promise<void> {
    await PoolConnection.execute(
      'INSERT INTO `guildAutoReply` (`guild`, `autoreplyID`, `autoreplyTrigger`, `autoreplyProperties`) VALUES (?, ?, ?, ?)',
      [
        this.guild,
        this.identificador,
        this.desencadenante,
        JSON.stringify(this.propiedades)
      ]
    ).catch((err) => Consolex.gestionarError(err))
  }

  async eliminarRespuestaPersonalizada (): Promise<void> {
    await PoolConnection.execute(
      'DELETE FROM `guildAutoReply` WHERE `autoreplyID` = ? AND `guild` = ?',
      [this.identificador, this.guild]
    ).catch((err) => Consolex.gestionarError(err))
  }
}

export default AutoReply
