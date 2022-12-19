const separators = /( |\t|\\,)+/
const { format } = require('util')

module.exports = function (key, logger) {
  logger = logger || console.error

  const cache = {}
  const env = process.env.DEBUG || process.env.NODE_DEBUG

  /* istanbul ignore next */
  if (!env) return Function.prototype

  const DEBUG = env.split(separators).filter(value => !separators.test(value)).filter(Boolean)

  key = key.toUpperCase()

  function debug () {
    logger('%s %d: %s', key, process.pid, ...arguments)
  }

  /* istanbul ignore else */
  if (!cache[key]) {
    try {
      cache[key] = DEBUG.some(str => new RegExp(`^${str}$`, 'i').test(key)) ? debug : Function.prototype
    } catch (err) {
      /* istanbul ignore next */
      cache[key] = Function.prototype
    }
  }

  return cache[key]
}
