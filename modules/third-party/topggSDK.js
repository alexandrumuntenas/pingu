const topgg = require('topgg-autoposter')

module.exports = (client) => {
  const ap = topgg.AutoPoster(process.env.TOPGG, client)
  console.log('[··] Publicando Estadísticas a Top.GG')
  ap.on('posted', (err) => {
    if (err.status === 503) console.log('[ERR] TopGG: 503 Servicio no disponible')
    console.log('[OK] Estadísticas publicadas en Top.GG')
  })
}
