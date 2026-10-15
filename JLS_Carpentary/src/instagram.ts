export interface InstagramPost {
  id: string
  image: string
  likes: number
  comments: number
  caption: string
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN
  const businessAccountId = import.meta.env.VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !businessAccountId) {
    console.warn('Instagram API credentials not configured')
    return []
  }

  try {
    // Fetch media from Instagram Business Account
    const mediaUrl = `https://graph.instagram.com/${businessAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,like_count,comments_count&limit=9&access_token=${accessToken}`
    
    const response = await fetch(mediaUrl)
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data) {
      return []
    }

    // Transform Instagram API response to our format
    const posts: InstagramPost[] = data.data
      .filter((post: any) => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL')
      .map((post: any) => ({
        id: post.id,
        image: post.media_type === 'IMAGE' ? post.media_url : post.media_url,
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        caption: post.caption || '',
      }))
      .slice(0, 9) // Limit to 9 posts

    return posts
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return []
  }
}
