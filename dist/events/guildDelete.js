import Event from '../core/classes/Event.js';
import { ClientEventManager, ClientGuildManager } from '../client.js';
export default new Event('guildDelete', (guild) => {
    ClientGuildManager.eliminarRegistroDeServidor(guild);
    ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildDelete' }, guild);
});
