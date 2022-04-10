require('dotenv').config()
const { obtenerConfiguracionDelGuild } = require('../../functions/guildManager')
const Discord = require('discord.js')
const Consolex = require('../../functions/consolex')
// Eliminar comentario a la siguiente línea para que funcione el actualizador.
// const Database = require('../../functions/databaseConnection')

const Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING], partials: ['REACTION', 'MESSAGE', 'USER'] })

Client.login(process.env.PUBLIC_TOKEN)

Client.on('ready', () => {
  Consolex.info('Bot is ready!')
  Client.guilds.fetch().then(guilds => {
    for (const guild of guilds.values()) {
      setTimeout(() => {
        obtenerConfiguracionDelGuild(guild, () => Consolex.info(`[${guild.id}] Updated`))
      }, 2500)
    }
  })
})
