const { Error, Loader } = require('../../modules/constructor/messageBuilder');
const { getMember } = require('../../modules/memberManager');
const { generateRankCard } = require('../../modules/canvasProcessing');
const { MessageAttachment } = require('discord.js');
const tempFileRemover = require('../../functions/tempFileRemover');
const i18n = require('../../i18n/i18n');

module.exports = {
  module: 'levels',
  cooldown: 10000,
  name: 'rank',
  description: '⭐ Check your level',
  executeInteraction(client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      interaction.editReply({ embeds: [Loader(i18n(locale, 'PROCESSINGREQUEST'))] });
      getMember(client, interaction.member, (data) => {
        interaction.member.levelData = data;
        interaction.member.tag = `${interaction.user.username}#${interaction.user.discriminator}`;
        generateRankCard(interaction.member, interaction.database).then((paths) => {
          const attachmentSent = new MessageAttachment(paths.attachmentSent);
          interaction.editReply({ embeds: [], files: [attachmentSent] }).then(() => {
            tempFileRemover(paths);
          });
        });
      });
    } else {
      interaction.editReply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] });
    }
  },
  executeLegacy(client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      message.reply({ embeds: [Loader(i18n(locale, 'PROCESSINGREQUEST'))] }).then((_message) => {
        getMember(client, message.member, (data) => {
          message.member.levelData = data;
          message.member.tag = message.author.tag;
          generateRankCard(message.member, message.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent);
            _message.edit({ embeds: [], files: [attachmentSent] }).then(() => {
              tempFileRemover(paths);
            });
          });
        });
      });
    } else {
      message.reply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] });
    }
  }
};
