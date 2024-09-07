const debuglog = require('..')
const { beforeEach, afterEach, describe, test } = require('node:test')
const sinon = require('sinon')

beforeEach(() => {
  sinon.stub(console, 'debug')
})

afterEach(() => {
  delete process.env.DEBUG
  delete process.env.NODE_DEBUG
  delete process.env.DEBUG_PID
  delete process.env.DEBUG_PERF

  console.debug.restore()
})

describe('env', () => {
  test('DEBUG=FOO', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, [`FOO ${process.pid}`, 'bar'])
  })

  test('NODE_DEBUG=FOO', t => {
    t.plan(2)

    process.env.NODE_DEBUG = 'FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, [`FOO ${process.pid}`, 'bar'])
  })

  test('DEBUG=BAR, FOO', t => {
    t.plan(2)

    process.env.DEBUG = 'BAR, FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, [`FOO ${process.pid}`, 'bar'])
  })

  test('DEBUG=BAZ, BAR', t => {
    t.plan(1)

    process.env.DEBUG = 'BAZ, BAR'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(!console.debug.called, 'should not trigger')

    debug('bar')
  })

  test('DEBUG=F.*', t => {
    t.plan(2)

    process.env.DEBUG = 'F.*'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, [`FOO ${process.pid}`, 'bar'])
  })

  test('DEBUG_PERF=1', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'
    process.env.DEBUG_PERF = '0'

    const logger = sinon.stub()

    const debug = debuglog('foo', { logger, perf: false })

    debug('bar')

    t.assert.ok(logger.called)
    t.assert.equal(logger.lastCall.args[0], `FOO ${process.pid}`)
  })

  test('DEBUG_PID=1', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'
    process.env.DEBUG_PID = '0'

    const logger = sinon.stub()

    const debug = debuglog('foo', { logger, pid: false })

    debug('bar')

    t.assert.ok(logger.called)
    t.assert.equal(logger.lastCall.args[0], 'FOO')
  })
})

describe('custom logger', () => {
  test('custom logger', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const logger = sinon.stub()

    const debug = debuglog('foo', { logger })

    debug('bar')

    t.assert.ok(logger.called)
    t.assert.equal(logger.lastCall.args[0], `FOO ${process.pid}`)
  })
})

describe('options', () => {
  test('pid', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const debug = debuglog('foo', { pid: false })

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, ['FOO', 'bar'])
  })

  test('perf', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const debug = debuglog('foo', { perf: true })

    debug('bar')

    t.assert.ok(console.debug.called)

    t.assert.match(console.debug.lastCall.args[1], /\(\d+ms\)/)
  })
})
