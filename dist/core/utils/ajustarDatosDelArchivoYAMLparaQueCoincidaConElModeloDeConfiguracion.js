/* eslint-disable valid-typeof */
import { ClientModuleManager } from '../../client.js';
function loopDeComprobacion(modeloDeConfiguracion, configuracionAComparar) {
    const configuracionProcesada = {};
    const propiedadesModeloConfiguracion = Object.keys(modeloDeConfiguracion);
    const propiedadesConfiguracionAComparar = Object.keys(configuracionAComparar || {});
    const errores = [];
    propiedadesModeloConfiguracion.forEach(propiedad => {
        if (propiedadesConfiguracionAComparar.includes(propiedad)) {
            if (typeof modeloDeConfiguracion[propiedad] === 'object') {
                const datosComprobados = loopDeComprobacion(modeloDeConfiguracion[propiedad], configuracionAComparar[propiedad]);
                if (datosComprobados.errores.length > 0) {
                    errores.push(...datosComprobados.errores);
                }
                else
                    configuracionProcesada[propiedad] = datosComprobados.configuracionProcesada;
            }
            else {
                if (typeof configuracionAComparar[propiedad] === modeloDeConfiguracion[propiedad])
                    configuracionProcesada[propiedad] = configuracionAComparar[propiedad];
                else
                    errores.push(`La propiedad ${propiedad} no es del tipo ${modeloDeConfiguracion[propiedad]}`);
            }
        }
        else {
            errores.push(`La propiedad ${propiedad} no existe en la configuración`);
        }
    });
    return { configuracionProcesada, errores };
}
function ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion(configuracionImportadaUnknown) {
    if (!(configuracionImportadaUnknown instanceof Object))
        throw new Error('configuracionImportada no es un objeto.');
    const configuracionImportada = { ...configuracionImportadaUnknown };
    const errores = [];
    const configuracionProcesada = {};
    ClientModuleManager.modulosDisponibles.forEach(module => {
        if (Object.prototype.hasOwnProperty.call(configuracionImportada, module.nombre)) {
            configuracionProcesada[module.nombre.toLocaleLowerCase()] = loopDeComprobacion(module.modeloDeConfiguracion, configuracionImportada[module.nombre]);
        }
        else {
            errores.push(`El módulo ${module.nombre} no existe en la configuración`);
        }
    });
    return { configuracionProcesada, errores };
}
export default ajustarDatosDelArchivoYAMLparaQueCoincidaConElModeloDeConfiguracion;
