import Event from '../core/classes/Event'
import { GuildMember } from 'discord.js'
import { ClientEventManager } from '../client'

export default new Event('guildMemberAdd', (member: GuildMember) => {
  ClientEventManager.deprecatedEjecutarFuncionesDeterceros('guildMemberAdd', null, member)
})
