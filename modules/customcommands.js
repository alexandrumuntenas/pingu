const { MessageEmbed } = require('discord.js')

// TODO: Crear las funciones para crear y eliminar los comandos personalizadas. Básicamente migrar los query del comando ccmd.

module.exports = async (client, message, commandToExecute) => {
  const mCeEC = client.console.sentry.startTransaction({
    op: 'messageCreate/executeExternalCommand',
    name: 'Execute External Command'
  })
  client.pool.query(
    'SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ?',
    [message.guild.id, commandToExecute],
    (err, result) => {
      if (err) client.logError(err)
      if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
        const messageSent = new MessageEmbed()
          .setFooter({
            text: 'Powered by Pingu',
            iconURL: client.user.displayAvatarURL()
          })
          .setDescription(result[0].messageReturned)
          .setColor('BLURPLE')
        message.channel
          .send({ embeds: [messageSent] })
          .catch((err) => {
            //! Esto se debe eliminar muy pronto
            client.console.error(err)
            client.logError(err)
          })
          .finally(mCeEC.finish())
      }
    }
  )
}
