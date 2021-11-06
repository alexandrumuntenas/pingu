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
  if (currentHours >= 6 && currentHours <= 12) {
    client.user.setPresence({
      status: 'online'
    })
  } else if (currentHours >= 13 && currentHours <= 18) {
    client.user.setPresence({
      status: 'online'
    })
  } else if (currentHours >= 19 && currentHours <= 23) {
    client.user.setPresence({
      status: 'idle'
    })
  } else {
    client.user.setPresence({
      status: 'idle'
    })
  }
}
