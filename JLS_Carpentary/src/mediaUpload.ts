import { get, push, ref, set, type Database } from 'firebase/database'
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytesResumable, type FirebaseStorage } from 'firebase/storage'
import { firebaseErrorMessage, validateImage } from './firebaseErrors'

export async function uploadMedia(
  storage: FirebaseStorage,
  database: Database,
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  validateImage(file)

  // Check library access before creating a file that the administrator cannot index.
  try {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      await Promise.race([
        get(ref(database, 'mediaLibrary')),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Library connection timed out')), 15_000)
        }),
      ])
    } finally {
      clearTimeout(timer)
    }
  } catch (error) {
    console.error('Media library access failed before upload:', error)
    throw new Error(firebaseErrorMessage(error, 'access the image library'))
  }

  const entryRef = push(ref(database, 'mediaLibrary'))
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120) || 'image'
  const fileRef = storageRef(storage, `site-media/${entryRef.key}-${safeName}`)
  let url: string
  try {
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type })
    await new Promise<void>((resolve, reject) => {
      task.on('state_changed', (snapshot) => {
        onProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100))
      }, reject, resolve)
    })
    url = await getDownloadURL(fileRef)
  } catch (error) {
    console.error('Storage upload or download URL failed:', error)
    throw new Error(firebaseErrorMessage(error, 'upload this image'))
  }

  try {
    await set(entryRef, { name: file.name, url, createdAt: Date.now(), storagePath: fileRef.fullPath })
  } catch (error) {
    console.error('Media library metadata save failed:', error)
    // Only remove the newly uploaded file, never an existing library image.
    try {
      await deleteObject(fileRef)
    } catch (cleanupError) {
      console.error('Unable to clean up an unindexed upload:', cleanupError)
    }
    throw new Error(`The image could not be added to the library. ${firebaseErrorMessage(error, 'save the image details')}`)
  }
  return url
}
