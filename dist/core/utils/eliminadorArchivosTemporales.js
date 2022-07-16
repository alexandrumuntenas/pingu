import { readdirSync, mkdirSync, unlinkSync, stat } from 'fs';
import Consolex from '../consolex.js';
function eliminarArchivos(files) {
    for (const file of files) {
        stat(`./temp/${file}`, (err, stats) => {
            if (err)
                Consolex.gestionarError(err);
            if (Number(new Date()) - Number(new Date(stats.birthtime)) >= 600000) {
                Consolex.debug(`ClientManager: Eliminador de Archivos temporales ha eliminado ${file}`);
                unlinkSync(`./temp/${file}`);
            }
        });
    }
}
function eliminadorArchivosTemporales() {
    try {
        eliminarArchivos(readdirSync('./temp'));
    }
    catch {
        mkdirSync('./temp');
        Consolex.info('Eliminador de Archivos temporales ha creado el directorio de archivos temporales');
        eliminarArchivos(readdirSync('./temp'));
    }
    setInterval(() => {
        eliminadorArchivosTemporales();
    }, 300000);
}
export default eliminadorArchivosTemporales;
