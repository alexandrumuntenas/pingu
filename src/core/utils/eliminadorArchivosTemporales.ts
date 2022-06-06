import { readdirSync, mkdirSync, unlinkSync, stat } from 'fs' 
import Consolex from '../consolex' 
 
function eliminarArchivos (files: string[]) { 
  for (const file of files) { 
    stat(`./temp/${file}`, (err, stats) => { 
      if (err) Consolex.gestionarError(err) 
 
      const fileDate = new Date(stats.birthtime) 
      const now = new Date() 
 
      if (now - fileDate >= 600000) { 
        Consolex.debug( 
          `ClientManager: Eliminador de Archivos temporales ha eliminado ${file}` 
        ) 
        unlinkSync(`./temp/${file}`) 
      } 
    }) 
  } 
} 
 
function eliminadorArchivosTemporales (): void  { 
  try { 
    eliminarArchivos(readdirSync('./temp')) 
  } catch { 
    mkdirSync('./temp') 
    Consolex.info( 
      'Eliminador de Archivos temporales ha creado el directorio de archivos temporales' 
    ) 
    eliminarArchivos(readdirSync('./temp')) 
  } 
 
  setInterval(() => { 
    eliminadorArchivosTemporales() 
  }, 300000) 
} 
 
export default eliminadorArchivosTemporales 
