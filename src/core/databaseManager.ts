import Consolex from './consolex'
import { createPool } from 'mysql2/promise'
import { readdirSync, readFileSync } from 'fs'

const PoolConnection = createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})

let tablasDisponibles = []

function comprobarSiExistenTodasLasTablasNecesarias () {
  Consolex.info('DatabaseManager: Comprobando si existen todas las tablas necesarias...')
  const consultas = readdirSync('./database/')
  const tablasYConsultas = {}

  consultas.forEach(file => {
    if (file.endsWith('.sql')) {
      tablasYConsultas[file] = readFileSync(`./database/${file}`, 'utf8')
    }
  })

  tablasDisponibles = Object.keys(tablasYConsultas)

  tablasDisponibles.forEach(async tabla => {
    try {
      await PoolConnection.execute(tablasYConsultas[tabla])
      return Consolex.info(`DatabaseManager: La tabla ${tabla} se ha creado correctamente.`)
    } catch (err) {
      if (err && err.code === 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.info(`DatabaseManager: La tabla ${tabla} se encuentra presente.`)
      } else if (err && err.code !== 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.error(`DatabaseManager: La tabla ${tabla} no existía y no se ha podido crear.`)
      }
    }
  })
}

export { PoolConnection, tablasDisponibles, comprobarSiExistenTodasLasTablasNecesarias }
