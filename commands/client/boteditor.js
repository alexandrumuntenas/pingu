const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed } = require('discord.js')
const { subirInteraccionesDelServidor, actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')
const { construirHelpDelComando } = require('../../functions/commandsManager')

const avaliableModules = ['suggestions', 'farewell', 'welcome', 'autoreplies', 'customcommands', 'leveling', 'mcsrvstatus']
const i18n = require('../../i18n/i18n')
const Consolex = require('../../functions/consolex')

module.exports = {
  name: 'boteditor',
  description: 'BOT::HELP:DESCRIPTION',
  cooldown: 1000,
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: true,
  interaction: new SlashCommandBuilder(),
  runInteraction (interaction) {

  },
  runCommand (message) {

  }
}
