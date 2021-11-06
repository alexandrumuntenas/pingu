module.exports = async (client) => {
  client.log.info(`Conectado como ${client.user.tag}!`)
  updateStatus(client)
  setInterval(() => {
    updateStatus(client)
    client.log.info('Presencia refrescada')
  }, 3600000)
}

function updateStatus (client) {
  const date = new Date()
  let currentHours = date.getHours()
  currentHours = ('0' + currentHours).slice(-2)

  // Se ajusta a las horas españolas de la península. Para obtener la hora española
  // se debe sumar a las horas +5
  if (currentHours >= 1 && currentHours <= 13) {
    client.user.setPresence({
      status: 'online'
    })
  } else {
    client.user.setPresence({
      status: 'idle'
    })
  }
}
