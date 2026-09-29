import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight, Star, CheckCircle, Award, Users } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { DEFAULT_SITE_CONTENT, type SiteContent } from './siteContent'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    // Load Elfsight Instagram widget script
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="w-full min-h-screen bg-black text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black shadow-lg z-50 border-b border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => scrollToSection('home')} className="text-2xl font-light tracking-tight text-white">
              JLS Carpentry
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white font-medium transition-smooth duration-300">Home</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white font-medium transition-smooth duration-300">Services</button>
              <button onClick={() => scrollToSection('portfolio')} className="text-gray-400 hover:text-white font-medium transition-smooth duration-300">Portfolio</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white font-medium transition-smooth duration-300">Testimonials</button>
              <button onClick={() => scrollToSection('instagram')} className="text-gray-400 hover:text-white font-medium transition-smooth duration-300">Instagram</button>
              <button onClick={() => scrollToSection('contact')} className="bg-amber-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-amber-700 transition-colors">Get Quote</button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pb-6 space-y-2 bg-gray-50">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 px-2 text-gray-600 hover:text-gray-900 text-sm transition-colors">Home</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 px-2 text-gray-600 hover:text-gray-900 text-sm transition-colors">Services</button>
              <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left py-2 px-2 text-gray-600 hover:text-gray-900 text-sm transition-colors">Portfolio</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 px-2 text-gray-600 hover:text-gray-900 text-sm transition-colors">Testimonials</button>
              <button onClick={() => scrollToSection('instagram')} className="block w-full text-left py-2 px-2 text-gray-600 hover:text-gray-900 text-sm transition-colors">Instagram</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 px-2 text-amber-600 text-sm font-medium transition-colors">Get Quote</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c741cfd2f81997c15fb20_Featured-image.jpg" 
              alt="Premium Carpentry Workshop" 
              className="w-full h-96 md:h-[450px] object-cover rounded-lg"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-gray-900">
                {siteContent.home.title} <span className="text-amber-600">{siteContent.home.highlight}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
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
                className="border border-gray-400 text-gray-900 font-medium py-3 px-8 hover:border-gray-600 transition-colors rounded-lg"
              >
                View Portfolio
              </button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8">
              {siteContent.home.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-light text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-light mb-3 text-gray-900">{siteContent.services.title}</h2>
            <p className="text-gray-600">{siteContent.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.services.items.map((service, i) => (
              <div key={i} className="border border-gray-200 p-8 rounded-lg bg-white hover:shadow-md transition-shadow">
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
      <section id="portfolio" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-light mb-3 text-gray-900">{siteContent.portfolio.title}</h2>
            <p className="text-gray-600">{siteContent.portfolio.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {siteContent.portfolio.items.map((project, i) => (
              <div key={i} className="border border-gray-200 overflow-hidden rounded-lg hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 text-xs font-medium rounded">
                    {project.type}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-light text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-500 text-xs">Client: {project.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-light mb-3 text-gray-900">{siteContent.testimonials.title}</h2>
            <p className="text-gray-600">{siteContent.testimonials.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.testimonials.items.map((testimonial, i) => (
              <div key={i} className="border border-gray-200 p-6 rounded-lg bg-white hover:shadow-md transition-shadow">
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
      <section id="instagram" className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-light mb-3 text-gray-900">Follow @jls_carpentry_co</h2>
            <p className="text-gray-600 mb-8">Witness the artistry of premium woodworking. From concept to completion, we document every detail of our bespoke carpentry projects.</p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-2xl font-light text-gray-900 mb-1">25+</p>
                <p className="text-gray-500 text-xs">Years of Expertise</p>
              </div>
              <div>
                <p className="text-2xl font-light text-gray-900 mb-1">1000+</p>
                <p className="text-gray-500 text-xs">Projects Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-light text-gray-900 mb-1">98%</p>
                <p className="text-gray-500 text-xs">Client Satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 p-8 rounded-lg bg-white mb-8">
            <div className="elfsight-app-09ce51c4-95fa-4581-87ed-b199b0d76b5e" data-elfsight-app-lazy></div>
          </div>

          <div className="text-center">
            <a
              href="https://instagram.com/jls_carpentry_co"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 text-sm transition-colors rounded-lg"
            >
              <span>Visit Our Instagram</span>
              <span>→</span>
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
              <h2 className="text-4xl font-light mb-4 text-gray-900">About JLS Carpentry</h2>
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
      <section id="contact" className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-light mb-3 text-gray-900">Start Your Project Today</h2>
            <p className="text-gray-600">Get in touch to discuss your vision</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light mb-3 text-gray-900">Free Quote</h3>
                <p className="text-gray-600 text-sm">
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
                  className="w-full border border-gray-400 text-gray-900 font-medium py-3 text-sm hover:border-gray-600 transition-colors text-center rounded-lg"
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
                <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <p className="text-xl mb-2">{contact.icon}</p>
                  <p className="text-gray-600 text-xs mb-1">{contact.label}</p>
                  <p className="text-gray-900 text-sm">{contact.value}</p>
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
                <li><button className="hover:text-white transition">Instagram</button></li>
                <li><button className="hover:text-white transition">Facebook</button></li>
                <li><button className="hover:text-white transition">LinkedIn</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; 2024 JLS Carpentry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
