const { MessageAttachment } = require('discord.js')
const tempFileRemover = require('../modules/tempFileRemover')
const { welcomeCard } = require('../modules/canvasProcessing')

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
          if (result[0].welcome_image !== 0) {
            welcomeCard(client, member, result[0].guild_language || 'en', result[0]).then((paths) => {
              const attachmentSent = new MessageAttachment(paths.attachmentSent)
              mensaje.send({ content: result[0].welcome_message.replace('{user}', `<@${member.user.id}>`).replace('{server}', `${member.guild.name}`), files: [attachmentSent] }).then(() => {
                tempFileRemover(paths)
              })
            })
          }
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
