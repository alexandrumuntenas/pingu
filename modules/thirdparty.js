const topgg = require("topgg-autoposter");
const Statcord = require("statcord.js");

module.exports = async (client) => {
  if (process.env.TOPGG_API_KEY) {
    const ap = topgg.AutoPoster(process.env.TOPGG_API_KEY, client);
    client.console.info("Publicando Estadísticas a Top.GG");
    ap.on("posted", (err) => {
      if (err.status === 503)
        client.console.warn("TopGG: 503 Servicio no disponible");
      client.console.success("Estadísticas publicadas en Top.GG");
    });
  }

  if (process.env.STATCORD_API_KEY) {
    client.statcord = new Statcord.Client({
      client,
      key: process.env.STATCORD_API_KEY,
      postCpuStatistics: true,
      postMemStatistics: true,
      postNetworkStatistics: true,
    });

    client.statcord.on("autopost-start", () => {
      client.console.info("Publicando estadísticas en Statcord...");
    });

    client.statcord.on("post", (status) => {
      if (!status)
        client.console.success("Estadísticas publicadas en Statcord");
      else client.console.error(status);
    });
  }
};
