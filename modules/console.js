const chalk = require('chalk')
const boxen = require('boxen')
const moment = require('moment')

module.exports = {
  debug: (message) => {
    process.stdout.write(
      `${chalk.bgGrey.whiteBright.bold(
        ` [${getCurrentTime()}] Debug `
      )} ${message}\n`
    )
  },
  info: (message) => {
    process.stdout.write(
      `${chalk.bgCyan.blackBright.bold(
        ` [${getCurrentTime()}] Information `
      )} ${message}\n`
    )
  },
  success: (message) => {
    process.stdout.write(
      `${chalk.bgGreen.blackBright.bold(
        ` [${getCurrentTime()}] Success `
      )} ${message}\n`
    )
  },
  warn: (message) => {
    process.stdout.write(
      `${chalk.bgYellowBright.whiteBright.bold(
        ` [${getCurrentTime()}] Warning `
      )} ${message}\n`
    )
  },
  error: (message) => {
    process.stdout.write(
      `${chalk.bgRed.blackBright.bold(
        ` [${getCurrentTime()}] Error `
      )} ${message}\n`
    )
  },
  fatal: (message) => {
    process.stdout.write(
      `${boxen(
        `${chalk.yellow('[FATAL]')} ${chalk.yellow(
          `[${getCurrentTime()}]`
        )}\n${message}`,
        { padding: 1, align: 'center' }
      )}\n`
    )
  }
}

function getCurrentTime () {
  return moment().format('MMM Do YY H:mm:ss')
}
