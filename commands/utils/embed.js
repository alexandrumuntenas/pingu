const { MessageEmbed, Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'embed',
  execute (client, locale, message, result) {
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      message.channel.send('<a:loading:880765834774073344> Loading Embed Builder v2').then((embedMenu) => {
        const embedCreated = new MessageEmbed()
        const filter = m => m.author.id === message.author.id
        embedCreated.setAuthor(message.author.username, message.author.avatarURL())
        embedCreated.setTimestamp()
        embedCreated.setFooter('Powered by Pingu')
        embedCreated.setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
        let addfields = 0
        function indice () {
          embedMenu.edit({ content: 'Bienvenido al constructor visual de mensajes enriquecidos. Le iremos haciendo una serie de preguntas para ir construyendo su mensaje enriquecido a medida.\nPara ejecutar una opción, indique el número de la opción. \n \n ****Opciones Disponibles** \n **1.** Establecer Título \n **2.** Establecer Descripción \n **3.** Establecer Thumbnail \n **4.** Añadir Nuevo Campo (hasta 25) \n **5.** Establecer Imagen \n **6.** Establecer color del borde \n **7.** Enviar mensaje \n **8.** Descartar mensaje', embeds: [embedCreated] })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            switch (collected.first().content) {
              case '1':
                collected.first().delete().then(() => editarTitulo())
                break
              case '2':
                collected.first().delete().then(() => editarDescripcion())
                break
              case '3':
                collected.first().delete().then(() => editarMiniatura())
                break
              case '4':
                collected.first().delete().then(() => addField())
                break
              case '5':
                collected.first().delete().then(() => editarImagen())
                break
              case '6':
                collected.first().delete().then(() => editarColorBorde())
                break
              case '7':
                collected.first().delete().then(() => enviar())
                break
              case '8':
                collected.first().delete().then(() => embedMenu.edit({ content: '<:win_information:876119543968305233> Se ha descartado el mensaje enriquecido.' }))
                break
              default:
                collected.first().delete().then(() => indice())
                break
            }
          })
        }

        function editarTitulo () {
          embedMenu.edit({ content: ':arrow_right: Introduzca el título del mensaje enriquecido' })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setTitle(collected.first().content)

            collected.first().delete().then(() => indice())
          })
        }

        function editarDescripcion () {
          embedMenu.edit({ content: ':arrow_right: Introduzca la descripción del mensaje enriquecido' })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setDescription(collected.first().content)
            collected.first().delete().then(() => indice())
          })
        }

        function addField () {
          ++addfields
          if (addfields === 0 || addfields <= 25) {
            embedMenu.edit({ content: ':arrow_right: Introduzca el título del nuevo campo #' + addfields })
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              const titulo = collected.first().content
              collected.first().delete()
              embedMenu.edit({ content: ':arrow_right: Introduzca la descripción del nuevo campo #' + addfields })
              message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                const descrip = collected.first().content
                collected.first().delete()
                embedMenu.edit({ content: ':arrow_right: Mostrar campo #' + addfields + ' en línea. Respuestas disponibles: y(es) / n(o)' })
                message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                  if (collected.first().content === 'y' || collected.first().content === 'yes') {
                    embedCreated.addField(titulo, descrip, true)
                    collected.first().delete().then(() => indice())
                  } else {
                    embedCreated.addField(titulo, descrip)
                    collected.first().delete().then(() => indice())
                  }
                })
              })
            })
          } else {
            embedMenu.edit({ content: '<:pingu_cross:876104109256769546> No se pueden agregar más campos. El máximo son 25.' })
          }
        }

        function editarImagen () {
          embedMenu.edit({ content: ':arrow_right: Introduzca la URL de la imagen.' })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setImage(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function editarMiniatura () {
          embedMenu.edit({
            content: ':arrow_right: Introduzca la URL del Thumbnail.'
          })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setThumbnail(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function editarColorBorde () {
          embedMenu.edit({
            content: ':arrow_right: Introduzca el color que deseas en hexadecimal. (Es necesario poner # al principio)'
          })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setColor(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function enviar () {
          embedMenu.edit({
            content: ':arrow_right: ¿A dónde desea enviarlo? ¡Mencione el canal!'
          })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            const canal = collected.first().mentions.channels.first()
            const mensaje = client.channels.cache.find(channel => channel.id === canal.id)
            mensaje.send({ embeds: [embedCreated] })
            embedMenu.edit({
              content: '<:pingu_check:876104161794596964> Se ha enviado correctamente el mensaje enriquecido a <#' + canal.id + '>. Así luce:', embeds: [embedCreated]
            })
            collected.first().delete()
          })
        }

        indice()
      })
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
