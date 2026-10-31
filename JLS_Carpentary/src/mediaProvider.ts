export function mediaProvider(value: string | undefined): 'cloudinary' | 'firebase' {
  const provider = value?.trim().toLowerCase() || 'cloudinary'
  if (provider === 'cloudinary' || provider === 'firebase') return provider
  throw new Error('Invalid VITE_MEDIA_PROVIDER. Use cloudinary or firebase and redeploy.')
}
