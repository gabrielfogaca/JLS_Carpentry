import { createHash, randomUUID } from 'node:crypto'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

type Request = { method?: string; headers: { authorization?: string } }
type Response = { setHeader(name: string, value: string): void; status(code: number): Response; json(body: unknown): void }

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret,
    FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY: privateKey } = process.env
  if (!cloudName || !apiKey || !secret || !projectId || !clientEmail || !privateKey) {
    return res.status(503).json({ error: 'Image uploads are not configured on the server.' })
  }
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return res.status(401).json({ error: 'Please sign in again.' })
  try {
    const app = getApps().find((app) => app.name === 'upload-admin') || initializeApp({
      credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') }),
    }, 'upload-admin')
    const user = await getAuth(app).verifyIdToken(token, true)
    if (user.admin !== true) return res.status(403).json({ error: 'Administrator access is required.' })
  } catch {
    return res.status(401).json({ error: 'Unable to verify your session. Please sign in again.' })
  }
  const params = {
    allowed_formats: 'jpg,jpeg,png,webp,gif,avif',
    overwrite: 'false',
    public_id: `jls-carpentry/${randomUUID()}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
  }
  const value = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('&')
  const signature = createHash('sha1').update(value + secret).digest('hex')
  return res.status(200).json({ cloudName, apiKey, params, signature })
}
