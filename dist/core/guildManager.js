import Consolex from './consolex.js';
import procesarObjetosdeConfiguracion from './utils/procesarObjetosdeConfiguracion.js';
import ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion from './utils/ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion.js';
import * as YAML from 'js-yaml';
import * as Downloader from 'nodejs-file-downloader';
import * as randomstring from 'randomstring';
import { PoolConnection, tablasDisponibles } from './databaseManager.js';
import { Guild } from 'discord.js';
import { ClientModuleManager, ClientUser } from '../client.js';
import { writeFileSync, readFileSync } from 'fs';
class GuildManager {
    guilds;
    constructor() {
        this.guilds = ClientUser.guilds.cache.toJSON();
    }
    actulizarConfiguracionDelServidor(guild, datos) {
        if (!ClientModuleManager.comprobarSiElModuloExiste(datos.modulo.nombre)) {
            throw new Error('The module does not exist');
        }
        this.obtenerConfiguracionDelServidor(guild).then((configuracionDelServidor) => {
            if (typeof configuracionDelServidor[datos.modulo.nombre] === 'object' && !Array.isArray(configuracionDelServidor[datos.modulo.nombre]) && configuracionDelServidor[datos.modulo.nombre] !== null) {
                configuracionDelServidor[datos.modulo.nombre] = procesarObjetosdeConfiguracion(configuracionDelServidor[datos.modulo.nombre], datos.nuevaConfiguracion);
                try {
                    PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, JSON.stringify(configuracionDelServidor[datos.modulo.nombre]), guild?.id]);
                    return null;
                }
                catch (err) {
                    Consolex.gestionarError(err);
                }
            }
            else if (typeof datos.nuevaConfiguracion === 'object' &&
                Array.isArray(configuracionDelServidor[datos.modulo.nombre]) &&
                datos.nuevaConfiguracion !== null) {
                try {
                    PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [
                        datos.modulo.nombre,
                        JSON.stringify(datos.nuevaConfiguracion),
                        guild?.id
                    ]);
                    return null;
                }
                catch (err) {
                    Consolex.gestionarError(err);
                }
            }
            else {
                try {
                    PoolConnection.execute('UPDATE `guildConfigurations` SET ?? = ? WHERE guild = ?', [datos.modulo.nombre, datos.nuevaConfiguracion, guild?.id]);
                    return null;
                }
                catch (err) {
                    Consolex.gestionarError(err);
                }
            }
        }).catch(err => Consolex.gestionarError(err));
    }
    async crearNuevoRegistroDeServidor(guild) {
        const configuracionDelServidor = {};
        try {
            await PoolConnection.execute('INSERT INTO `guildConfigurations` (guild) VALUES (?)', [guild?.id]);
            ClientModuleManager.modulosDisponibles.forEach((modulo) => {
                configuracionDelServidor[modulo.nombre] = modulo.configuracionPredeterminada;
                this.actulizarConfiguracionDelServidor(guild, { modulo, nuevaConfiguracion: modulo.configuracionPredeterminada });
            });
        }
        catch (err) {
            Consolex.gestionarError(err);
        }
    }
    async obtenerConfiguracionDelServidor(guild) {
        if (!(guild instanceof Guild))
            throw new Error('El "Guild"" especificado no existe.');
        const configuracionDelServidor = await PoolConnection.execute('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild?.id]).then((result) => result[0]).catch((obtenerDatosError) => Consolex.gestionarError(obtenerDatosError));
        const configuracionDelServidorProcesado = {};
        if (!configuracionDelServidor) {
            this.crearNuevoRegistroDeServidor(guild).then(() => {
                return this.obtenerConfiguracionDelServidor(guild);
            }).catch(err => Consolex.gestionarError(err));
        }
        Object.keys(configuracionDelServidor).forEach((module) => {
            try {
                configuracionDelServidorProcesado[module] = JSON.parse(configuracionDelServidor[module].trim());
            }
            catch (jsonParseError) {
                if (jsonParseError instanceof Error && jsonParseError.constructor.name !== SyntaxError.name) {
                    Consolex.gestionarError(jsonParseError);
                }
            }
        });
        return configuracionDelServidorProcesado;
    }
    async obtenerConfiguracionDelServidorPorModulo(guild, modulo) {
        if (!(guild instanceof Guild))
            throw new Error('El "Guild"" especificado no existe.');
        try {
            const configuracionDelServidor = await PoolConnection.execute('SELECT * FROM `guildConfigurations` WHERE guild = ?', [guild?.id]).then((result) => result[0]);
            if (configuracionDelServidor && typeof modulo === 'string') {
                return configuracionDelServidor[modulo.toLowerCase()] || { guild: guild?.id };
            }
            try {
                this.crearNuevoRegistroDeServidor(guild)
                    .then(() => {
                    return this.obtenerConfiguracionDelServidorPorModulo(guild, modulo);
                })
                    .catch((err) => Consolex.gestionarError(err));
            }
            catch (err2) {
                Consolex.gestionarError(err2);
            }
        }
        catch (err) {
            Consolex.gestionarError(err);
        }
    }
    eliminarRegistroDeServidor(guild) {
        try {
            tablasDisponibles.forEach((table) => {
                try {
                    PoolConnection.execute(`DELETE FROM ${table} WHERE guild = ?`, [
                        guild?.id
                    ]);
                }
                catch (err) {
                    Consolex.gestionarError(err);
                }
            });
        }
        catch (err) {
            Consolex.gestionarError(err);
        }
    }
    async exportarConfiguracionDelServidor(guild) {
        if (!(guild instanceof Guild))
            throw new Error('El "Guild" especificado no existe.');
        const AttachmentBuilderPath = `./temp/${randomstring.generate({
            charset: 'alphabetic'
        })}.yml`;
        const configuracionDelServidor = await this.obtenerConfiguracionDelServidor(guild);
        if (configuracionDelServidor && typeof configuracionDelServidor === 'object') {
            writeFileSync(AttachmentBuilderPath, YAML.dump(configuracionDelServidor));
        }
        else {
            this.crearNuevoRegistroDeServidor(guild)
                .then(() => {
                return this.exportarConfiguracionDelServidor(guild);
            })
                .catch((err) => {
                Consolex.gestionarError(err);
            });
        }
        return AttachmentBuilderPath;
    }
    async importarConfiguracionDelServidor(guild, attachmentBuilderSource) {
        if (!(guild instanceof Guild))
            throw new Error('El "Guild" especificado no existe.');
        if (typeof attachmentBuilderSource !== 'string')
            throw new Error('El "Guild" especificado no existe.');
        const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({
            charset: 'alphabetic'
        })}.yml`;
        // eslint-disable-next-line new-cap
        await new Downloader.default({
            url: attachmentBuilderSource,
            directory: './temp',
            fileName: nombreTemporalAleatorioDelArchivo
        }).download();
        const datosAjustados = ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(YAML.load(readFileSync(nombreTemporalAleatorioDelArchivo, { encoding: 'utf-8' })));
        const errores = datosAjustados.errores;
        const configuracionProcesada = datosAjustados.configuracionProcesada;
        const registro = [
            `Importando configuración para el servidor ${guild?.name}`,
            `Guild: ${guild?.id}`,
            `Fecha (horario del bot): ${new Date().toLocaleString()}`,
            ...errores
        ];
        let posicionArrayModulos = 0;
        ClientModuleManager.modulosDisponibles.forEach((modulo) => {
            try {
                registro.push(`INF: Importando configuración para el módulo ${modulo.nombre}`);
                this.actulizarConfiguracionDelServidor(guild, {
                    modulo,
                    nuevaConfiguracion: configuracionProcesada[modulo.nombre] || {}
                });
            }
            catch (actualizarConfiguracionDelServidorError) {
                registro.push(`ERR: Problemas al importar la configuración para el módulo ${modulo.nombre}: ${actualizarConfiguracionDelServidorError}`);
            }
            posicionArrayModulos++;
            if (posicionArrayModulos === ClientModuleManager.modulosDisponibles.length) {
                registro.push('INF: Importación finalizada');
                const cantidadDeErrores = registro.filter((registro) => registro.startsWith('ERR:')).length;
                const registroProcesado = registro.length ? registro.join('\n') : null;
                return { registroProcesado, cantidadDeErrores };
            }
        });
    }
}
export default GuildManager;
