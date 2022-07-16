// TODO: ALGO HAY QUE HACER CON ESTO. HOLA A PRIVACYMANAGER?
import Event from '../core/classes/Event.js'
import { ClientEventManager, ClientPrivacyManager, ClientUser } from '../client.js'
export default new Event('guildMemberRemove', (member) => {
  if (member.user.id !== ClientUser.user?.id) {
    ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildMemberRemove' }, member)
    ClientPrivacyManager.eliminarGuildMemberData(member)
  }
})
