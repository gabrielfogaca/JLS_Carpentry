import test from 'node:test'
import assert from 'node:assert/strict'
import { withTimeout } from '../src/withTimeout.ts'

test('returns successful results and preserves operation errors', async () => {
  assert.equal(await withTimeout(Promise.resolve('ready'), 100, 'timeout'), 'ready')
  await assert.rejects(withTimeout(Promise.reject(new Error('permission denied')), 100, 'timeout'), /permission denied/)
})

test('a stalled preparation step reports a timeout instead of waiting indefinitely', async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 10, 'Library did not respond'), /Library did not respond/)
})
