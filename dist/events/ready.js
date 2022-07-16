import Event from '../core/classes/Event.js';
import Consolex from '../core/consolex.js';
import eliminadorArchivosTemporales from '../core/utils/eliminadorArchivosTemporales.js';
import { ActivityType } from 'discord.js';
import { ClientEventManager, ClientUser } from '../client';
export default new Event('ready', () => {
    Consolex.info(`Conectado como ${ClientUser.user?.tag}!`);
    eliminadorArchivosTemporales();
    ClientUser.user?.setActivity('new update TS2203', { type: ActivityType.Watching });
    ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildMemberAdd' });
    setInterval(() => {
        ClientUser.user?.setActivity(`${ClientUser.guilds.cache.size} guilds`, { type: ActivityType.Watching });
    }, 600000);
});
