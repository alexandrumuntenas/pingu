import Event from '../core/classes/Event.js'
import { ClientEventManager } from '../client.js'
export default new Event('guildMemberAdd', (member) => {
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildMemberAdd' }, member)
})
