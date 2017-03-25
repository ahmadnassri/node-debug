'use strict'

const separators = /( |\t|\\,)+/
const format = require('util').format

module.exports = function (set, logger = console.error) {
  const cache = {}
  const env = process.env.DEBUG || process.env.NODE_DEBUG

  if (!env) return Function.prototype

  const DEBUG = env.split(separators).filter(value => !separators.test(value)).filter(Boolean)

  set = set.toUpperCase()

  function debug () {
    logger('%s %d: %s', set, process.pid, format(...arguments))
  }

  if (!cache[set]) {
    try {
      cache[set] = DEBUG.some(str => new RegExp(`^${str}$`, 'i').test(set)) ? debug : Function.prototype
    } catch (err) {
      cache[set] = Function.prototype
    }
  }

  return cache[set]
}
