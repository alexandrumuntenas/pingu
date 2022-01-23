const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'welcome',
  description: 'WELCOME::DESCRIPTION',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  timeout: 1,
  isConfigurationCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommand((sc) => sc.setName('setchannel').addChannelOption((input) => input.setName('channel').setRequired(true)))
    .addSubcommand((sc) => sc.setName('setmessage').addStringOption((input) => input.setName('message').setRequired(true)))
    .addSubcommand((sc) => sc.setName('sendcards').addBooleanOption((input) => input.setName('enable').setRequired(true)))
    .addSubcommandGroup((scg) => scg.setName('configurecards')
      .addSubcommand((sc) => sc.setName('setbackground').addStringOption((input) => input.setName('backgroundURL')))
      .addSubcommand((sc) => sc.setName('setoverlayopacity').addNumberOption((input) => input.setName('overlayOpacity').setRequired(true).setMin(0).setMax(100)))
      .addSubcommand((sc) => sc.setName('setoverlaycolor').addStringOption((input) => input.setName('overlayColor').setRequired(true)))
      .addSubcommand((sc) => sc.setName('settitle').addStringOption((input) => input.setName('title').setRequired(true)))
      .addSubcommand((sc) => sc.setName('setsubtitle').addStringOption((input) => input.setName('subtitle').setRequired(true))))
    .addSubcommandGroup((scg) => scg.setName('configureroles')
      .addSubcommand((sc) => sc.setName('give').addRoleOption((input) => input.setName('role').setRequired(true)))
      .addSubcommand((sc) => sc.setName('remove').addRoleOption((input) => input.setName('role').setRequired(true))))
    .addSubcommand((sc) => sc.setName('preview')),
};
