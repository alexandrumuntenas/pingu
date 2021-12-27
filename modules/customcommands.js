const { MessageEmbed } = require('discord.js')

module.exports = async (client, message, commandToExecute) => {
  const mCeEC = client.Sentry.startTransaction({
    op: 'messageCreate/executeExternalCommand',
    name: 'Execute External Command'
  })
  client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [message.guild.id], (err, result) => {
    if (err) {
      client.Sentry.captureException(err)
      client.log.error(err)
    }
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ?', [message.guild.id, commandToExecute], (err, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (Object.prototype.hasOwnProperty.call(result, 0)) {
          const messageSent = new MessageEmbed()
            .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
            .setDescription(result[0].messageReturned)
            .setColor('BLURPLE')
          message.channel.send({ embeds: [messageSent] }).catch((err) => {
            client.log.error(err)
            client.Sentry.captureException(err)
          }).finally(mCeEC.finish())
        }
      })
    }
  })
}
