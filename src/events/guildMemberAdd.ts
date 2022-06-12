import Event from '../classes/Event'
import { GuildMember } from 'discord.js'
import { ClientEventManager } from '../client'

export default new Event('guildMemberAdd', (member: GuildMember) => {
  ClientEventManager.ejecutarFuncionesDeTerceros('guildMemberAdd', null, member)
})
