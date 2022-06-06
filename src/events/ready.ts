import Consolex from '../core/consolex'
import { ClientUser } from '../client'
import eliminadorArchivosTemporales from '../core/utils/eliminadorArchivosTemporales'
import { ejecutarFuncionesDeTerceros } from '../core/eventManager'
import { ActivityType } from 'discord.js'

module.exports = {
  name: 'ready',
  execute: () => {
    Consolex.info(`Conectado como ${ClientUser.user.tag}!`)

    eliminadorArchivosTemporales()
    ClientUser.user.setActivity('new update TS2203', { type: ActivityType.Watching })

    ejecutarFuncionesDeTerceros('guildMemberAdd')

    setInterval(() => {
      ClientUser.user.setActivity(`${ClientUser.guilds.cache.size} guilds`, { type: ActivityType.Watching })
    }, 600000)
  }
}
