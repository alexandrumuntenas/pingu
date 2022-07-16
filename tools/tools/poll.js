const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')

/** Idea: Volver a hacer el array de argumentos, pero esta vez, que sea separado por el separador.
 *  Eliminar el prefijo + comando y dejar solo la pregunta con las opciones. Para así permitir que
 *  se pueda poner `.poll What do you want to play?/ A dummy game /A good game/Something funny / y
 *  siga funcionando a la perfección.
 */

module.exports = {
  name: 'poll',
  execute (args, client, con, locale, message, result) {
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (Object.prototype.hasOwnProperty.call(args, 0)) {
        // poll(message, args, '/', '#965E89')
        const separator = '|' // const separator = result[0].pollSeparator || Se sustituyen todos los separators por result[0].pollSeparator
        const findSep = args.find(char => char.includes(separator))
        // const findSep = args.find(char => char.includes(result[0].pollSeparator))

        if (findSep === undefined) {
          const question = args.join(' ')
          if (!question) {
            return message.channel.send('Please enter a question')
          }

          message.delete()

          const embed = new MessageEmbed().setTitle('📊 ' + question).setColor('#965E89')

          message.channel.send({ embeds: [embed] }).then(_message => {
            _message.react('876106253355585627').then(() => {
              _message.react('876106307269181460')
            })
          })
        } else {
          message.delete()

          const embed = new MessageEmbed()
          const options = []
          let j = 0
          for (let i = 0; i < args.length; i++) {
            if (args[i] === separator) {
              args.splice(i, 1)
              const question = args.splice(0, i)
              embed.setTitle('📊 ' + question.join(' '))
              break
            }
          }

          for (let i = 0; i < args.length; i++) {
            if (args[i] === separator) {
              args.splice(i, 1)
              options[j] = args.splice(0, i)
              j++
              i = 0
            }
          }

          const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
            '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '0️⃣',
            '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

          const arr = []
          options[j] = args

          if (options.length > alphabet.length) {
            return message.channel.send('Please don\'t input more than 26 options.').then(sent => {
              setTimeout(() => {
                sent.delete()
              }, 2000)
            })
          }

          let count = 0

          options.forEach(option => {
            arr.push(alphabet[count] + ' ' + option.join(' '))
            count++
          })

          embed
            .setDescription(arr.join('\n\n'))
            .setColor('#965E89')

          message.channel.send({ embeds: [embed] }).then(msg => {
            for (let i = 0; i < options.length; i++) {
              msg.react(alphabet[i])
            }
          })
        }
      } else {
        message.channel.send(`**USAGE**: \n__You can create multiple answer polls__ ${result[0].guild_prefix}poll What's Your Favorite Color? / Blue / Red / Yellow\n __Or yes/no polls__ ${result[0].guild_prefix}poll Do you like Pingu?`)
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}
