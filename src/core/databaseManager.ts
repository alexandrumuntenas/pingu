import Consolex from './consolex.js'

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

let tablasDisponibles: string[] = []

function comprobarSiExistenTodasLasTablasNecesarias () {
  Consolex.info('DatabaseManager: Comprobando si existen todas las tablas necesarias...')

  const consultas = readdirSync('./database/')
  const tablasYConsultas: { [key: string]: string } = {}

  consultas.forEach((file) => {
    if (file.endsWith('.sql')) {
      tablasYConsultas[file] = readFileSync(`./database/${file}`, 'utf8')
    }
  })

  tablasDisponibles = Object.keys(tablasYConsultas)

  tablasDisponibles.forEach((tabla) => {
    try {
      PoolConnection.execute(tablasYConsultas[tabla]).then(() => {
        return Consolex.info(`DatabaseManager: La tabla ${tabla} se ha creado correctamente.`)
      })
    } catch (error: unknown) {
      console.log(typeof error)
      /* if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.info(`DatabaseManager: La tabla ${tabla} se encuentra presente.`)
      } else if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
        return Consolex.error(`DatabaseManager: La tabla ${tabla} no existía y no se ha podido crear.`)
      } */
    }
  })
}

export { PoolConnection, tablasDisponibles, comprobarSiExistenTodasLasTablasNecesarias }
