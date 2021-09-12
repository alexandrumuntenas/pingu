const { existsSync, mkdirSync, rmdirSync } = require('fs')

module.exports = function () {
  if (!existsSync('./modules/temp')) {
    rmdirSync('./modules/temp', { recursive: true })
    mkdirSync('./modules/temp')
  }
}
