import Event from '../classes/Event'
import { ClientEventManager } from '../client'

export default new Event('guildMemberAdd', (member) => {
  ClientEventManager.ejecutarFuncionesDeTerceros('guildMemberAdd', null, member)
})
