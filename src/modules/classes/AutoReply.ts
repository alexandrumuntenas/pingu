import * as randomstring from 'randomstring'

class AutoReply {
  guild: string
  desencadenante: string
  respuesta: string
  propiedades: {
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
    guild,
    respuestaPersonalizada: {
      desencadenante: string;
      respuesta: string;
      propiedades: {
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
    this.respuesta = respuestaPersonalizada.respuesta
    this.propiedades = respuestaPersonalizada.propiedades
    this.identificador = randomstring.generate({
      length: 10,
      charset: 'alphanumeric'
    })
  }
}

export default AutoReply
