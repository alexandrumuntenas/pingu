// TODO: ALGO HAY QUE HACER CON ESTO. HOLA A PRIVACYMANAGER?

import Event from '../core/classes/Event'
import { ClientEventManager, ClientPrivacyManager, ClientUser } from '../client'
import { GuildMember } from 'discord.js'

export default new Event('guildMemberRemove', (member: GuildMember) => {
  if (member.user.id !== ClientUser.user?.id) {
    ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildMemberRemove' }, member)
    ClientPrivacyManager.eliminarGuildMemberData(member)
  }
})
