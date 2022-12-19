const debuglog = require('..')
const { beforeEach, afterEach, test } = require('tap')
const sinon = require('sinon')

beforeEach(() => {
  sinon.stub(console, 'error')
});

afterEach(() => {
  delete process.env.DEBUG
  delete process.env.NODE_DEBUG

  console.error.restore()
})

test('DEBUG=FOO', assert => {
  assert.plan(2)

  process.env.DEBUG = 'FOO'

  const debug = debuglog('foo')

  debug('bar')

  assert.ok(console.error.called)
  assert.same(console.error.lastCall.args, ['%s %d: %s', 'FOO', process.pid, 'bar'])
})

test('NODE_DEBUG=FOO', assert => {
  assert.plan(2)

  process.env.NODE_DEBUG = 'FOO'

  const debug = debuglog('foo')

  debug('bar')

  assert.ok(console.error.called)
  assert.same(console.error.lastCall.args, ['%s %d: %s', 'FOO', process.pid, 'bar'])
})

test('DEBUG=BAR, FOO', assert => {
  assert.plan(2)

  process.env.DEBUG = 'BAR, FOO'

  const debug = debuglog('foo')

  debug('bar')

  assert.ok(console.error.called)
  assert.same(console.error.lastCall.args, ['%s %d: %s', 'FOO', process.pid, 'bar'])
})

test('DEBUG=BAZ, BAR', assert => {
  assert.plan(1)

  process.env.DEBUG = 'BAZ, BAR'

  const debug = debuglog('foo')

  debug('bar')

  assert.notOk(console.error.called, 'should not trigger')

  debug('bar')
})

test('DEBUG=F.*', assert => {
  assert.plan(2)

  process.env.DEBUG = 'F.*'

  const debug = debuglog('foo')

  debug('bar')

  assert.ok(console.error.called)
  assert.same(console.error.lastCall.args, ['%s %d: %s', 'FOO', process.pid, 'bar'])
})
