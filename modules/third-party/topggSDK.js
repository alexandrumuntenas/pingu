const topgg = require('topgg-autoposter')

module.exports = (client) => {
  const ap = topgg.AutoPoster(process.env.TOPGG, client)
  client.log.info('Publicando Estadísticas a Top.GG')
  ap.on('posted', (err) => {
    if (err.status === 503) client.log.warn('TopGG: 503 Servicio no disponible')
    client.log.success('Estadísticas publicadas en Top.GG')
  })
}
