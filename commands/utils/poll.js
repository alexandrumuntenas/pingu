const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/** Idea: Volver a hacer el array de argumentos, pero esta vez, que sea separado por el separador.
 *  Eliminar el prefijo + comando y dejar solo la pregunta con las opciones. Para así permitir que
 *  se pueda poner `.poll What do you want to play?/ A dummy game /A good game/Something funny / y
 *  siga funcionando a la perfección.
 */

module.exports = {
  name: 'poll',
  description: '📊 Create a poll',
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('📊 Create a poll')
    .addStringOption((option) => option.setName('question').setDescription('Type your question. E.g. Did you like the stream?').setRequired(true))
    .addStringOption((option) => option.setName('option_a').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_b').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_c').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_d').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_e').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_f').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_g').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_h').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_i').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_j').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_k').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_l').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_m').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_n').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_o').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_p').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_q').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_r').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_s').setDescription('Type your choice'))
    .addStringOption((option) => option.setName('option_t').setDescription('Type your choice')),
  executeInteraction(client, locale, interaction) {
    let options = [];
    options.push(interaction.options.getString('option_a'));
    options.push(interaction.options.getString('option_b'));
    options.push(interaction.options.getString('option_c'));
    options.push(interaction.options.getString('option_d'));
    options.push(interaction.options.getString('option_e'));
    options.push(interaction.options.getString('option_f'));
    options.push(interaction.options.getString('option_g'));
    options.push(interaction.options.getString('option_h'));
    options.push(interaction.options.getString('option_i'));
    options.push(interaction.options.getString('option_j'));
    options.push(interaction.options.getString('option_k'));
    options.push(interaction.options.getString('option_l'));
    options.push(interaction.options.getString('option_m'));
    options.push(interaction.options.getString('option_n'));
    options.push(interaction.options.getString('option_o'));
    options.push(interaction.options.getString('option_p'));
    options.push(interaction.options.getString('option_q'));
    options.push(interaction.options.getString('option_r'));
    options.push(interaction.options.getString('option_s'));
    options.push(interaction.options.getString('option_t'));

    options = options.filter((option) => option !== null);

    const question = interaction.options.getString('question');

    if (options.length === 0) {
      const embed = new MessageEmbed().setTitle(`📊 ${question}`).setColor('#965E89');

      interaction.editReply({ embeds: [embed] });
      interaction.replyData.react('876106253355585627').then(() => {
        interaction.replyData.react('876106307269181460');
      });
    } else {
      const embed = new MessageEmbed()
        .setTitle(`📊 ${question}`);

      const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
        '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

      const arr = [];

      let count = 0;

      options.forEach((option) => {
        arr.push(`${alphabet[count]} ${options[count]}`);
        count++;
      });
      embed
        .setDescription(arr.join('\n\n'))
        .setColor('#965E89');

      interaction.editReply({ embeds: [embed] });
      count = 0;
      do {
        interaction.replyData.react(alphabet[count]);
        count++;
      } while (count < options.length);
    }
  },
  executeLegacy(client, locale, message) {
    if (Object.prototype.hasOwnProperty.call(message.args, 0)) {
      // poll(message, message.args, '/', '#965E89')
      const separator = '|'; // const separator = message.database.pollSeparator || Se sustituyen todos los separators por message.database.pollSeparator
      const findSep = message.args.find((char) => char.includes(separator));
      // const findSep = message.args.find(char => char.includes(message.database.pollSeparator))

      if (findSep === undefined) {
        const question = message.args.join(' ');
        if (!question) {
          return message.channel.send('Please enter a question');
        }

        message.delete();

        const embed = new MessageEmbed().setTitle(`📊 ${question}`).setColor('#965E89');

        message.channel.send({ embeds: [embed] }).then((_message) => {
          _message.react('876106253355585627').then(() => {
            _message.react('876106307269181460');
          });
        });
      } else {
        message.delete();

        const embed = new MessageEmbed();
        const options = [];
        let j = 0;
        for (let i = 0; i < message.args.length; i++) {
          if (message.args[i] === separator) {
            message.args.splice(i, 1);
            const question = message.args.splice(0, i);
            embed.setTitle(`📊 ${question.join(' ')}`);
            break;
          }
        }

        for (let i = 0; i < message.args.length; i++) {
          if (message.args[i] === separator) {
            message.args.splice(i, 1);
            options[j] = message.args.splice(0, i);
            j++;
            i = 0;
          }
        }

        const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
          '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

        const arr = [];
        options[j] = message.args;

        if (options.length > alphabet.length) {
          return message.channel.send('Please don\'t input more than 26 options.').then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2000);
          });
        }

        let count = 0;

        options.forEach((option) => {
          arr.push(`${alphabet[count]} ${option.join(' ')}`);
          count++;
        });

        embed
          .setDescription(arr.join('\n\n'))
          .setColor('#965E89');

        message.channel.send({ embeds: [embed] }).then((msg) => {
          for (let i = 0; i < options.length; i++) {
            msg.react(alphabet[i]);
          }
        });
      }
    } else {
      message.channel.send(`**USAGE**: \n__You can create multiple answer polls__ ${message.database.guildPrefix}poll What's Your Favorite Color? / Blue / Red / Yellow\n __Or yes/no polls__ ${message.database.guildPrefix}poll Do you like Pingu?`);
    }
  }
};
