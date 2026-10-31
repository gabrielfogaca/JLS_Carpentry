import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import handler from '../api/cloudinary-sign.ts'

test('upload function starts without CommonJS require-of-ESM support', () => {
  const result = spawnSync(process.execPath, [
    '--no-experimental-require-module', '--experimental-strip-types', '--input-type=module', '-e',
    `const { default: handler } = await import(${JSON.stringify(new URL('../api/cloudinary-sign.ts', import.meta.url).href)});
     const response = { setHeader() {}, status(code) { this.code = code; return this }, json() { if (this.code !== 405) throw new Error('Unexpected status') } };
     await handler({ method: 'GET', headers: {} }, response);`,
  ], { encoding: 'utf8', timeout: 15_000 })
  assert.equal(result.status, 0, result.stderr || String(result.error || 'Function failed to start'))
})

test('upload authorization rejects unsupported methods and missing sessions', async () => {
  const headers = {}
  const res = {
    code: 0, body: null,
    setHeader(key, value) { headers[key] = value },
    status(code) { this.code = code; return this },
    json(body) { this.body = body },
  }
  await handler({ method: 'GET', headers: {} }, res)
  assert.equal(res.code, 405)
  assert.equal(headers.Allow, 'POST')
  assert.equal(headers['Cache-Control'], 'no-store')
  const keys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']
  const saved = keys.map((key) => process.env[key])
  try {
    for (const key of keys) process.env[key] = 'test-only'
    await handler({ method: 'POST', headers: {} }, res)
    assert.equal(res.code, 401)
    assert.deepEqual(res.body, { error: 'Please sign in again.' })
    delete process.env.CLOUDINARY_API_SECRET
    await handler({ method: 'POST', headers: {} }, res)
    assert.equal(res.code, 503)
    assert.equal(JSON.stringify(res.body).includes('test-only'), false)
  } finally {
    keys.forEach((key, index) => { if (saved[index] === undefined) delete process.env[key]; else process.env[key] = saved[index] })
  }
})
