import { useEffect, useMemo, useState } from 'react'
import { Menu, X, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { onIdTokenChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import Dashboard from './Dashboard'
import { auth, firebaseReady, realtimeDatabase, storage } from './firebase'
import { DEFAULT_SITE_CONTENT, mergeSiteContent, type MediaAsset, type SiteContent } from './siteContent'
import { firebaseErrorMessage } from './firebaseErrors'
import { uploadMedia } from './mediaUpload'
import { uploadCloudinaryMedia } from './cloudinaryUpload'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'about', label: 'About' },
]

const GOOGLE_REVIEW_URL = 'https://g.page/r/CZg4bkaO6lytEBM/review'
const ADMIN_PATH = '/admin'
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || ADMIN_PATH

type GooglePlaceReview = {
  name: string
  role: string
  text: string
  rating: number
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          PlacesService: new (attrContainer: Element) => {
            textSearch: (
              request: { query: string },
              callback: (results: Array<{ place_id?: string }> | null, status: string) => void,
            ) => void
            getDetails: (
              request: { placeId: string; fields: string[] },
              callback: (place: { reviews?: Array<{ author_name?: string; relative_time_description?: string; text?: string; rating?: number }> } | null, status: string) => void,
            ) => void
          }
          PlacesServiceStatus: {
            OK: string
          }
        }
      }
    }
  }
}

let googleMapsScriptLoader: Promise<void> | null = null

function loadGoogleMapsScript(apiKey: string) {
  if (window.google?.maps?.places) {
    return Promise.resolve()
  }

  if (googleMapsScriptLoader) {
    return googleMapsScriptLoader
  }

  googleMapsScriptLoader = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[data-google-maps="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps script.'))
    document.head.appendChild(script)
  })

  return googleMapsScriptLoader
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function resolveAssetPath(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  try {
    return `${import.meta.env.BASE_URL}${encodeURI(decodeURI(normalizedPath))}`
  } catch {
    return `${import.meta.env.BASE_URL}${encodeURI(normalizedPath)}`
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('All')
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null)
  const [activeProjectImageIndex, setActiveProjectImageIndex] = useState(0)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authStatus, setAuthStatus] = useState<'loading' | 'ready'>(() => (auth ? 'loading' : 'ready'))
  const [adminStatus, setAdminStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    return DEFAULT_SITE_CONTENT
  })
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [mediaStatus, setMediaStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [mediaError, setMediaError] = useState('')
  const [libraryRetry, setLibraryRetry] = useState(0)
  const [contentStatus, setContentStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [contentError, setContentError] = useState('')
  const [googleReviews, setGoogleReviews] = useState<GooglePlaceReview[]>([])
  const [googleReviewsStatus, setGoogleReviewsStatus] = useState<'loading' | 'ready' | 'missing-config' | 'error'>('loading')

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setAuthStatus('ready')
      return
    }

    let revision = 0
    let activeUid: string | null = null
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const tokenRevision = ++revision
      setCurrentUser(user)
      // Refreshing a token must not unmount the editor and discard its draft.
      if (!user || activeUid !== user.uid) setAdminStatus('checking')
      activeUid = user?.uid ?? null
      try {
        const token = user ? await user.getIdTokenResult() : null
        if (revision !== tokenRevision) return
        setAdminStatus(token?.claims.admin === true ? 'allowed' : 'denied')
      } catch (error) {
        console.error('Unable to verify administrator access:', error)
        if (revision !== tokenRevision) return
        setAdminStatus('error')
      }
      setAuthStatus('ready')
    })

    return () => { revision++; unsubscribe() }
  }, [])

  useEffect(() => {
    if (!realtimeDatabase) {
      setContentStatus('error')
      setContentError('Website content is not connected. Contact the project owner.')
      return
    }

    const contentRef = ref(realtimeDatabase, 'siteContent/main')

    const unsubscribe = onValue(
      contentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteContent = snapshot.val() as Partial<SiteContent>
          setSiteContent(mergeSiteContent(remoteContent))
        } else {
          setSiteContent(DEFAULT_SITE_CONTENT)
        }
        setContentStatus('ready')
        setContentError('')
      },
      (error) => {
        console.error('Website content subscription failed:', error)
        setContentStatus('error')
        setContentError(firebaseErrorMessage(error, 'load website content'))
      },
    )

    return unsubscribe
  }, [currentUser?.uid, libraryRetry])

  useEffect(() => {
    if (!realtimeDatabase || !currentUser || adminStatus !== 'allowed' || currentPath !== ADMIN_PATH) {
      setMediaAssets([])
      return
    }

    setMediaStatus('loading')
    setMediaError('')
    const mediaRef = ref(realtimeDatabase, 'mediaLibrary')

    const unsubscribe = onValue(mediaRef, (snapshot) => {
      setMediaStatus('ready')
      if (!snapshot.exists()) {
        setMediaAssets([])
        return
      }

      const value = snapshot.val() as Record<string, Omit<MediaAsset, 'id'>>
      const assets = Object.entries(value)
        .map(([id, asset]) => ({ id, ...asset }))
        .sort((a, b) => b.createdAt - a.createdAt)

      setMediaAssets(assets)
    }, (error) => {
      console.error('Media library subscription failed:', error)
      setMediaAssets([])
      setMediaStatus('error')
      setMediaError(firebaseErrorMessage(error, 'load the image library'))
    })

    return unsubscribe
  }, [currentUser?.uid, adminStatus, currentPath, libraryRetry])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID
    const businessQuery = import.meta.env.VITE_GOOGLE_BUSINESS_QUERY
    const fallbackBusinessQuery = import.meta.env.VITE_GOOGLE_BUSINESS_QUERY_FALLBACK
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    const searchQueries = [businessQuery, fallbackBusinessQuery].filter((query): query is string => Boolean(query?.trim()))

    if (!apiKey || (!placeId && searchQueries.length === 0)) {
      setGoogleReviewsStatus('missing-config')
      return
    }

    let isCancelled = false

    const fetchGoogleReviews = async () => {
      try {
        setGoogleReviewsStatus('loading')
        await loadGoogleMapsScript(apiKey)

        if (!window.google?.maps?.places) {
          throw new Error('Google Places library unavailable.')
        }

        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))

        const resolvePlaceId = () =>
          new Promise<string>((resolve, reject) => {
            if (placeId) {
              resolve(placeId)
              return
            }

            if (searchQueries.length === 0) {
              reject(new Error('Missing Place ID and business queries.'))
              return
            }

            const trySearchQuery = (index: number) => {
              const query = searchQueries[index]

              if (!query) {
                reject(new Error('Could not resolve Place ID from business queries.'))
                return
              }

              placesService.textSearch(
                { query },
                (results, status) => {
                  const foundPlaceId = results?.[0]?.place_id

                  if (status === window.google?.maps?.places?.PlacesServiceStatus.OK && foundPlaceId) {
                    resolve(foundPlaceId)
                    return
                  }

                  trySearchQuery(index + 1)
                },
              )
            }

            trySearchQuery(0)
          })

        const resolvedPlaceId = await resolvePlaceId()

        placesService.getDetails(
          {
            placeId: resolvedPlaceId,
            fields: ['reviews'],
          },
          (place, status) => {
            if (isCancelled) {
              return
            }

            if (status !== window.google?.maps?.places?.PlacesServiceStatus.OK || !place?.reviews?.length) {
              setGoogleReviews([])
              setGoogleReviewsStatus('error')
              return
            }

            const reviews = place.reviews
              .map((review) => {
                const text = review.text?.trim()

                if (!text) {
                  return null
                }

                return {
                  name: review.author_name?.trim() || 'Google User',
                  role: review.relative_time_description?.trim() || 'Google Review',
                  text,
                  rating: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
                }
              })
              .filter((review): review is GooglePlaceReview => review !== null)

            setGoogleReviews(reviews)
            setGoogleReviewsStatus(reviews.length > 0 ? 'ready' : 'error')
          },
        )
      } catch {
        if (!isCancelled) {
          setGoogleReviews([])
          setGoogleReviewsStatus('error')
        }
      }
    }

    void fetchGoogleReviews()

    return () => {
      isCancelled = true
    }
  }, [])

  const navigateTo = (path: string, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', path)
    } else {
      window.history.pushState({}, '', path)
    }

    setCurrentPath(path)
  }

  const handleLogin = async (email: string, password: string) => {
    if (!auth) {
      setLoginError('Firebase Authentication is not configured.')
      return
    }

    setLoginError('')
    setIsLoggingIn(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigateTo(ADMIN_PATH, true)
    } catch (error) {
      const code = (error as { code?: string }).code
      setLoginError(code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password'
        ? 'Invalid credentials. Please verify your email and password.'
        : firebaseErrorMessage(error, 'sign in'))
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
    }

    navigateTo('/', true)
  }

  const handleSaveContent = async (content: SiteContent) => {
    if (!realtimeDatabase) {
      throw new Error('Realtime Database is not configured.')
    }

    if (!auth?.currentUser || (await auth.currentUser.getIdTokenResult()).claims.admin !== true) {
      throw new Error('Administrator access is required to save changes.')
    }
    if (contentStatus !== 'ready') {
      throw new Error('Wait until website content is loaded before saving. Your draft has been kept.')
    }
    try {
      await set(ref(realtimeDatabase, 'siteContent/main'), content)
    } catch (error) {
      console.error('Website content save failed:', error)
      throw new Error(firebaseErrorMessage(error, 'save website content'))
    }

    setSiteContent(content)
  }

  const handleUploadMedia = async (file: File, onProgress: (percent: number) => void) => {
    if (!realtimeDatabase) {
      throw new Error('Realtime Database is not configured.')
    }

    if (!auth?.currentUser || (await auth.currentUser.getIdTokenResult()).claims.admin !== true) {
      throw new Error('Administrator access is required to upload images.')
    }
    if (import.meta.env.VITE_MEDIA_PROVIDER === 'cloudinary') {
      return uploadCloudinaryMedia(auth.currentUser, realtimeDatabase, file, onProgress)
    }
    if (!storage) throw new Error('Firebase Storage is not configured.')
    return uploadMedia(storage, realtimeDatabase, file, onProgress)
  }

  const isLoginRoute = currentPath === '/login'
  const isAdminRoute = currentPath === ADMIN_PATH

  useEffect(() => {
    if (isLoginRoute && currentUser) {
      navigateTo(ADMIN_PATH, true)
    }
  }, [isLoginRoute, currentUser])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const visiblePortfolioItems = siteContent.portfolio.items.filter((item) => item.isVisible !== false)
  const portfolioTypes = ['All', ...Array.from(new Set(visiblePortfolioItems.map((item) => item.type)))]
  const activeFilter = portfolioTypes.includes(portfolioFilter) ? portfolioFilter : 'All'
  const filteredPortfolio =
    activeFilter === 'All'
      ? visiblePortfolioItems
      : visiblePortfolioItems.filter((item) => item.type === activeFilter)

  const activeProject = activeProjectIndex === null ? null : filteredPortfolio[activeProjectIndex]
  const activeProjectImages = useMemo(() => {
    if (!activeProject) {
      return []
    }

    return activeProject.images && activeProject.images.length > 0 ? activeProject.images : [activeProject.image]
  }, [activeProject])

  const activeProjectImageSrc = activeProject
    ? activeProjectImages[activeProjectImageIndex] ?? activeProject.image
    : ''

  const scrollingReviews = [...googleReviews, ...googleReviews]
  const instagramUrl = `https://instagram.com/${siteContent.instagram.handle}`

  const closeProjectGallery = () => {
    setActiveProjectIndex(null)
    setActiveProjectImageIndex(0)
  }

  const openProjectGallery = (projectIndex: number) => {
    setActiveProjectIndex(projectIndex)
    setActiveProjectImageIndex(0)
  }

  const goToNextProjectImage = () => {
    if (activeProjectImages.length <= 1) {
      return
    }

    setActiveProjectImageIndex((current) => (current + 1) % activeProjectImages.length)
  }

  const goToPreviousProjectImage = () => {
    if (activeProjectImages.length <= 1) {
      return
    }

    setActiveProjectImageIndex((current) => (current - 1 + activeProjectImages.length) % activeProjectImages.length)
  }

  useEffect(() => {
    if (!activeProject || isAdminRoute || isLoginRoute) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProjectGallery()
      }

      if (event.key === 'ArrowRight') {
        goToNextProjectImage()
      }

      if (event.key === 'ArrowLeft') {
        goToPreviousProjectImage()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeProject, activeProjectImages.length, isAdminRoute, isLoginRoute])

  if (isAdminRoute) {
    if (authStatus === 'loading' || (currentUser && adminStatus === 'checking')) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
          <p className="text-sm text-slate-300">Loading authentication...</p>
        </div>
      )
    }

    if (!currentUser) {
      return (
        <LoginScreen
          isFirebaseReady={firebaseReady}
          isSubmitting={isLoggingIn}
          errorMessage={loginError}
          onSubmit={handleLogin}
          onBackToSite={() => navigateTo('/', true)}
        />
      )
    }

    if (adminStatus !== 'allowed') {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-semibold">{adminStatus === 'error' ? 'Unable to verify access' : 'Administrator access required'}</h1>
            <p className="text-slate-300">{adminStatus === 'error' ? 'Check your connection and try again.' : 'This account does not have permission to edit the website. Contact the project owner.'}</p>
            <button className="rounded bg-teal-700 px-4 py-2" onClick={() => { void auth?.currentUser?.getIdToken(true).catch(() => setAdminStatus('error')) }}>Check access again</button>
            <button className="block underline" onClick={() => { void handleLogout() }}>Sign out</button>
            <button className="block underline" onClick={() => navigateTo('/', true)}>Back to site</button>
          </div>
        </div>
      )
    }

    return (
      <Dashboard
        isDarkMode
        onLogout={handleLogout}
        onBackToSite={() => navigateTo('/', true)}
        siteContent={siteContent}
        onSaveContent={handleSaveContent}
        mediaAssets={mediaAssets}
        onUploadMedia={handleUploadMedia}
        mediaStatus={mediaStatus}
        mediaError={mediaError}
        contentStatus={contentStatus}
        contentError={contentError}
        onRetry={() => setLibraryRetry((value) => value + 1)}
      />
    )
  }

  if (isLoginRoute) {
    return (
      <LoginScreen
        isFirebaseReady={firebaseReady}
        isSubmitting={isLoggingIn}
        errorMessage={loginError}
        onSubmit={handleLogin}
        onBackToSite={() => navigateTo('/', true)}
      />
    )
  }


  return (
    <div className="w-full min-h-screen text-white transition-colors duration-300">
      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-black/95 backdrop-blur border-gray-800 shadow-lg'
            : 'bg-black border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => scrollToSection('home')}
              className="inline-flex items-center"
              aria-label="Go to home section"
            >
              <img
                src={resolveAssetPath('/images/Emblema de Carpintaria JLS.png')}
                alt="JLS Carpentry logo"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
              <button onClick={() => scrollToSection('contact')} className="bg-amber-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-amber-700 transition-colors">Get Quote</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 pb-6 pt-2 space-y-1 bg-black">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left py-3 px-2 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-3 px-2 text-amber-500 text-sm font-medium transition-colors">Get Quote</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-slide-in-left" style={{ animationFillMode: 'both' }}>
            <img 
              src={resolveAssetPath(siteContent.home.heroImage)} 
              alt="JLS Carpentry at work" 
              className="w-full h-96 md:h-[450px] object-cover rounded-lg shadow-xl hero-image-float"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div>
              {siteContent.home.eyebrow && (
                <p
                  className="text-amber-600 text-xs font-medium uppercase tracking-[0.2em] mb-4 animate-fade-in-down"
                  style={{ animationDelay: '120ms', animationFillMode: 'both' }}
                >
                  {siteContent.home.eyebrow}
                </p>
              )}
              <h1
                className="text-5xl md:text-6xl font-display font-semibold leading-tight mb-4 text-white animate-fade-in-up"
                style={{ animationDelay: '220ms', animationFillMode: 'both' }}
              >
                {siteContent.home.title} <span className="text-amber-600">{siteContent.home.highlight}</span>
              </h1>
              <p
                className="text-lg text-gray-300 leading-relaxed animate-fade-in-up"
                style={{ animationDelay: '340ms', animationFillMode: 'both' }}
              >
                {siteContent.home.description}
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-in-up"
              style={{ animationDelay: '460ms', animationFillMode: 'both' }}
            >
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-amber-600 text-white font-medium py-3 px-8 hover:bg-amber-700 transition-colors rounded-lg animate-pulse-glow"
              >
                {siteContent.home.primaryCtaLabel}
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')} 
                className="border border-gray-500 text-white font-medium py-3 px-8 hover:border-gray-300 transition-colors rounded-lg"
              >
                {siteContent.home.secondaryCtaLabel}
              </button>
            </div>
            <div
              className="grid grid-cols-3 gap-8 pt-8 animate-fade-in-up"
              style={{ animationDelay: '580ms', animationFillMode: 'both' }}
            >
              {siteContent.home.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-light text-white">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-display font-semibold mb-3 text-gray-900">{siteContent.services.title}</h2>
            <p className="text-gray-600">{siteContent.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.services.items.map((service, i) => (
              <div key={i} className="border border-gray-200 p-8 rounded-lg bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl font-light text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-amber-600 mt-0.5">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-display font-semibold mb-3 text-white">{siteContent.portfolio.title}</h2>
            <p className="text-gray-300">{siteContent.portfolio.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects">
            {portfolioTypes.map((type) => (
              <button
                key={type}
                onClick={() => setPortfolioFilter(type)}
                aria-pressed={activeFilter === type}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  activeFilter === type
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-amber-600 hover:text-amber-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredPortfolio.map((project, projectIndex) => (
              <button
                key={project.title}
                onClick={() => openProjectGallery(projectIndex)}
                className="group border border-gray-800 overflow-hidden rounded-lg hover:shadow-lg transition-shadow text-left"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={resolveAssetPath(project.image)} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 text-xs font-medium rounded">
                    {project.type}
                  </div>
                </div>
                <div className="p-4 bg-black/60">
                  <h3 className="text-lg font-light text-white mb-1">{project.title}</h3>
                  {project.description && <p className="text-gray-300 text-sm mt-2">{project.description}</p>}
                  <p className="text-amber-500 text-xs mt-3">View gallery</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div>
              <p className="text-amber-600 text-xs font-medium uppercase tracking-[0.2em] mb-2">Google Reviews</p>
              <h3 className="text-3xl font-display font-semibold text-gray-900">What Clients Say After Project Completion</h3>
            </div>
          </div>

          {googleReviewsStatus === 'ready' && googleReviews.length > 0 ? (
            <div className="reviews-marquee" aria-label="Client reviews">
              <div className="reviews-marquee-track">
                {scrollingReviews.map((review, index) => (
                  <article key={`${review.name}-${index}`} className="reviews-card">
                    <p className="text-amber-500 text-sm mb-3" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.text}</p>
                    <p className="text-gray-900 text-sm font-medium">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : googleReviewsStatus === 'loading' ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm text-gray-600">Loading Google reviews...</p>
            </div>
          ) : googleReviewsStatus === 'missing-config' ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm text-gray-600">Google reviews are unavailable right now. Please check back soon.</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm text-gray-600">Google reviews are unavailable right now. Please check back soon.</p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center border border-amber-600 text-amber-700 font-medium py-2.5 px-6 text-sm hover:bg-amber-600 hover:text-white transition-colors rounded-lg"
            >
              Leave a Google Review
            </a>
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="fixed inset-0 z-[60] bg-black/90 p-4 md:p-8" role="dialog" aria-modal="true" aria-label={activeProject.title}>
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-amber-500 text-xs uppercase tracking-[0.2em] mb-2">{activeProject.type}</p>
                <h3 className="text-2xl md:text-3xl font-display text-white">{activeProject.title}</h3>
              </div>
              <button onClick={closeProjectGallery} className="p-2 rounded border border-gray-700 text-gray-200 hover:text-white hover:border-white transition-colors" aria-label="Close gallery">
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-gray-800 bg-black">
              <img
                src={resolveAssetPath(activeProjectImageSrc)}
                alt={`${activeProject.title} image ${activeProjectImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {activeProjectImages.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousProjectImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-gray-700 text-white hover:border-amber-500 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextProjectImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-gray-700 text-white hover:border-amber-500 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {activeProjectImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-2">
                {activeProjectImages.map((image, imageIndex) => (
                  <button
                    key={image}
                    onClick={() => setActiveProjectImageIndex(imageIndex)}
                    className={`h-16 rounded overflow-hidden border ${
                      imageIndex === activeProjectImageIndex ? 'border-amber-500' : 'border-gray-700'
                    }`}
                    aria-label={`Open image ${imageIndex + 1}`}
                  >
                    <img src={resolveAssetPath(image)} alt="Project thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instagram Section */}
      <section id="instagram" className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-display font-semibold mb-3 text-white">{siteContent.instagram.title}</h2>
            <p className="text-gray-300">{siteContent.instagram.subtitle}</p>
          </div>

          <div className="text-left">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 text-sm transition-colors rounded-lg"
            >
              <InstagramIcon size={18} />
              <span>{siteContent.instagram.buttonLabel}</span>
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src={resolveAssetPath(siteContent.about.image)} alt="JLS Carpentry founder" className="w-full h-96 md:h-[450px] object-cover rounded-lg grayscale" />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-display font-semibold mb-4 text-gray-900">{siteContent.about.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{siteContent.about.paragraphOne}</p>
              <p className="text-gray-600 leading-relaxed">{siteContent.about.paragraphTwo}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-light text-gray-900">{siteContent.about.highlightsTitle}</h3>
              {siteContent.about.highlights.map((item, i) => (
                <div key={i}>
                  <p className="text-gray-900 text-sm font-light">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-display font-semibold mb-3 text-white">{siteContent.contact.title}</h2>
            <p className="text-gray-300">{siteContent.contact.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light mb-3 text-white">{siteContent.contact.quoteTitle}</h3>
                <p className="text-gray-300 text-sm">
                  {siteContent.contact.quoteDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${encodeURIComponent(siteContent.contact.whatsappNumber)}?text=${encodeURIComponent(siteContent.contact.whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-amber-600 text-white font-medium py-3 text-sm hover:bg-amber-700 transition-colors text-center rounded-lg"
                >
                  {siteContent.contact.whatsappButtonLabel}
                </a>
                <a
                  href={`sms:${siteContent.contact.smsNumber}`}
                  className="w-full border border-gray-500 text-white font-medium py-3 text-sm hover:border-gray-300 transition-colors text-center rounded-lg"
                >
                  {siteContent.contact.smsButtonLabel}
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {siteContent.contact.cards.map((contact, i) => (
                <div key={i} className="border border-gray-800 p-4 rounded-lg bg-black/60 backdrop-blur-sm">
                  <p className="text-gray-400 text-xs mb-1">{contact.label}</p>
                  <p className="text-white text-sm">{contact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="text-white mb-3 font-light">{siteContent.footer.brandTitle}</h4>
              <p className="text-gray-400 text-xs">{siteContent.footer.brandDescription}</p>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Services</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                {siteContent.footer.services.map((service) => (
                  <li key={service}><button onClick={() => scrollToSection('services')} className="hover:text-white transition">{service}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Company</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                {siteContent.footer.company.map((item) => (
                  <li key={item}><button onClick={() => scrollToSection(item.toLowerCase() === 'about' ? 'about' : 'portfolio')} className="hover:text-white transition">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Contact</h4>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li>{siteContent.footer.contactPhone}</li>
                <li>{siteContent.footer.contactEmail}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Follow</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">{siteContent.footer.followLabel}</a></li>
              </ul>
              <a
                href={LOGIN_URL}
                className="inline-flex items-center mt-4 border border-amber-600 text-amber-500 text-xs font-medium py-2 px-4 rounded hover:bg-amber-600 hover:text-white transition-colors"
              >
                Login
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} {siteContent.footer.copyrightName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => scrollToSection('home')}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  )
}

type LoginScreenProps = {
  isFirebaseReady: boolean
  isSubmitting: boolean
  errorMessage: string
  onSubmit: (email: string, password: string) => Promise<void>
  onBackToSite: () => void
}

function LoginScreen({ isFirebaseReady, isSubmitting, errorMessage, onSubmit, onBackToSite }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(email.trim(), password)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md border border-slate-800 bg-black/50 rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-amber-500 text-xs uppercase tracking-[0.2em] mb-2">Admin access</p>
          <h1 className="text-3xl font-display font-semibold">Login</h1>
          <p className="text-sm text-slate-300 mt-2">Use your Firebase account to access the content dashboard.</p>
        </div>

        {!isFirebaseReady && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            Firebase is not fully configured in environment variables.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{errorMessage}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </label>

          <button
            type="submit"
            disabled={!isFirebaseReady || isSubmitting}
            className="w-full bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={onBackToSite}
          className="mt-4 w-full border border-slate-700 text-slate-200 text-sm font-medium py-2.5 rounded-lg hover:border-slate-500 transition-colors"
        >
          Back to site
        </button>
      </div>
    </div>
  )
}
