import type { User } from 'firebase/auth'
import { get, push, ref, set, type Database } from 'firebase/database'
import { firebaseErrorMessage, validateImage } from './firebaseErrors'

export async function uploadCloudinaryMedia(user: User, database: Database, file: File, onProgress: (percent: number) => void): Promise<string> {
  validateImage(file)
  try {
    await get(ref(database, 'mediaLibrary'))
  } catch (error) {
    throw new Error(firebaseErrorMessage(error, 'access the image library'))
  }
  const authorization = await user.getIdToken()
  const response = await fetch('/api/cloudinary-sign', { method: 'POST', headers: { Authorization: `Bearer ${authorization}` } })
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Upload service unavailable. Use the Vercel deployment or vercel dev locally.')
  }
  const signed = await response.json()
  if (!response.ok) throw new Error(signed.error || 'Unable to authorize image upload.')
  const body = new FormData()
  body.append('file', file)
  body.append('api_key', signed.apiKey)
  body.append('signature', signed.signature)
  for (const [key, value] of Object.entries(signed.params)) body.append(key, String(value))
  const url = await new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`)
    xhr.timeout = 120_000
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)) }
    xhr.onerror = () => reject(new Error('Image upload failed. Check your connection and retry.'))
    xhr.ontimeout = () => reject(new Error('Image upload timed out. Please retry.'))
    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText)
        if (xhr.status < 200 || xhr.status >= 300 || !result.secure_url) throw new Error(result.error?.message || 'Image upload failed.')
        resolve(result.secure_url)
      } catch (error) { reject(error) }
    }
    xhr.send(body)
  })
  try {
    await set(push(ref(database, 'mediaLibrary')), { name: file.name, url, createdAt: Date.now() })
  } catch (error) {
    throw new Error(`Image uploaded, but its library entry could not be saved. Remove the unused image in Cloudinary if necessary. ${firebaseErrorMessage(error, 'save the image details')}`)
  }
  return url
}
