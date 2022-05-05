const chalk = require('chalk')
const boxen = require('boxen')
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
    process.stdout.write(`${chalk.bgGrey.whiteBright.bold(` [${getCurrentTime()}] D `)} ${message}\n`)
  },
  info: message => {
    process.stdout.write(`${chalk.bgCyan.blackBright.bold(` [${getCurrentTime()}] I `)} ${message}\n`)
  },
  success: message => {
    process.stdout.write(`${chalk.bgGreen.blackBright.bold(` [${getCurrentTime()}] S `)} ${message}\n`)
  },
  warn: message => {
    process.stdout.write(`${chalk.bgYellowBright.whiteBright.bold(` [${getCurrentTime()}] W `)} ${message}\n`)
  },
  error: message => {
    process.stdout.write(`${chalk.bgRed.blackBright.bold(` [${getCurrentTime()}] E `)} ${message}\n`)
  },
  fatal: message => {
    process.stdout.write(`${boxen(`${chalk.yellow('[FATAL]')} ${chalk.yellow(`[${getCurrentTime()}]`)}\n${message}`, { padding: 1, align: 'center' })}\n`)
  },
  gestionarError: err => {
    module.exports.error(err)
    module.exports.Sentry.captureException(err)
  },
  Sentry
}
