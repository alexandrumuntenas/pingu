const { unlinkSync, stat, readdirSync, mkdirSync } = require('fs')
const consolex = require('./consolex')

/**
 * Remove files older than 10 minutes every 5 minutes
 */

module.exports = () => {
  let files
  try {
    files = readdirSync('./modules/temp')
  } catch {
    mkdirSync('./modules/temp')
  } finally {
    files = readdirSync('./modules/temp')
  }

  for (const file of files) {
    stat(`./modules/temp/${file}`, (err, stats) => {
      if (err) consolex.handleError(err)

      const fileDate = new Date(stats.birthtime)
      const now = new Date()

      if (now - fileDate >= 600000) {
        consolex.info(`Eliminador de Archivos temporales ha eliminado ${file}`)
        unlinkSync(`./modules/temp/${file}`)
      }
    })
  }
}
