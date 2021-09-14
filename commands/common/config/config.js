const { Permissions, MessageEmbed } = require('discord.js')
const makeId = require('../../modules/makeId')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'config',
  execute (client, locale, message) {
    const claveiande = makeId(25)
    const claveadmin = makeId(12)
    if (message.guild.ownerId === message.author.id) {
      client.pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [message.guild.id], (err) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        client.pool.query('INSERT INTO `apoloSessions` (`Clave_de_Acceso`,`Guild_ID`,`Solicitante_ID`, `Clave_de_Autorizacion`) VALUES ( ?, ?, ?, ?)', [claveiande, message.guild.id, message.author.id, claveadmin])
        const sent = new MessageEmbed()
          .setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
          .setTitle(getLocales(locale, 'CONFIG_EMBED_TITLE'))
          .setDescription(getLocales(locale, 'CONFIG_EMBED_ACCESS', { CLAVEIANDE: claveiande, CLAVEAUTH: claveadmin, PANELVALID: `https://botpingu.herokuapp.com/login/?iande=${claveiande}&auth=${claveadmin}` }))
        message.author.send({ embeds: [sent] })
        setTimeout(() => {
          client.pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` = ?', [message.guild.id])
        }, 3600000)
      })
      message.delete()
    } else {
      if (message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        client.pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` LIKE ?', [message.guild.id], (err) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          client.pool.query('INSERT INTO `apoloSessions` (`Clave_de_Acceso`,`Guild_ID`,`Solicitante_ID`, `Clave_de_Autorizacion`) VALUES ( ?, ?, ?, ?)', [claveiande, message.guild.id, message.author.id, claveadmin])
          const sent = new MessageEmbed()
            .setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
            .setTitle(getLocales(locale, 'CONFIG_EMBED_TITLE'))
            .setDescription(getLocales(locale, 'CONFIG_EMBED_ACCESS_NO_ADMIN', { CLAVEIANDE: claveiande, PANELVALID: `https://botpingu.herokuapp.com/login/?iande=${claveiande}` }))
          message.author.send({ embeds: [sent] })
          const sentAdmin = new MessageEmbed()
            .setColor('#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
            .setTitle(getLocales(locale, 'CONFIG_EMBED_TITLE'))
            .setDescription(getLocales(locale, 'CONFIG_EMBED_ACCESS_NO_ADMIN_TO_ADMIN', { USER: message.member.tag, CLAVEAUTH: claveadmin }))
          message.author.send({ embeds: [sentAdmin] })
          setTimeout(() => {
            client.pool.query('DELETE FROM `apoloSessions` WHERE `Guild_ID` = ?', [message.guild.id])
          }, 3600000)
        })
        message.delete()
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    }
  }
}
