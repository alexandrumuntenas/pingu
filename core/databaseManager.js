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

const { readdirSync, readFileSync } = require('fs')

module.exports.comprobarSiExistenTodasLasTablasNecesarias = () => {
  // abrir cada sql de la carpeta database y ejecutar el query

  const consultas = readdirSync('./database/')
  const tablasYConsultas = {}

  consultas.forEach(file => {
    if (file.endsWith('.sql')) {
      tablasYConsultas[file] = readFileSync(`./database/${file}`, 'utf8')
    }
  })

  const tablas = Object.keys(tablasYConsultas)
}
