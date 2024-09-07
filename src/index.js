const { yellow, dim, bool } = require('./utils.js')

const separators = /( |\t|\\,)+/

module.exports = function (key, { logger = console.debug, pid = true, perf = false } = {}) {
  const env = process.env.DEBUG || process.env.NODE_DEBUG
  const showPid = process.env.DEBUG_PID ? bool(process.env.DEBUG_PID) : pid
  const showPerf = process.env.DEBUG_PERF ? bool(process.env.DEBUG_PERF) : perf

  /* node:coverage ignore next */
  if (!env) return Function.prototype

  const cache = {}

  const DEBUG = env.split(separators).filter(value => !separators.test(value)).filter(Boolean)

  key = key.toUpperCase()

  function debug () {
    const args = [...arguments]

    if (showPerf) {
      const elapsedTime = Math.round(performance.now())

      args.unshift(`${yellow(`(${elapsedTime}ms)`)}`)
    }

    const prefix = (showPid) ? [dim(`${key} ${process.pid}`)] : [dim(key)]

    logger(...prefix, ...args)
  }

  if (!cache[key]) {
    try {
      cache[key] = DEBUG.some(str => new RegExp(`^${str}$`, 'i').test(key)) ? debug : Function.prototype
    /* node:coverage disable */
    } catch (err) {
      cache[key] = Function.prototype
    }
    /* node:coverage enable */
  }

  return cache[key]
}
