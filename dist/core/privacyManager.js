import { writeFileSync } from 'fs';
import { PoolConnection, tablasDisponibles } from './databaseManager.js';
import Consolex from './consolex.js';
import * as randomstring from 'randomstring';
class PrivacyManager {
    tablasConDatosDeUsuario;
    tablasConDatosDeServidor;
    constructor() {
        this.tablasConDatosDeServidor = tablasDisponibles.filter((tabla) => tabla.startsWith('guild'));
        this.tablasConDatosDeUsuario = tablasDisponibles.filter((tabla) => tabla.startsWith('member'));
    }
    dataUserDataTakeout(user) {
        const documentoConTodosLosDatos = {};
        const rutaDocumento = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.png`;
        this.tablasConDatosDeUsuario.forEach((tabla) => {
            PoolConnection.query('SELECT * FROM ?? WHERE member ?', [tabla, user.id]).catch((error) => {
                Consolex.gestionarError(error);
            }).then((datos) => {
                if (Object.prototype.hasOwnProperty.call(datos, 0)) {
                    documentoConTodosLosDatos[tabla] = datos[0];
                }
            });
        });
        writeFileSync(rutaDocumento, JSON.stringify(documentoConTodosLosDatos));
        return rutaDocumento;
    }
    eliminarGuildMemberData(member) {
        this.tablasConDatosDeUsuario.forEach((tabla) => {
            PoolConnection.query('DELETE FROM ?? WHERE member = ? AND guild = ?', [tabla, member.id, member.guild.id]).catch((error) => {
                Consolex.gestionarError(error);
            });
        });
    }
    eliminarGuildData(guild) {
        this.tablasConDatosDeServidor.forEach((tabla) => {
            PoolConnection.query('DELETE FROM ?? WHERE guild = ?', [tabla, guild.id]).catch((error) => {
                Consolex.gestionarError(error);
            });
        });
    }
}
export default PrivacyManager;
