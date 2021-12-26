const topgg = require('topgg-autoposter')
const Statcord = require('statcord.js')

module.exports = async (client) => {
  if (process.env.TOPGG_API_KEY) {
    const ap = topgg.AutoPoster(process.env.TOPGG_API_KEY, client)
    client.log.info('Publicando Estadísticas a Top.GG')
    ap.on('posted', (err) => {
      if (err.status === 503) client.log.warn('TopGG: 503 Servicio no disponible')
      client.log.success('Estadísticas publicadas en Top.GG')
    })
  }

  if (process.env.STATCORD_API_KEY) {
    client.statcord = new Statcord.Client({
      client,
      key: process.env.STATCORD_API_KEY,
      postCpuStatistics: true, /* Whether to post memory statistics or not, defaults to true */
      postMemStatistics: true, /* Whether to post memory statistics or not, defaults to true */
      postNetworkStatistics: true /* Whether to post memory statistics or not, defaults to true */
    })

    client.statcord.on('autopost-start', () => {
      client.log.info('Publicando estadísticas en Statcord...')
    })

    client.statcord.on('post', status => {
      if (!status) client.log.success('Estadísticas publicadas en Statcord')
      else client.log.error(status)
    })
  }
}
