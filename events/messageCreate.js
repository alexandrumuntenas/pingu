const guildCreate = require('./guildCreate')
const { rankUp } = require('../modules/levelsModule')
const { getMoney } = require('../modules/economyModule')
const genericMessages = require('../modules/genericMessages')

module.exports = async (client, message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [message.guild.id], (err, result, rows) => {
    if (err) throw client.log.error(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      message.database = result[0]
      if (message.content.startsWith(message.database.guildPrefix) && message.content !== message.database.guildPrefix) {
        message.args = message.content.slice(message.database.guildPrefix.length).trim().split(/ +/)
      }
      if (message.content.startsWith(message.database.guildPrefix) && message.args) {
        const command = message.args[0]
        message.args.shift()
        if (client.commands.has(command)) {
          const mCeIC = client.Sentry.startTransaction({
            op: 'messageCreate/executeInternalCommand',
            name: `Execute Internal Command (${command})`
          })
          try {
            client.commands.get(command).execute(client, message.database.guildLanguage || 'en', message)
          } catch (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
            genericMessages.Error.customerror(message, message.database.guildLanguage || 'en', 'COMMAND_ERROR')
          } finally {
            mCeIC.finish()
          }
        } else {
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
              client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ?', [message.guild.id, command], (err, result) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  message.channel.send(`<:comandoscustom:858671400424046602> ${result[0].messageReturned}`).catch((err) => {
                    client.log.error(err)
                    client.Sentry.captureException(err)
                  }).finally(mCeEC.finish())
                }
              })
            }
          })
        };
      }

      if (message.database.levelsEnabled !== 0) {
        rankUp(client, message)
      }

      if (message.database.economyEnabled !== 0) {
        getMoney(client, message.member, message.guild)
      }

      const mCgAR = client.Sentry.startTransaction({
        op: 'messageCreate/guildAutoResponder',
        name: 'Auto Responder'
      })
      client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ?', [message.guild.id], (err, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (result) {
          try {
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `autoresponderTrigger` = ?', [message.guild.id, message.content], (err, result) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                if (result) {
                  if (Object.prototype.hasOwnProperty.call(result, 0)) {
                    message.channel.send(`<:respuestacustom:858671300024074240> ${result[0].autoresponderResponse}`)
                  }
                }
              })
            }
          } catch (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          } finally {
            mCgAR.finish()
          }
        }
      })
    } else {
      guildCreate(client, message.guild)
    }
  }
  )
}
