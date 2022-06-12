import Event from '../classes/Event'

import { ClientEventManager, ClientMemberManager, ClientUser } from '../client'
import { GuildMember } from 'discord.js'

export default new Event('guildMemberRemove', (member: GuildMember) => {
  if (member.user.id !== ClientUser.user.id) {
    ClientEventManager.ejecutarFuncionesDeTerceros('guildMemberRemove', null, member)
    ClientMemberManager.eliminarDatosDelUsuario(member)
  }
})
