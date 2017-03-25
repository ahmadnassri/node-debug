'use strict'

const debug = require('..')
const tap = require('tap')

tap.afterEach(done => {
  delete process.env.DEBUG
  delete process.env.NODE_DEBUG

  done()
})

tap.test('DEBUG=FOO', assert => {
  assert.plan(2)

  process.env.DEBUG = 'FOO'

  const func = debug('foo', (_, set, pid, message) => {
    assert.equal(set, 'FOO')
    assert.equal(message, 'bar')
  })

  func('bar')
})

tap.test('NODE_DEBUG=FOO', assert => {
  assert.plan(2)

  process.env.NODE_DEBUG = 'FOO'

  const func = debug('foo', (_, set, pid, message) => {
    assert.equal(set, 'FOO')
    assert.equal(message, 'bar')
  })

  func('bar')
})

tap.test('DEBUG=BAR, FOO', assert => {
  assert.plan(2)

  process.env.DEBUG = 'BAR, FOO'

  const func = debug('foo', (_, set, pid, message) => {
    assert.equal(set, 'FOO')
    assert.equal(message, 'bar')
  })

  func('bar')
})

tap.test('DEBUG=BAZ, BAR', assert => {
  assert.plan(0)

  process.env.DEBUG = 'BAZ, BAR'

  const func = debug('foo', (_, set, pid, message) => {
    assert.error('should not trigger')
  })

  func('bar')
})

tap.test('DEBUG=F.*', assert => {
  assert.plan(2)

  process.env.DEBUG = 'F.*'

  const func = debug('foo', (_, set, pid, message) => {
    assert.equal(set, 'FOO')
    assert.equal(message, 'bar')
  })

  func('bar')
})
