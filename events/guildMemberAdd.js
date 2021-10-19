const { MessageAttachment } = require('discord.js')
const tempFileRemover = require('../modules/tempFileRemover')
const { welcomeCard } = require('../modules/canvasProcessing')
const guildFetchData = require('../modules/guildFetchData')

module.exports = async (client, member) => {
  const gMA = client.Sentry.startTransaction({
    op: 'guildMemberAdd',
    name: 'Guild Member Add'
  })
  guildFetchData(client, member.guild, (data) => {
    if (data.welcomeEnabled !== 0) {
      const mensaje = client.channels.cache.get(data.welcomeChannel)
      if (mensaje) {
        if (data.welcomeImage !== 0) {
          welcomeCard(client, member, data.guildLanguage || 'en', data).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            mensaje.send({ content: data.welcomeMessage.replace('{member}', `<@${member.user.id}>`).replace('{guild}', `${member.guild.name}`), files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
        }
      }
    }
    if (data.moderator_noMoreUsers_enabled === 1) {
      if (member) {
        member
          .kick(data.moderator_noMoreUsers_message || 'noMoreUsers enabled on this guild · Powered by Pingu')
      }
    }
    if (data.welcome_roles) {
      const welcomeRoles = data.welcome_roles
      const roleArray = welcomeRoles.split(',')
      roleArray.forEach(element => {
        if (member.guild.roles.cache.get(element)) {
          member.roles.add(member.guild.roles.cache.get(element))
        }
      })
    }
  })
  gMA.finish()
}
