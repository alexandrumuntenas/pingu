const Downloader = require('nodejs-file-downloader')
const randomstring = require('randomstring')

module.exports = async (url) => {
  const nombreTemporalAleatorioDelArchivo = `import_${randomstring.generate({ charset: 'alphabetic' })}.yml`

  const downloader = new Downloader({
    url,
    directory: './temp',
    filename: nombreTemporalAleatorioDelArchivo
  })
  try {
    await downloader.download()
    return { ubicacionArchivo: `./temp/${nombreTemporalAleatorioDelArchivo}` }
  } catch (error) {
    return { error: error.message }
  }
}
