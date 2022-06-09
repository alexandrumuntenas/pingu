const Downloader = require('nodejs-file-downloader')
const randomstring = require('randomstring')

async function descargarArchivoDeConfiguracion (attachmentSource) {
  const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({ charset: 'alphabetic' })}.yml`

  await new Downloader({ attachmentSource, directory: './temp', filename: nombreTemporalAleatorioDelArchivo }).download()

  return { ubicacionArchivo: `./temp/${nombreTemporalAleatorioDelArchivo}` }
}

export default descargarArchivoDeConfiguracion
