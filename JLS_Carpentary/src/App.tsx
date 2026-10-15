import { useEffect, useState } from 'react'
import { Menu, X, Star, ArrowUp } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { DEFAULT_SITE_CONTENT, type SiteContent } from './siteContent'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'about', label: 'About' },
]

const INSTAGRAM_URL = 'https://instagram.com/jls_carpentry_co'

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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('All')
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
          setSiteContent(snapshot.data() as SiteContent)
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
            <button onClick={() => scrollToSection('home')} className="text-2xl font-display tracking-tight text-white">
              JLS <span className="text-amber-500">Carpentry</span>
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
          <div className="order-2 md:order-1">
            <img 
              src="https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c741cfd2f81997c15fb20_Featured-image.jpg" 
              alt="Premium Carpentry Workshop" 
              className="w-full h-96 md:h-[450px] object-cover rounded-lg shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div>
              {siteContent.home.eyebrow && (
                <p className="text-amber-600 text-xs font-medium uppercase tracking-[0.2em] mb-4">{siteContent.home.eyebrow}</p>
              )}
              <h1 className="text-5xl md:text-6xl font-display font-semibold leading-tight mb-4 text-white">
                {siteContent.home.title} <span className="text-amber-600">{siteContent.home.highlight}</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                {siteContent.home.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-amber-600 text-white font-medium py-3 px-8 hover:bg-amber-700 transition-colors rounded-lg"
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
            <div className="grid grid-cols-3 gap-8 pt-8">
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
                <div className="text-5xl mb-4">{service.icon}</div>
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
            {filteredPortfolio.map((project) => (
              <div key={project.title} className="group border border-gray-800 overflow-hidden rounded-lg hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 text-xs font-medium rounded">
                    {project.type}
                  </div>
                </div>
                <div className="p-4 bg-black/60">
                  <h3 className="text-lg font-light text-white mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-xs">Client: {project.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-display font-semibold mb-3 text-gray-900">{siteContent.testimonials.title}</h2>
            <p className="text-gray-600">{siteContent.testimonials.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.testimonials.items.map((testimonial, i) => (
              <div key={i} className="border border-gray-200 p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-600 fill-amber-600" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="text-gray-900 text-sm font-light">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <img src="https://images.squarespace-cdn.com/content/v1/594ac91fd1758e19a10c0d10/512896d6-ef97-4a69-a49c-15c70b4e2941/_DSC0748.jpg" alt="Master Craftsman" className="w-full h-96 md:h-[450px] object-cover rounded-lg" />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-display font-semibold mb-4 text-gray-900">About JLS Carpentry</h2>
              <p className="text-gray-600 leading-relaxed mb-4">For over 25 years, JLS Carpentry has been delivering premier bespoke woodworking solutions with unwavering commitment to excellence.</p>
              <p className="text-gray-600 leading-relaxed">Every project begins with listening to our clients and collaborating to bring their vision to life with exceptional craftsmanship.</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-light text-gray-900">Why Choose JLS</h3>
              {[
                { title: 'Award-Winning', desc: 'Industry-recognized excellence' },
                { title: 'Quality Certified', desc: 'Premium materials' },
                { title: 'Expert Team', desc: '25+ years experience' }
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
                { icon: '📞', label: 'Phone', value: '(555) 123-4567' },
                { icon: '✉️', label: 'Email', value: 'josh@jlscarpentry.com.au' },
                { icon: '📍', label: 'Location', value: '123 Carpenter St' },
                { icon: '⏰', label: 'Hours', value: 'Mon-Fri: 8am-6pm' }
              ].map((contact, i) => (
                <div key={i} className="border border-gray-800 p-4 rounded-lg bg-black/60 backdrop-blur-sm">
                  <p className="text-xl mb-2">{contact.icon}</p>
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
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition">Testimonials</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3 font-light">Contact</h4>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li>📞 (555) 123-4567</li>
                <li>✉️ josh@jlscarpentry.com.au</li>
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
