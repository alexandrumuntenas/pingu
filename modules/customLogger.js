const chalk = require('chalk')
const boxen = require('boxen')
const moment = require('moment')

/**
 * Prints to stdout with newline.
 * @param {message} message Discord Collection for Commands
 */
module.exports = {
  debug: (message) => {
    process.stdout.write(`[${getCurrentTime()}] ${chalk.grey('[D]')} ${message}\n`)
  },
  info: (message) => {
    process.stdout.write(`[${getCurrentTime()}] ${chalk.cyan('[I]')} ${message}\n`)
  },
  success: (message) => {
    process.stdout.write(`[${getCurrentTime()}] ${chalk.green('[S]')} ${message}\n`)
  },
  warn: (message) => {
    process.stdout.write(`[${getCurrentTime()}] ${chalk.yellowBright('[W]')} ${message}\n`)
  },
  error: (message) => {
    process.stdout.write(`[${getCurrentTime()}] ${chalk.red('[E]')} ${message}\n`)
  },
  fatal: (message) => {
    process.stdout.write(`${boxen(`${chalk.yellow('[FATAL]')} ${chalk.yellow(`[${getCurrentTime()}]`)}\n${message}`, { padding: 1, align: 'center' })}\n`)
  },
  critical: (message) => {
    process.stdout.write(`${boxen(`${chalk.yellow('[FATAL]')} ${chalk.yellow(`[${getCurrentTime()}]`)}\n${message}`, { padding: 1, align: 'center' })}\n`)
  }
}

function getCurrentTime () {
  return moment().format('MMM Do YY H:mm:ss')
}
