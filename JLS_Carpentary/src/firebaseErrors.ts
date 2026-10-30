export function firebaseErrorMessage(error: unknown, action: string): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : ''
  const messages: Record<string, string> = {
    'storage/unauthorized': 'Your account cannot upload images. Ask the project owner to check your administrator access.',
    'storage/unauthenticated': 'Your session has expired. Sign in again.',
    'storage/bucket-not-found': 'Image storage is not available. Ask the project owner to check its configuration.',
    'storage/project-not-found': 'Image storage is not available. Ask the project owner to check its configuration.',
    'storage/quota-exceeded': 'Image storage has reached its limit. Contact the project owner.',
    'storage/retry-limit-exceeded': 'The upload timed out. Check your connection and try again.',
    'storage/canceled': 'The upload was cancelled. Please try again.',
    'storage/invalid-checksum': 'The image could not be transferred correctly. Please try again.',
    'PERMISSION_DENIED': 'Your account does not have permission to save these changes.',
    'permission-denied': 'Your account does not have permission to save these changes.',
    'auth/network-request-failed': 'Unable to connect. Check your internet connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait before trying again.',
    'auth/user-disabled': 'This account has been disabled. Contact the project owner.',
  }
  return messages[code] ?? `Unable to ${action}. Please try again. If the problem continues, contact the project owner.`
}

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export function validateImage(file: Pick<File, 'type' | 'size'>): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Choose a JPG, PNG, WebP, GIF or AVIF image.')
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error('Choose an image between 1 byte and 10 MB.')
  }
}
