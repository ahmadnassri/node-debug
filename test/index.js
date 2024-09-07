const debuglog = require('..')
const { beforeEach, afterEach, describe, test } = require('node:test')
const sinon = require('sinon')

beforeEach(() => {
  sinon.stub(console, 'debug')
})

afterEach(() => {
  delete process.env.DEBUG
  delete process.env.NODE_DEBUG

  console.debug.restore()
})

describe('env', () => {
  test('DEBUG=FOO', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, ['FOO', process.pid, 'bar'])
  })

  test('NODE_DEBUG=FOO', t => {
    t.plan(2)

    process.env.NODE_DEBUG = 'FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, ['FOO', process.pid, 'bar'])
  })

  test('DEBUG=BAR, FOO', t => {
    t.plan(2)

    process.env.DEBUG = 'BAR, FOO'

    const debug = debuglog('foo')

    debug('bar')

    t.assert.ok(console.debug.called)
    t.assert.deepEqual(console.debug.lastCall.args, ['FOO', process.pid, 'bar'])
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
    t.assert.deepEqual(console.debug.lastCall.args, ['FOO', process.pid, 'bar'])
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

  test('time', t => {
    t.plan(2)

    process.env.DEBUG = 'FOO'

    const debug = debuglog('foo', { time: true })

    debug('bar')

    t.assert.ok(console.debug.called)

    t.assert.match(console.debug.lastCall.args[1], /\[\u001B\[33m\d+ms\u001B\[39m\]/)
  })
})
