const guildCreate = require('./guildCreate')
const { rankUp } = require('../modules/levelsModule')
const noMoreInvites = require('../modules/noMoreInvites')
const economy = require('../modules/economyModule')
const genericMessages = require('../modules/genericMessages')

module.exports = (client, message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  client.pool.query('SELECT * FROM `guildData` WHERE guild = ?', [message.guild.id], (err, result, rows) => {
    if (err) throw client.log.error(err)
    if (Object.prototype.hasOwnProperty.call(result, 0)) {
      message.database = result[0]
      if (message.content.startsWith(message.database.guild_prefix) && message.content !== message.database.guild_prefix) {
        message.args = message.content.slice(message.database.guild_prefix.length).trim().split(/ +/)
      }
      const contenido = message.content.toLowerCase()
      if (message.content.startsWith(message.database.guild_prefix) && message.args) {
        const command = message.args[0]
        message.args.shift()
        if (client.commands.has(command)) {
          const mCeIC = client.Sentry.startTransaction({
            op: 'messageCreate/executeInternalCommand',
            name: `Execute Internal Command (${command})`
          })
          try {
            client.commands.get(command).execute(client, message.database.guild_language || 'en', message)
          } catch (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
            genericMessages.Error.customerror(message, message.database.guild_language || 'en', 'COMMAND_ERROR')
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
              client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `cmd` = ?', [message.guild.id, command], (err, result) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  message.channel.send('<:comandoscustom:858671400424046602>' + result[0].returns).catch((err) => {
                    client.log.error(err)
                    client.Sentry.captureException(err)
                  }).finally(mCeEC.finish())
                }
              })
            }
          })
        };
      }

      if (message.database.moderator_noMoreInvites_enabled !== 0) {
        noMoreInvites(client, message, result)
      }

      rankUp(client, message)

      /*
      if (message.database.economyEnabled !== 0) {
        const mCeGM = client.Sentry.startTransaction({
          op: 'messageCreate/economyGetMoney',
          name: 'Economy (getMoney)'
        })
        try {
          if (!contenido.startsWith(message.database.guild_prefix)) {
            if (!talkedRecently.has(`${message.author.id}_${message.guild.id}_eco`)) {
              talkedRecently.add(`${message.author.id}_${message.guild.id_eco}`)
              setTimeout(() => {
                talkedRecently.delete(`${message.author.id}_${message.guild.id}_eco`)
              }, 60000)
              economy.getMoney(client, message)
            }
          }
        } catch (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        } finally {
          mCeGM.finish()
        }
      }
      */

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
              client.pool.query('SELECT * FROM `guildAutoResponder` WHERE `guild` = ? AND `action` = ?', [message.guild.id, contenido], (err, result) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                if (result) {
                  if (Object.prototype.hasOwnProperty.call(result, 0)) {
                    message.channel.send('<:respuestacustom:858671300024074240> ' + result[0].returns)
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
