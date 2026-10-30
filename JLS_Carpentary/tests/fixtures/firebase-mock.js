// Browser-only test double. No requests or writes reach the real Firebase project.
const state = window.__firebaseMock ||= {
  authListeners: [], listeners: new Map(), media: {}, uploads: [], deleted: [],
  content: JSON.parse(localStorage.getItem('test-content') || 'null'),
}

function userFor(email) {
  return {
    uid: email,
    async getIdTokenResult() { return { claims: { admin: email === 'admin@example.com' } } },
    async getIdToken() { state.authListeners.forEach((callback) => callback(this)); return 'test-token' },
  }
}

state.auth ||= { currentUser: localStorage.getItem('test-user') ? userFor(localStorage.getItem('test-user')) : null }
export const auth = state.auth
export const realtimeDatabase = {}
export const storage = {}
export const firebaseReady = true

export function onIdTokenChanged(auth, callback) {
  state.authListeners.push(callback)
  queueMicrotask(() => callback(auth.currentUser))
  return () => { state.authListeners = state.authListeners.filter((item) => item !== callback) }
}
export async function signInWithEmailAndPassword(auth, email) {
  auth.currentUser = userFor(email)
  localStorage.setItem('test-user', email)
  state.authListeners.forEach((callback) => callback(auth.currentUser))
}
export async function signOut(auth) {
  auth.currentUser = null
  localStorage.removeItem('test-user')
  state.authListeners.forEach((callback) => callback(null))
}

export function ref(_service, path) { return { path, fullPath: path } }
function snapshot(value) { return { exists: () => value !== null, val: () => structuredClone(value) } }
function emit(path, value) { state.listeners.get(path)?.forEach((callback) => callback(snapshot(value))) }
state.emitContent = (value) => { state.content = value; emit('siteContent/main', value) }
export function onValue(reference, callback, onError) {
  const path = reference.path
  if (!state.listeners.has(path)) state.listeners.set(path, new Set())
  state.listeners.get(path).add(callback)
  queueMicrotask(() => {
    if ((path === 'mediaLibrary' && state.libraryError) || (path === 'siteContent/main' && state.contentError)) {
      onError?.({ code: 'PERMISSION_DENIED' })
    } else callback(snapshot(path === 'mediaLibrary' ? state.media : state.content))
  })
  return () => state.listeners.get(path).delete(callback)
}
export async function get() {
  if (state.libraryError) throw { code: 'PERMISSION_DENIED' }
  return snapshot(state.media)
}
export function push() { return { path: `mediaLibrary/image-${state.uploads.length + 1}`, key: `image-${state.uploads.length + 1}` } }
export async function set(reference, value) {
  if (state.writeDelay) await new Promise((resolve) => setTimeout(resolve, state.writeDelay))
  if (state.saveError && reference.path === 'siteContent/main') throw { code: 'PERMISSION_DENIED' }
  if (state.metadataError && reference.path.startsWith('mediaLibrary/')) throw { code: 'PERMISSION_DENIED' }
  if (reference.path === 'siteContent/main') {
    state.content = structuredClone(value)
    localStorage.setItem('test-content', JSON.stringify(value))
    emit(reference.path, value)
  } else {
    state.media[reference.path.split('/')[1]] = value
    emit('mediaLibrary', state.media)
  }
}

export function uploadBytesResumable(reference, file) {
  return { on(_event, progress, error, complete) {
    progress({ bytesTransferred: 0, totalBytes: file.size })
    setTimeout(() => {
      if (state.storageError) { error({ code: state.storageError }); return }
      state.uploads.push(reference.fullPath)
      progress({ bytesTransferred: file.size, totalBytes: file.size })
      complete()
    }, 50)
  } }
}
export async function getDownloadURL(reference) { return `http://127.0.0.1:8443/favicon.png?upload=${encodeURIComponent(reference.fullPath)}` }
export async function deleteObject(reference) { state.deleted.push(reference.fullPath) }
