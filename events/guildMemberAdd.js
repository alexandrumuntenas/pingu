const { MessageAttachment } = require('discord.js')
const tempFileRemover = require('../modules/tempFileRemover')
const { welcomeCard } = require('../modules/canvasProcessing')
const guildFetchData = require('../modules/guildFetchData')
const { fetchJoinRoles } = require('../modules/joinroles')

module.exports = async (client, member) => {
  const gMA = client.Sentry.startTransaction({
    op: 'guildMemberAdd',
    name: 'Guild Member Add'
  })
  guildFetchData(client, member.guild, (data) => {
    if (data) {
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
      if (data.joinRolesEnabled !== 0) {
        fetchJoinRoles(client, member.guild, (roles) => {
          if (roles && Array.isArray(roles)) {
            if (roles.length > 0) {
              roles.forEach(role => {
                member.roles.add(member.guild.roles.resolveId(role.roleID))
              })
            }
          }
        })
      }
    }
  })
  gMA.finish()
}
