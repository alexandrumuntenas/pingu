import Event from '../classes/Event'

import { ClientUser } from '../client'
import { GuildMember } from 'discord.js'
const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')
const { eliminarDatosDelUsuario } = require('../core/memberManager')

export default new Event('guildMemberRemove', (member: GuildMember) => {
  if (member.user.id !== ClientUser.user.id) {
    ejecutarFuncionesDeTerceros('guildMemberRemove', null, member)
    eliminarDatosDelUsuario(member)
  }
})
