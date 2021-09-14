/* eslint-disable no-eval */
const { MessageEmbed } = require('discord.js')
const { codeBlock } = require('@discordjs/builders')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'eval',
  execute: async (client, locale, message, isInteraction) => { // eslint-disable-line no-unused-vars
    if (message.author.id === '722810818823192629') {
      if (Object.prototype.hasOwnProperty.call(message.args, 0)) {
        const code = message.args.join(' ')
        const messageSent = new MessageEmbed().setTitle('Evaluado correctamente').addField(':inbox_tray: Entrada', codeBlock('js', code))
        try {
          const evaled = eval(code)
          messageSent.addField(':outbox_tray: Salida', codeBlock('js', evaled || 'No se ha devuelto nada...')).setColor('GREEN')
        } catch (err) {
          messageSent.addField(':outbox_tray: Salida', codeBlock('js', err || 'No se ha devuelto nada...')).setColor('RED')
        } finally {
          message.reply({ embeds: [messageSent] })
        }
      } else {
        message.reply(':information_source: Te hace falta mencionar un código para ejecutar')
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
