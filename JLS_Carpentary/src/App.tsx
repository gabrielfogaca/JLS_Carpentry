import { useEffect, useMemo, useState } from 'react'
import { Menu, X, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { DEFAULT_SITE_CONTENT, type SiteContent } from './siteContent'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'about', label: 'About' },
]

const INSTAGRAM_URL = 'https://instagram.com/jls_carpentry_co'
const GOOGLE_REVIEW_URL = 'https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_REVIEW_ID/review'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('All')
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null)
  const [activeProjectImageIndex, setActiveProjectImageIndex] = useState(0)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    return DEFAULT_SITE_CONTENT
  })

  useEffect(() => {
    if (!db) {
      return
    }

    const contentRef = doc(db, 'siteContent', 'main')

    const unsubscribe = onSnapshot(
      contentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteContent = snapshot.data() as Partial<SiteContent>
          setSiteContent({
            ...DEFAULT_SITE_CONTENT,
            ...remoteContent,
            portfolio: DEFAULT_SITE_CONTENT.portfolio,
          })
        } else {
          setSiteContent(DEFAULT_SITE_CONTENT)
        }
      },
      () => {
        setSiteContent(DEFAULT_SITE_CONTENT)
      },
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const portfolioTypes = ['All', ...Array.from(new Set(siteContent.portfolio.items.map((item) => item.type)))]
  const activeFilter = portfolioTypes.includes(portfolioFilter) ? portfolioFilter : 'All'
  const filteredPortfolio =
    activeFilter === 'All'
      ? siteContent.portfolio.items
      : siteContent.portfolio.items.filter((item) => item.type === activeFilter)

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

  const scrollingReviews = [...siteContent.testimonials.items, ...siteContent.testimonials.items]

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
    if (!activeProject) {
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
  }, [activeProject, activeProjectImages.length])

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
              src={resolveAssetPath('/homeimg.png')} 
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
                Get Your Free Quote
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')} 
                className="border border-gray-500 text-white font-medium py-3 px-8 hover:border-gray-300 transition-colors rounded-lg"
              >
                View Portfolio
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
            <h2 className="text-4xl font-display font-semibold mb-3 text-white">Follow @jls_carpentry_co</h2>
            <p className="text-gray-300">Witness the artistry of premium woodworking. From concept to completion, we document every detail of our bespoke carpentry projects.</p>
          </div>

          <div className="text-left">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 text-sm transition-colors rounded-lg"
            >
              <InstagramIcon size={18} />
              <span>Visit Our Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src={resolveAssetPath('/images/myself.png')} alt="JLS Carpentry founder" className="w-full h-96 md:h-[450px] object-cover rounded-lg grayscale" />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-display font-semibold mb-4 text-gray-900">About Me</h2>
              <p className="text-gray-600 leading-relaxed mb-4">I founded JLS Carpentry to help local families transform the way they live through high-quality renovations and extensions. With 10+ years of hands-on experience, I focus on practical design, precision workmanship, and finishes that stand the test of time.</p>
              <p className="text-gray-600 leading-relaxed">From first consultation to final handover, you can expect clear communication, reliable timelines, and a straightforward process built around your goals.</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-light text-gray-900">Why Choose JLS</h3>
              {[
                { title: 'Local Renovation Expertise', desc: '10+ years delivering quality residential upgrades' },
                { title: 'Transparent Communication', desc: 'Clear updates from planning through completion' },
                { title: 'Reliable Delivery', desc: 'Realistic timelines and uncompromising finishes' }
              ].map((item, i) => (
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
            <h2 className="text-4xl font-display font-semibold mb-3 text-white">Start Your Project Today</h2>
            <p className="text-gray-300">Get in touch to discuss your vision</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light mb-3 text-white">Free Quote</h3>
                <p className="text-gray-300 text-sm">
                  Choose the fastest way to reach us and start your project. We respond quickly and can help you move from idea to estimate.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://wa.me/5551234567?text=Hi%20JLS%20Carpentry,%20I%27d%20like%20a%20quote%20for%20my%20project."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-amber-600 text-white font-medium py-3 text-sm hover:bg-amber-700 transition-colors text-center rounded-lg"
                >
                  Message on WhatsApp
                </a>
                <a
                  href="sms:5551234567"
                  className="w-full border border-gray-500 text-white font-medium py-3 text-sm hover:border-gray-300 transition-colors text-center rounded-lg"
                >
                  Open Messages
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Phone', value: '(555) 123-4567' },
                { label: 'Email', value: 'josh@jlscarpentry.com.au' },
                { label: 'Location', value: '123 Carpenter St' },
                { label: 'Hours', value: 'Mon-Fri: 8am-6pm' }
              ].map((contact, i) => (
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
              <h4 className="text-white mb-3 font-light">JLS Carpentry</h4>
              <p className="text-gray-400 text-xs">Premier bespoke woodworking solutions since 1998</p>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Services</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Custom Furniture</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Cabinetry</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Restoration</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Company</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">About</button></li>
                <li><button onClick={() => scrollToSection('portfolio')} className="hover:text-white transition">Portfolio</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Contact</h4>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li>(555) 123-4567</li>
                <li>josh@jlscarpentry.com.au</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Follow</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} JLS Carpentry. All rights reserved.</p>
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
