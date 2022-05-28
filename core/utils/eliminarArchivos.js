const { unlinkSync, stat } = require('fs')

const consolex = require('../consolex')

module.exports = (files) => {
  for (const file of files) {
    stat(`./temp/${file}`, (err, stats) => {
      if (err) consolex.gestionarError(err)

      const fileDate = new Date(stats.birthtime)
      const now = new Date()

      if (now - fileDate >= 600000) {
        consolex.debug(`ClientManager: Eliminador de Archivos temporales ha eliminado ${file}`)
        unlinkSync(`./temp/${file}`)
      }
    })
  }
}
