const { MessageEmbed } = require('discord.js')

// TODO: Crear las funciones para crear y eliminar las respuestas personalizadas. Básicamente migrar los query del comando autoresponder.

module.exports = async (client, message) => {
  const mCgAR = client.console.sentry.startTransaction({
    op: 'messageCreate/guildAutoResponder',
    name: 'Auto Responder'
  })
  client.pool.query(
    'SELECT * FROM `guildAutoResponder` WHERE `guild` = ?',
    [message.guild.id],
    (err, result) => {
      if (err) {
        client.logError(err)
        client.console.error(err)
      }
      if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
        try {
          client.pool.query(
            'SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `autoresponderTrigger` = ?',
            [message.guild.id, message.content.toLowerCase()],
            (err, result) => {
              if (err) client.logError(err)
              if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
                const messageSent = new MessageEmbed()
                  .setFooter({
                    text: 'Powered by Pingu',
                    iconURL: client.user.displayAvatarURL()
                  })
                  .setDescription(result[0].autoresponderResponse)
                  .setColor('BLURPLE')
                message.channel.send({ embeds: [messageSent] }).catch((err) => {
                  //! Esto se debe eliminar muy pronto
                  client.console.error(err)
                  client.logError(err)
                })
              }
            }
          )
        } catch (err) {
          client.logError(err)
        } finally {
          mCgAR.finish()
        }
      }
    }
  )
}
