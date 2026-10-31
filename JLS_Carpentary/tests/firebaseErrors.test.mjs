import assert from 'node:assert/strict'
import { test } from 'node:test'
import { firebaseErrorMessage, MAX_IMAGE_BYTES, validateImage } from '../src/firebaseErrors.ts'

test('rejects unsupported and empty images before any network request', () => {
  for (const file of [{ type: 'image/svg+xml', size: 100 }, { type: 'text/plain', size: 100 }, { type: 'image/png', size: 0 }]) {
    assert.throws(() => validateImage(file))
  }
})

test('accepts the image size boundary and rejects an oversized upload', () => {
  assert.doesNotThrow(() => validateImage({ type: 'image/jpeg', size: MAX_IMAGE_BYTES }))
  assert.throws(() => validateImage({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }), /10 MB/)
})

test('distinguishes storage, authentication and database failures without exposing backend details', () => {
  assert.match(firebaseErrorMessage({ code: 'storage/unauthorized' }, 'upload'), /administrator access/)
  assert.match(firebaseErrorMessage({ code: 'PERMISSION_DENIED' }, 'save'), /permission to save/)
  assert.match(firebaseErrorMessage({ code: 'auth/network-request-failed' }, 'sign in'), /connection/)
  assert.doesNotMatch(firebaseErrorMessage(new Error('private backend details'), 'upload'), /private backend/)
})

test('recognizes plain Realtime Database permission errors during library preflight', () => {
  for (const error of [new Error('Permission denied'), { code: 'PERMISSION_DENIED' }, { code: 'database/permission-denied' }]) {
    assert.match(firebaseErrorMessage(error, 'access the image library'), /Realtime Database mediaLibrary rules/)
  }
})
