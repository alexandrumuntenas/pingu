const fs = require('fs')

module.exports = function () {
  console.log('[··] Comprobando carpetas')
  if (!fs.existsSync('./usuarios')) {
    fs.mkdirSync('./usuarios/')
    console.log('[··] Carpeta usuarios no existe >> creando...')
    fs.mkdirSync('./usuarios/moderacion')
    console.log('[··] Carpeta moderacion no existe >> creando...')
    fs.mkdirSync('./usuarios/avatares')
    console.log('[··] Carpeta avatares no existe >> creando...')
    fs.mkdirSync('./usuarios/leveling')
    console.log('[··] Carpeta leveling no existe >> creando...')
    fs.mkdirSync('./usuarios/bievenidas')
    console.log('[··] Carpeta bienvenidas no existe >> creando...')
  }
  if (!fs.existsSync('./usuarios/moderacion')) {
    console.log('[··] Carpeta moderacion no existe >> creando...')
    fs.mkdirSync('./usuarios/moderacion')
  }
  if (!fs.existsSync('./usuarios/avatares')) {
    console.log('[··] Carpeta avatares no existe >> creando...')
    fs.mkdirSync('./usuarios/avatares')
  }
  if (!fs.existsSync('./usuarios/leveling')) {
    console.log('[··] Carpeta leveling no existe >> creando...')
    fs.mkdirSync('./usuarios/leveling')
  }
  if (!fs.existsSync('./usuarios/bienvenidas')) {
    console.log('[··] Carpeta bienvenidas no existe >> creando...')
    fs.mkdirSync('./usuarios/bienvenidas')
  }
  if (!fs.existsSync('./logs')) {
    console.log('[··] Carpeta de registros no existe >> creando...')
  }
  console.log('[OK] Existen todas las carpetas necesarias')
}
