const { MessageEmbed, Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
module.exports = {
  name: 'embed',
  execute (client, locale, message, result) {
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      message.channel.send(`<a:loading:880765834774073344> ${getLocales(locale, 'EMBED_PRELOADER')}`).then((embedMenu) => {
        const embedCreated = new MessageEmbed()
        const filter = m => m.author.id === message.author.id
        embedCreated.setAuthor(message.author.username, message.author.avatarURL())
        embedCreated.setTimestamp()
        embedCreated.setFooter('Powered by Pingu')
        embedCreated.setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
        let addfields = 0
        function indice () {
          embedMenu.edit({ content: `${getLocales(locale, 'EMBED_MENU_WELCOME')} \n\n ****${getLocales(locale, 'EMBED_MENU_AVALIABLE_OPTIONS')}** \n **1.**${getLocales(locale, 'EMBED_MENU_OPTIONS_1')}\n **2.**${getLocales(locale, 'EMBED_MENU_OPTIONS_2')}\n **3.**${getLocales(locale, 'EMBED_MENU_OPTIONS_3')}\n **4.**${getLocales(locale, 'EMBED_MENU_OPTIONS_4')}\n **5.**${getLocales(locale, 'EMBED_MENU_OPTIONS_5')}\n **6.**${getLocales(locale, 'EMBED_MENU_OPTIONS_6')}\n **7.**${getLocales(locale, 'EMBED_MENU_OPTIONS_7')}\n **8.**${getLocales(locale, 'EMBED_MENU_OPTIONS_8')}`, embeds: [embedCreated] })
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
          embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_CHANGETITLE')}` })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setTitle(collected.first().content)

            collected.first().delete().then(() => indice())
          })
        }

        function editarDescripcion () {
          embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_CHANGEBODY')}` })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setDescription(collected.first().content)
            collected.first().delete().then(() => indice())
          })
        }

        function addField () {
          ++addfields
          if (addfields === 0 || addfields <= 25) {
            embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_ADDFIELD_INSERTTITLE', { ADDFIELD_FIELD: addfields })}` })
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              const titulo = collected.first().content
              collected.first().delete()
              embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_ADDFIELD_INSERTBODY', { ADDFIELD_FIELD: addfields })}` })
              message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                const descrip = collected.first().content
                embedCreated.addField(titulo, descrip)
                collected.first().delete().then(() => indice())
              })
            })
          } else {
            embedMenu.edit({ content: `<:pingu_cross:876104109256769546> ${getLocales(locale, 'EMBED_ADDFIELD_NOMOREFIELDS')}` })
          }
        }

        function editarImagen () {
          embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_EDITIMAGE')}` })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setImage(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function editarMiniatura () {
          embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'EMBED_EDITTHUMBNAIL')}` })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setThumbnail(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function editarColorBorde () {
          embedMenu.edit({
            content: `:arrow_right: ${getLocales(locale, 'EMBED_EDITCOLOR')}`
          })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            embedCreated.setColor(collected.first().content.content)
            collected.first().delete().then(() => indice())
          })
        }

        function enviar () {
          embedMenu.edit({
            content: `:arrow_right: ${getLocales(locale, 'EMBED_SEND')}`
          })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            const canal = collected.first().mentions.channels.first()
            const mensaje = client.channels.cache.find(channel => channel.id === canal.id)
            mensaje.send({ embeds: [embedCreated] })
            embedMenu.edit({
              content: `<:pingu_check:876104161794596964> ${getLocales(locale, 'EMBED_SENT_SUCCESS', { EMBED_CHANNEL: canal })}`, embeds: [embedCreated]
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
