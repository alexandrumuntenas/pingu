const fs = require('fs')

module.exports = function () {
  if (!fs.existsSync('./usuarios')) {
    fs.mkdirSync('./usuarios/')
    fs.mkdirSync('./usuarios/moderacion')
    fs.mkdirSync('./usuarios/avatares')
    fs.mkdirSync('./usuarios/leveling')
    fs.mkdirSync('./usuarios/bievenidas')
  }
  if (!fs.existsSync('./usuarios/moderacion')) {
    fs.mkdirSync('./usuarios/moderacion')
  }
  if (!fs.existsSync('./usuarios/avatares')) {
    fs.mkdirSync('./usuarios/avatares')
  }
  if (!fs.existsSync('./usuarios/leveling')) {
    fs.mkdirSync('./usuarios/leveling')
  }
  if (!fs.existsSync('./usuarios/bienvenidas')) {
    fs.mkdirSync('./usuarios/bienvenidas')
  }
}
