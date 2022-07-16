import Event from '../core/classes/Event.js'
import { GuildMember } from 'discord.js'
import { ClientEventManager } from '../client.js'

export default new Event('guildMemberAdd', (member: GuildMember) => {
  console.log(member)
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildMemberAdd' }, member)
})
