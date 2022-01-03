const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'poll',
  description: '📊 Create a poll',
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('📊 Create a poll')
    .addStringOption(option => option.setName('question').setDescription('Type your question. E.g. Did you like the stream?').setRequired(true))
    .addStringOption(option => option.setName('option_a').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_b').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_c').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_d').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_e').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_f').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_g').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_h').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_i').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_j').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_k').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_l').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_m').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_n').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_o').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_p').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_q').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_r').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_s').setDescription('Type your choice'))
    .addStringOption(option => option.setName('option_t').setDescription('Type your choice')),
  executeInteraction (client, locale, interaction) {
    let options = []
    options.push(interaction.options.getString('option_a'))
    options.push(interaction.options.getString('option_b'))
    options.push(interaction.options.getString('option_c'))
    options.push(interaction.options.getString('option_d'))
    options.push(interaction.options.getString('option_e'))
    options.push(interaction.options.getString('option_f'))
    options.push(interaction.options.getString('option_g'))
    options.push(interaction.options.getString('option_h'))
    options.push(interaction.options.getString('option_i'))
    options.push(interaction.options.getString('option_j'))
    options.push(interaction.options.getString('option_k'))
    options.push(interaction.options.getString('option_l'))
    options.push(interaction.options.getString('option_m'))
    options.push(interaction.options.getString('option_n'))
    options.push(interaction.options.getString('option_o'))
    options.push(interaction.options.getString('option_p'))
    options.push(interaction.options.getString('option_q'))
    options.push(interaction.options.getString('option_r'))
    options.push(interaction.options.getString('option_s'))
    options.push(interaction.options.getString('option_t'))

    options = options.filter(option => option !== null)

    const question = interaction.options.getString('question')

    if (options.length === 0) {
      const embed = new MessageEmbed().setTitle(`📊 ${question}`).setColor('#965E89')

      interaction.editReply({ embeds: [embed] })
      interaction.replyData.react('876106253355585627').then(() => {
        interaction.replyData.react('876106307269181460')
      })
    } else {
      const embed = new MessageEmbed()
        .setTitle(`📊 ${question}`)

      const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
        '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿']

      const arr = []

      let count = 0

      options.forEach(option => {
        arr.push(`${alphabet[count]} ${options[count]}`)
        count++
      })
      embed
        .setDescription(arr.join('\n\n'))
        .setColor('#965E89')

      interaction.editReply({ embeds: [embed] })
      count = 0
      do {
        interaction.replyData.react(alphabet[count])
        count++
      } while (count < options.length)
    }
  }
}
