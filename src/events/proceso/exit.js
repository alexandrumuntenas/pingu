const { ClientUser } = require('../../client')

module.exports = {
  name: 'exit',
  execute: () => {
    ClientUser.destroy()
    process.exit()
  }
}
