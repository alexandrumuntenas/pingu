const chalk = require('chalk')
const moment = require('moment')
const Sentry = require('@sentry/node')

if (process.env.SENTRY_DSN) {
  const sentryConfig = { dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 }

  if (process.env.ENTORNO === 'public') sentryConfig.environment = 'production'
  else sentryConfig.environment = 'development'

  Sentry.init(sentryConfig)
}

function getCurrentTime () {
  return moment().format('MMM Do YY H:mm:ss')
}

module.exports = {
  debug: message => {
    process.stdout.write(`${getCurrentTime()} [${chalk.whiteBright.bold(' DEBUG ')}]     ${message}\n`)
  },
  info: message => {
    process.stdout.write(`${getCurrentTime()} [${chalk.cyanBright.bold('INFORMA')}]   ${message}\n`)
  },
  success: message => {
    process.stdout.write(`${getCurrentTime()} [${chalk.greenBright.bold('SUCCESS')}]   ${message}\n`)
  },
  warn: message => {
    process.stdout.write(`${getCurrentTime()} [${chalk.yellowBright.bold('WARNING')}]   ${message}\n`)
  },
  error: message => {
    process.stdout.write(`${getCurrentTime()} [${chalk.redBright.bold('ERROR')}]     ${message}\n`)
  },
  gestionarError: err => {
    module.exports.error(err)
    module.exports.Sentry.captureException(err)
  },
  Sentry
}
