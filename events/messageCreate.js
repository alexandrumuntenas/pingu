const { MessageEmbed, Collection } = require('discord.js')
const genericMessages = require('../functions/genericMessages')
const autoresponder = require('../modules/autoresponder')
const guildFetchData = require('../modules/guildFetchData')
const { rankUp } = require('../modules/levels')
const cooldown = new Collection()

module.exports = async (client, message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  guildFetchData(client, message.guild, async (guildData) => {
    message.database = guildData
    if (message.content.startsWith(message.database.guildPrefix) && message.content !== message.database.guildPrefix) {
      message.args = message.content.slice(message.database.guildPrefix.length).trim().split(/ +/)
    }
    if (message.content.startsWith(message.database.guildPrefix) && message.args) {
      const commandToExecute = message.args[0]
      message.args.shift()

      if (client.commands.has(commandToExecute)) {
        if (!cooldown.has(`${commandToExecute}${message.member.id}${message.guild.id}`)) {
          cooldown.set(`${commandToExecute}${message.member.id}${message.guild.id}`, (Date.now() + parseInt(client.commands.get(commandToExecute).cooldown || 10000)))
          setTimeout(() => {
            cooldown.delete(`${commandToExecute}${message.member.id}${message.guild.id}`)
          }, client.commands.get(commandToExecute).cooldown || 10000)
          await client.commands.get(commandToExecute).execute(client, message.database.guildLanguage || 'en', message)
        } else {
          const cooldownTime = cooldown.get(`${commandToExecute}${message.member.id}${message.guild.id}`)
          genericMessages.error.cooldown(message, message.database.guildLanguage || 'en', (parseInt(cooldownTime) - Date.now()))
          return
        }
      } else {
        if (!cooldown.has(`customcommand${commandToExecute}${message.member.id}${message.guild.id}`)) {
          cooldown.set(`customcommand${commandToExecute}${message.member.id}${message.guild.id}`, (Date.now() + parseInt(10000))) // Estudiar la posibilidad de establecer un cooldown personalizado de más de 10 segundos.
          setTimeout(() => {
            cooldown.delete(`customcommand${commandToExecute}${message.member.id}${message.guild.id}`)
          }, 10000) // Estudiar la posibilidad de añadir un cooldown personalizado de más de 10 segundos.
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
        } else {
          const cooldownTime = cooldown.get(`customcommand${commandToExecute}${message.member.id}${message.guild.id}`)
          genericMessages.error.cooldown(message, message.database.guildLanguage || 'en', (parseInt(cooldownTime) - Date.now()))
          return
        }
      }
    }
    if (message.database.levelsEnabled !== 0) {
      rankUp(client, message)
    }

    autoresponder(client, message)
  })
}
