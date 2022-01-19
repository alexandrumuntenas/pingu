const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'poll',
  description: '📊 Create a poll',
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  cooldown: 1,
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
    options.push(interaction.options.getString('option_a'), interaction.options.getString('option_b'), interaction.options.getString('option_c'), interaction.options.getString('option_d'), interaction.options.getString('option_e'), interaction.options.getString('option_f'), interaction.options.getString('option_g'), interaction.options.getString('option_h'), interaction.options.getString('option_i'), interaction.options.getString('option_j'), interaction.options.getString('option_k'), interaction.options.getString('option_l'), interaction.options.getString('option_m'), interaction.options.getString('option_t'), interaction.options.getString('option_n'), interaction.options.getString('option_o'), interaction.options.getString('option_p'), interaction.options.getString('option_q'), interaction.options.getString('option_r'), interaction.options.getString('option_s'))
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
        '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹']

      const arr = []

      let count = 0

      options.forEach(option => {
        arr.push(`${alphabet[count]} ${options[count]}`)
        count++
      })
      embed
        .setDescription(arr.join('\n'))
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
