const Database = require('mysql2/promise').createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})

module.exports = Database

const consolex = require('./consolex')
const { readdirSync, readFileSync } = require('fs')

module.exports.tablasDisponibles = []

module.exports.comprobarSiExistenTodasLasTablasNecesarias = () => {
  consolex.info('DatabaseManager: Comprobando si existen todas las tablas necesarias...')
  const consultas = readdirSync('./database/')
  const tablasYConsultas = {}

  consultas.forEach(file => {
    if (file.endsWith('.sql')) {
      tablasYConsultas[file] = readFileSync(`./database/${file}`, 'utf8')
    }
  })

  module.exports.tablasDisponibles = Object.keys(tablasYConsultas)

  module.exports.tablasDisponibles.forEach(async tabla => {
    try {
      await Database.execute(tablasYConsultas[tabla])
      return consolex.info(`DatabaseManager: La tabla ${tabla} se ha creado correctamente.`)
    } catch (err) {
      if (err && err.code === 'ER_TABLE_EXISTS_ERROR') {
        return consolex.info(`DatabaseManager: La tabla ${tabla} se encuentra presente.`)
      } else if (err && err.code !== 'ER_TABLE_EXISTS_ERROR') {
        return consolex.error(`DatabaseManager: La tabla ${tabla} no existía y no se ha podido crear.`)
      }
    }
  })
}
