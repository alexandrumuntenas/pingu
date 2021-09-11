const { MessageAttachment } = require('discord.js')
const Downloader = require('nodejs-file-downloader')
const Jimp = require('jimp')

module.exports = (client, member) => {
  const gMA = client.Sentry.startTransaction({
    op: 'guildMemberAdd',
    name: 'Guild Member Add'
  })
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [member.guild.id], (err, result) => {
    if (err) {
      client.Sentry.captureException(err)
      client.log.error(err)
    }
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      if (result[0].welcome_enabled !== 0) {
        const mensaje = client.channels.cache.get(result[0].welcome_channel)
        if (mensaje) {
          /* if (result[0].welcome_image !== 0) {
            const avatar = new Downloader({
              url: member.user.avatarURL({ format: 'jpg' }),
              directory: './usuarios/avatares/',
              fileName: `${member.user.id}_join.jpg`,
              cloneFiles: false
            })
            try {
              avatar.download()
              const top = Jimp.read(`./usuarios/avatares/${member.user.id}_join.jpg`)
              top.circle()

              top.resize(220, 220)
              const font = Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
              Jimp.read(`./recursos/carteles/${result[0].welcome_image_background}.png`, (err, image) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                image.composite(top, 39, 32)
                image.print(font, 300, 109, `Hola ${member.user.tag}`)
                image.print(font, 300, 141, `Miembro #${member.guild.memberCount}`)
                image.writeAsync(`./usuarios/bienvenidas/${member.user.id}_${member.guild.id}_join.jpg`)
                const attachament = new MessageAttachment('./usuarios/bienvenidas/' + member.id + '_' + member.guild.id + '_join.jpg')
                mensaje.send(result[0].welcome_message.replace('{user}', `<@${member.user.id}>`).replace('{server}', `${member.guild.name}`), attachament)
              })
            } catch (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
          } else {
          } */
          mensaje.send(result[0].welcome_message.replace('{user}', `<@${member.user.id}>`).replace('{server}', `${member.guild.name}`))
        }
      }
      if (result[0].moderator_noMoreUsers_enabled === 1) {
        if (member) {
          member
            .kick(result[0].moderator_noMoreUsers_message || 'noMoreUsers enabled on this guild · Powered by Pingu')
        }
      }
      if (result[0].welcome_roles) {
        const welcomeRoles = result[0].welcome_roles
        const roleArray = welcomeRoles.split(',')
        roleArray.forEach(element => {
          if (member.guild.roles.cache.get(element)) {
            member.roles.add(member.guild.roles.cache.get(element))
          }
        })
      }
    }
  })
  gMA.finish()
}
