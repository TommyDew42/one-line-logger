'use-strict'

const pretty = require('pino-pretty')

const LEVEL_TO_STRING = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace'
}

const formatTime = (timestamp) => {
  const dateObject = new Date(timestamp)

  const date = dateObject.getDate()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const year = dateObject.getFullYear()
  const hour = dateObject.getHours()
  const minute = dateObject.getMinutes()
  const second = dateObject.getSeconds()
  const milliSecond = dateObject.getMilliseconds()

  const time = `${year}-${month}-${date} ${hour}:${minute}:${second}.${milliSecond}`

  return time
}

const messageFormat = (log, messageKey) => {
  const time = formatTime(log.time)
  const level = LEVEL_TO_STRING[log.level]

  const logMessages = [time, level]

  if (log.req) {
    const { method, url } = log.req

    logMessages.push(`${method} ${url}`)
  }

  logMessages.push(log[messageKey])

  return logMessages.join(' - ')
}

const target = (opts) =>
  pretty({
    messageFormat,
    ignore: 'pid,hostname,time,level',
    hideObject: true,
    ...opts
  })

module.exports = target
module.exports.messageFormat = messageFormat
