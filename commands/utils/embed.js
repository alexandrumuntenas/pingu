const { MessageEmbed, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'embed',
  description: '📝 Create an embed message',
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS],
  cooldown: 0,
  ephemeral: true,
  interactionData: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('📝 Create an embed message')
    .addStringOption(option => option.setName('title').setDescription('Sets the embed title. (256 characters max)').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Sets the embed description. (4096 characters max)').setRequired(true))
    .addStringOption(option => option.setName('footer').setDescription('Sets the embed footer. (2048 characters max)'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Adds an image/gif to the upper-right corner of your embed. (Use a direct media link.)'))
    .addStringOption(option => option.setName('image').setDescription('Adds an image/gif to the bottom of your embed. (Use a direct media link.)')),
  executeInteraction (client, locale, interaction) {
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    const footer = interaction.options.getString('footer')
    const thumbnail = interaction.options.getString('thumbnail')
    const image = interaction.options.getString('image')

    const embed = new MessageEmbed()
      .setAuthor(interaction.user.username, interaction.user.avatarURL())
      .setTitle(title)
      .setDescription(description)
      .setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
    if (footer) embed.setFooter(footer)
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (image) embed.setImage(image)
    interaction.editReply({ embeds: [embed] })

    interaction.followUp({ embeds: [embed] })
  },
  executeLegacy (client, locale, message) {
    message.channel.send(`<a:loader:871389840904695838> ${i18n(locale, 'EMBED_PRELOADER')}`).then((embedMenu) => {
      const embedCreated = new MessageEmbed()
      const filter = m => m.member.id === message.member.id
      embedCreated.setAuthor(message.author.username, message.author.avatarURL())
      embedCreated.setTimestamp()
      embedCreated.setFooter('Powered by Pingu')
      embedCreated.setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
      let addfields = 0
      function indice () {
        embedMenu.edit({ content: `${i18n(locale, 'EMBED_MENU_WELCOME')} \n\n ****${i18n(locale, 'EMBED_MENU_AVALIABLE_OPTIONS')}** \n **1.**${i18n(locale, 'EMBED_MENU_OPTIONS_1')}\n **2.**${i18n(locale, 'EMBED_MENU_OPTIONS_2')}\n **3.**${i18n(locale, 'EMBED_MENU_OPTIONS_3')}\n **4.**${i18n(locale, 'EMBED_MENU_OPTIONS_4')}\n **5.**${i18n(locale, 'EMBED_MENU_OPTIONS_5')}\n **6.**${i18n(locale, 'EMBED_MENU_OPTIONS_6')}\n **7.**${i18n(locale, 'EMBED_MENU_OPTIONS_7')}\n **8.**${i18n(locale, 'EMBED_MENU_OPTIONS_8')}`, embeds: [embedCreated] })
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
        embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_CHANGETITLE')}` })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          embedCreated.setTitle(collected.first().content)

          collected.first().delete().then(() => indice())
        })
      }

      function editarDescripcion () {
        embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_CHANGEBODY')}` })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          embedCreated.setDescription(collected.first().content)
          collected.first().delete().then(() => indice())
        })
      }

      function addField () {
        ++addfields
        if (addfields === 0 || addfields <= 25) {
          embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_ADDFIELD_INSERTTITLE', { ADDFIELD_FIELD: addfields })}` })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            const titulo = collected.first().content
            collected.first().delete()
            embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_ADDFIELD_INSERTBODY', { ADDFIELD_FIELD: addfields })}` })
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              const descrip = collected.first().content
              embedCreated.addField(titulo, descrip)
              collected.first().delete().then(() => indice())
            })
          })
        } else {
          embedMenu.edit({ content: `<:pingu_cross:876104109256769546> ${i18n(locale, 'EMBED_ADDFIELD_NOMOREFIELDS')}` })
        }
      }

      function editarImagen () {
        embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_EDITIMAGE')}` })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          embedCreated.setImage(collected.first().content.content)
          collected.first().delete().then(() => indice())
        })
      }

      function editarMiniatura () {
        embedMenu.edit({ content: `:arrow_right: ${i18n(locale, 'EMBED_EDITTHUMBNAIL')}` })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          embedCreated.setThumbnail(collected.first().content.content)
          collected.first().delete().then(() => indice())
        })
      }

      function editarColorBorde () {
        embedMenu.edit({
          content: `:arrow_right: ${i18n(locale, 'EMBED_EDITCOLOR')}`
        })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          embedCreated.setColor(collected.first().content.content)
          collected.first().delete().then(() => indice())
        })
      }

      function enviar () {
        embedMenu.edit({
          content: `:arrow_right: ${i18n(locale, 'EMBED_SEND')}`
        })
        message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
          const canal = collected.first().mentions.channels.first()
          const mensaje = client.channels.cache.find(channel => channel.id === canal.id)
          mensaje.send({ embeds: [embedCreated] })
          embedMenu.edit({
            content: `<:pingu_check:876104161794596964> ${i18n(locale, 'EMBED_SENT_SUCCESS', { EMBED_CHANNEL: canal })}`, embeds: [embedCreated]
          })
          collected.first().delete()
        })
      }

      indice()
    })
  }
}
