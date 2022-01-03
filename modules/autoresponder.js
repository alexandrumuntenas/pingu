const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {
  const mCgAR = client.Sentry.startTransaction({
    op: 'messageCreate/guildAutoResponder',
    name: 'Auto Responder'
  })
  client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ?', [message.guild.id], (err, result) => {
    if (err) {
      client.logError(err)
      client.log.error(err)
    }
    if (result) {
      try {
        if (Object.prototype.hasOwnProperty.call(result, 0)) {
          client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `autoresponderTrigger` = ?', [message.guild.id, message.content.toLowerCase()], (err, result) => {
            if (err) {
              client.logError(err)
              client.log.error(err)
            }
            if (result) {
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                const messageSent = new MessageEmbed()
                  .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
                  .setDescription(result[0].autoresponderResponse)
                  .setColor('BLURPLE')
                message.channel.send({ embeds: [messageSent] }).catch((err) => {
                  client.log.error(err)
                  client.logError(err)
                })
              }
            }
          })
        }
      } catch (err) {
        client.logError(err)
        client.log.error(err)
      } finally {
        mCgAR.finish()
      }
    }
  })
}
