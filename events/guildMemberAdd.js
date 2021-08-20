const { MessageAttachment } = require('discord.js')
const Downloader = require('nodejs-file-downloader')
const Jimp = require('jimp')

module.exports = (client, con, member) => {
  con.query('SELECT * FROM `guild_data` WHERE guild = ?', [member.guild.id], (err, result) => {
    if (err) console.log(err)
    if (result[0].welcome_enabled !== 0) {
      const mensaje = client.channels.cache.find(channel => channel.id === result[0].welcome_channel)
      if (result[0].welcome_image !== 0) {
        const run = async () => {
          const avatar = new Downloader({
            url: member.user.avatarURL({ format: 'jpg' }),
            directory: './usuarios/avatares/',
            fileName: `${member.user.id}_join.jpg`,
            cloneFiles: false
          })
          try {
            await avatar.download()
            const top = await Jimp.read(`./usuarios/avatares/${member.user.id}_join.jpg`)
            top.circle()

            top.resize(220, 220)
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
            await Jimp.read(`./recursos/carteles/${result[0].welcome_image_background}.png`, (err, image) => {
              if (err) console.log(err)
              image.composite(top, 39, 32)
              image.print(font, 300, 109, `Hola ${member.user.tag}`)
              image.print(font, 300, 141, `Miembro #${member.guild.memberCount}`)
              image.writeAsync(`./usuarios/bienvenidas/${member.user.id}_${member.guild.id}_join.jpg`)
              if (mensaje) {
                mensaje.send(result[0].welcome_message.replace('{member.user}', `<@${member.member.user.id}>`).replace('{server}', `${member.guild.name}`), MessageAttachment('./usuarios/bienvenidas/' + member.id + '_' + member.guild.id + '_join.jpg'))
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
        run()
      } else {
        mensaje.send(result[0].welcome_message.replace('{member.user}', `<@${member.member.user.id}>`).replace('{server}', `${member.guild.name}`))
      }
      if (result[0].burbuja_activado === 1) {
        if (member) {
          member
            .kick('El servidor al que intentas acceder dispone del modo burbuja activado.')
        }
      }
    }
    if (result[0].welcome_roles) {
      const welcomeRoles = result[0].welcome_roles
      const role = welcomeRoles.split(',')
      role.forEach(element => {
        if (member.guild.roles.cache.find(role => role.id === element)) {
          member.roles.add(member.guild.roles.cache.find(role => role.id === element))
        }
      })
    }
  })
}
