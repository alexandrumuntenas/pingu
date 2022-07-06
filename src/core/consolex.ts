import chalk from 'chalk'
import * as moment from 'moment'
import * as Sentry from '@sentry/node'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV
  })
}

function getCurrentTime () {
  return moment().format('MMM Do YY H:mm:ss')
}

const Consolex = {
  debug: (message: string | unknown) => {
    process.stdout.write(`${getCurrentTime()} [${chalk.whiteBright.bold(' DEBUG ')}]   ${message}\n`)
  },
  info: (message: string | unknown) => {
    process.stdout.write(`${getCurrentTime()} [${chalk.cyanBright.bold('INFORMA')}]   ${message}\n`)
  },
  success: (message: string | unknown) => {
    process.stdout.write(`${getCurrentTime()} [${chalk.greenBright.bold('SUCCESS')}]   ${message}\n`)
  },
  warn: (message: string | unknown) => {
    process.stdout.write(`${getCurrentTime()} [${chalk.yellowBright.bold('WARNING')}]   ${message}\n`)
  },
  error: (message: string | unknown) => {
    process.stdout.write(`${getCurrentTime()} [${chalk.redBright.bold('ERROR')}]     ${message}\n`)
  },
  gestionarError: (err: string | unknown) => {
    module.exports.error(err)
    module.exports.Sentry.captureException(err)
    throw err
  },
  Sentry
}

export default Consolex
