import test from 'node:test'
import assert from 'node:assert/strict'
import { mediaProvider } from '../src/mediaProvider.ts'

test('Cloudinary is the default even when the build variable is absent or blank', () => {
  for (const value of [undefined, '', ' ', 'cloudinary', ' Cloudinary ']) {
    assert.equal(mediaProvider(value), 'cloudinary')
  }
})

test('Firebase Storage requires explicit selection and typos never select it', () => {
  assert.equal(mediaProvider('firebase'), 'firebase')
  assert.throws(() => mediaProvider('clodinary'), /Invalid VITE_MEDIA_PROVIDER/)
})
