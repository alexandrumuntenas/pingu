const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {
  const mCgAR = client.console.sentry.startTransaction({
    op: 'messageCreate/guildAutoResponder',
    name: 'Auto Responder'
  })
  client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ?', [message.guild.id], (err, result) => {
    if (err) {
      client.logError(err)
      client.console.error(err)
    }
    if (result) {
      try {
        if (Object.prototype.hasOwnProperty.call(result, 0)) {
          client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `autoresponderTrigger` = ?', [message.guild.id, message.content.toLowerCase()], (err, result) => {
            if (err) {
              client.logError(err)
              client.console.error(err)
            }
            if (result) {
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                const messageSent = new MessageEmbed()
                  .setFooter('Powered by Pingu', client.user.displayAvatarURL())
                  .setDescription(result[0].autoresponderResponse)
                  .setColor('BLURPLE')
                message.channel.send({ embeds: [messageSent] }).catch((err) => {
                  client.console.error(err)
                  client.logError(err)
                })
              }
            }
          })
        }
      } catch (err) {
        client.logError(err)
        client.console.error(err)
      } finally {
        mCgAR.finish()
      }
    }
  })
}
