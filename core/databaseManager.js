const Database = require('mysql2').createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})

Database.config.namedPlaceholders = true

module.exports = Database

const Consolex = require('./consolex')
const { readdirSync, readFileSync } = require('fs')

module.exports.comprobarSiExistenTodasLasTablasNecesarias = () => {
  Consolex.info('DB: Comprobando si existen todas las tablas necesarias...')
  const consultas = readdirSync('./database/')
  const tablasYConsultas = {}

  consultas.forEach(file => {
    if (file.endsWith('.sql')) {
      tablasYConsultas[file] = readFileSync(`./database/${file}`, 'utf8')
    }
  })

  const tablas = Object.keys(tablasYConsultas)

  tablas.forEach(tabla => {
    Database.query(tablasYConsultas[tabla], (err) => {
      if (err && err.code === 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.info(`DB: La tabla ${tabla} se encuentra presente.`)
      } else if (err && err.code !== 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.error(`DB: La tabla ${tabla} no existía y no se ha podido crear.`)
      }

      return Consolex.info(`DB: La tabla ${tabla} se ha creado correctamente.`)
    })
  })
}
