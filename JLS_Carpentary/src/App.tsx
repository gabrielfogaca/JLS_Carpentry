import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight, Star, CheckCircle, Award, Users, Moon, Sun } from 'lucide-react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import Dashboard from './Dashboard'
import { auth, db, firebaseReady } from './firebase'
import { DEFAULT_SITE_CONTENT, type SiteContent } from './siteContent'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [view, setView] = useState<'home' | 'dashboard'>('home')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    return DEFAULT_SITE_CONTENT
  })

  useEffect(() => {
    if (!auth) {
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setView(currentUser ? 'dashboard' : 'home')
    })

    return unsubscribe
  }, [])

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

  const handleSaveContent = async (content: SiteContent) => {
    setSiteContent(content)

    if (!db) {
      return
    }

    await setDoc(doc(db, 'siteContent', 'main'), content, { merge: true })
  }
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    setLoginError('')

    if (auth) {
      await signOut(auth)
    }

    setIsLoginModalOpen(false)
    setView('home')
  }

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')

    if (!auth || !firebaseReady) {
      setLoginError('Firebase is not ready yet. Restart the dev server after updating the Firebase config.')
      return
    }

    try {
      setIsSigningIn(true)
      try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      } catch (error: unknown) {
        const authError = error as { code?: string; message?: string }
        const authCode = authError?.code

        if (authCode === 'auth/user-not-found' || authCode === 'auth/invalid-credential' || authCode === 'auth/wrong-password') {
          await createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
        } else if (authCode === 'auth/operation-not-allowed') {
          throw new Error('Email/password sign-in is disabled in Firebase Authentication.')
        } else {
          throw authError
        }
      }
      setIsLoginModalOpen(false)
      setLoginEmail('')
      setLoginPassword('')
      setView('dashboard')
    } catch (error: unknown) {
      const authError = error as { message?: string }
      setLoginError(authError?.message || 'Sign in did not work. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  // Theme classes
  const bgClass = isDarkMode ? 'bg-gray-950' : 'bg-white'
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900'
  const navBgClass = isDarkMode ? 'bg-gray-900' : 'bg-white'
  const navBorderClass = isDarkMode ? 'border-gray-700' : 'border-slate-100'
  const secondaryBgClass = isDarkMode ? 'bg-gray-900' : 'bg-slate-50'
  const cardBgClass = isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 to-white'
  const cardBorderClass = isDarkMode ? 'border-gray-700' : 'border-slate-100'
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-slate-600'
  const textTertiaryClass = isDarkMode ? 'text-gray-300' : 'text-slate-700'
  const accentBgClass = isDarkMode ? 'bg-teal-900' : 'bg-teal-50'
  const accentTextClass = isDarkMode ? 'text-teal-300' : 'text-teal-700'
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'

  if (view === 'dashboard') {
    return <Dashboard isDarkMode={isDarkMode} onLogout={handleLogout} siteContent={siteContent} onSaveContent={handleSaveContent} />
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full ${navBgClass} shadow-lg z-50 border-b ${navBorderClass} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 animate-fade-in-down">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentBgClass}`}>
                <span className={`text-lg font-bold ${accentTextClass}`}>J</span>
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-teal-400 to-cyan-500' : 'from-teal-600 to-teal-700'} bg-clip-text text-transparent`}>JLS Carpentry</span>
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <button onClick={() => scrollToSection('home')} className={`${textSecondaryClass} hover:text-white font-medium transition-smooth duration-300`}>Home</button>
              <button onClick={() => scrollToSection('services')} className={`${textSecondaryClass} hover:text-white font-medium transition-smooth duration-300`}>Services</button>
              <button onClick={() => scrollToSection('portfolio')} className={`${textSecondaryClass} hover:text-white font-medium transition-smooth duration-300`}>Portfolio</button>
              <button onClick={() => scrollToSection('testimonials')} className={`${textSecondaryClass} hover:text-white font-medium transition-smooth duration-300`}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className={`bg-gradient-to-r ${isDarkMode ? 'from-teal-700 to-teal-600' : 'from-teal-600 to-teal-700'} text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-md hover:-translate-y-0.5 transition-smooth duration-300`}>Get Quote</button>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`ml-4 p-2 rounded-lg transition-smooth duration-300 ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-slate-100 text-slate-600'} hover:scale-110`}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-smooth duration-300 ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden border-t ${navBorderClass} pb-6 space-y-3 animate-fade-in-down ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
              <button onClick={() => scrollToSection('home')} className={`block w-full text-left py-3 px-2 ${hoverBgClass} rounded-lg font-medium transition-colors`}>Home</button>
              <button onClick={() => scrollToSection('services')} className={`block w-full text-left py-3 px-2 ${hoverBgClass} rounded-lg font-medium transition-colors`}>Services</button>
              <button onClick={() => scrollToSection('portfolio')} className={`block w-full text-left py-3 px-2 ${hoverBgClass} rounded-lg font-medium transition-colors`}>Portfolio</button>
              <button onClick={() => scrollToSection('testimonials')} className={`block w-full text-left py-3 px-2 ${hoverBgClass} rounded-lg font-medium transition-colors`}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className={`block w-full text-left py-3 px-2 ${hoverBgClass} rounded-lg font-medium transition-colors text-teal-600 font-bold`}>Get Quote</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={`pt-32 pb-20 px-4 ${isDarkMode ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-slate-50 to-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 animate-fade-in-up">
            <img 
              src="https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c741cfd2f81997c15fb20_Featured-image.jpg" 
              alt="Premium Carpentry Workshop" 
              className={`w-full h-96 md:h-[500px] rounded-2xl shadow-lg object-cover hover:shadow-xl transition-smooth duration-500 ${isDarkMode ? 'border border-gray-700' : 'border border-slate-200'}`}
            />
          </div>
          <div className="order-1 md:order-2 space-y-8 animate-slide-in-left">
            <div>
              <div className={`inline-flex items-center gap-2 ${accentBgClass} ${accentTextClass} px-4 py-2 rounded-full text-sm font-semibold mb-6 ${isDarkMode ? 'border border-teal-700' : 'border border-teal-200'} animate-fade-in-down`}>
                <Award size={16} />
                {siteContent.home.eyebrow}
              </div>
              <h1 className={`text-6xl md:text-7xl font-bold leading-tight mb-6 ${textClass}`}>
                {siteContent.home.title} <span className={`bg-gradient-to-r ${isDarkMode ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-teal-700'} bg-clip-text text-transparent`}>{siteContent.home.highlight}</span>
              </h1>
              <p className={`text-xl ${textSecondaryClass} leading-relaxed mb-8`}>
                {siteContent.home.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <button 
                onClick={() => scrollToSection('contact')} 
                className={`bg-gradient-to-r ${isDarkMode ? 'from-teal-700 to-teal-600' : 'from-teal-600 to-teal-700'} hover:shadow-xl hover:-translate-y-1 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-smooth duration-300`}
              >
                Get Your Free Quote <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')} 
                className={`border-2 ${isDarkMode ? 'border-teal-600 text-teal-400 hover:bg-teal-600/10' : 'border-teal-600 text-teal-700 hover:bg-teal-50'} font-bold py-4 px-8 rounded-lg transition-smooth duration-300`}
              >
                View Our Portfolio
              </button>
            </div>
            <div className={`grid grid-cols-3 gap-6 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} animate-fade-in-up`}>
              {siteContent.home.stats.map((stat) => (
                <div key={stat.label}>
                  <p className={`text-4xl font-bold ${textClass}`}>{stat.value}</p>
                  <p className={`${textSecondaryClass} text-sm`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-24 px-4 ${secondaryBgClass} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>{siteContent.services.title}</h2>
            <p className={`text-xl ${textSecondaryClass} max-w-2xl mx-auto`}>{siteContent.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.services.items.map((service, i) => (
              <div key={i} className={`${cardBgClass} p-8 rounded-xl border ${cardBorderClass} hover:shadow-lg hover:-translate-y-2 transition-smooth duration-300`}>
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className={`text-2xl font-bold ${textClass} mb-3`}>{service.title}</h3>
                <p className={`${textSecondaryClass} mb-6`}>{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-2 ${textTertiaryClass}`}>
                      <CheckCircle size={18} className={`${accentTextClass} flex-shrink-0`} />
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
      <section id="portfolio" className={`py-24 px-4 ${isDarkMode ? 'bg-gray-950' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>{siteContent.portfolio.title}</h2>
            <p className={`text-xl ${textSecondaryClass}`}>{siteContent.portfolio.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.portfolio.items.map((project, i) => (
              <div key={i} className={`group ${cardBgClass} rounded-xl shadow-md hover:shadow-lg transition-smooth duration-300 overflow-hidden`}>
                <div className="relative overflow-hidden h-56">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${isDarkMode ? 'from-teal-700 to-teal-600' : 'from-teal-600 to-teal-700'} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                    {project.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${textClass} mb-2`}>{project.title}</h3>
                  <p className={`${textSecondaryClass} text-sm`}>Client: {project.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`py-24 px-4 ${secondaryBgClass} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>{siteContent.testimonials.title}</h2>
            <p className={`text-xl ${textSecondaryClass}`}>{siteContent.testimonials.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.testimonials.items.map((testimonial, i) => (
              <div key={i} className={`${cardBgClass} p-8 rounded-xl border ${cardBorderClass} hover:shadow-xl transition duration-300`}>
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <Star key={j} size={20} className={`${isDarkMode ? 'text-amber-400 fill-amber-400' : 'text-amber-500 fill-amber-500'}`} />
                  ))}
                </div>
                <p className={`${textTertiaryClass} text-lg mb-6 italic`}>"{testimonial.text}"</p>
                <div>
                  <p className={`font-bold ${textClass}`}>{testimonial.name}</p>
                  <p className={`${textSecondaryClass} text-sm`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`py-24 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://images.squarespace-cdn.com/content/v1/594ac91fd1758e19a10c0d10/512896d6-ef97-4a69-a49c-15c70b4e2941/_DSC0748.jpg" alt="Master Craftsman" className={`w-full h-96 md:h-[500px] rounded-2xl shadow-lg object-cover ${isDarkMode ? 'border border-gray-700' : 'border border-slate-200'}`} />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>About JLS Carpentry</h2>
              <p className={`text-lg ${textTertiaryClass} leading-relaxed mb-6`}>For over 25 years, JLS Carpentry has been delivering premier bespoke woodworking solutions with unwavering commitment to excellence.</p>
              <p className={`text-lg ${textTertiaryClass} leading-relaxed`}>Every project begins with listening to our clients and collaborating to bring their vision to life with exceptional craftsmanship.</p>
            </div>
            <div className="space-y-4">
              <h3 className={`text-2xl font-bold mb-6 ${textClass}`}>Why Choose JLS</h3>
              {[
                { icon: <Award size={24} className={accentTextClass} />, title: 'Award-Winning', desc: 'Industry-recognized excellence' },
                { icon: <CheckCircle size={24} className={accentTextClass} />, title: 'Quality Certified', desc: 'Premium materials' },
                { icon: <Users size={24} className={accentTextClass} />, title: 'Expert Team', desc: '25+ years experience' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  {item.icon}
                  <div>
                    <p className={`font-bold ${textClass}`}>{item.title}</p>
                    <p className={textSecondaryClass}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`py-24 px-4 bg-gradient-to-r ${isDarkMode ? 'from-teal-900 to-slate-900' : 'from-teal-600 to-teal-700'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Start Your Project Today</h2>
            <p className="text-xl text-white/90">Get in touch to discuss your vision</p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10`}>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Free Quote</h3>
                  <p className="text-white/80 text-lg max-w-xl">
                    Choose the fastest way to reach us and start your project. We respond quickly and can help you move from idea to estimate.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <a
                    href="https://wa.me/5551234567?text=Hi%20JLS%20Carpentry,%20I%27d%20like%20a%20quote%20for%20my%20project."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white text-teal-700 font-bold py-4 rounded-lg hover:bg-slate-100 transition text-center"
                  >
                    Message on WhatsApp
                  </a>
                  <a
                    href="sms:5551234567"
                    className="w-full border border-white/30 text-white font-bold py-4 rounded-lg hover:bg-white/10 transition text-center"
                  >
                    Open Messages
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {['Fast reply', 'Free consultation', 'Custom solutions'].map((item) => (
                    <div key={item} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/90 text-sm font-medium text-center">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: '📞', label: 'Phone', value: '(555) 123-4567' },
                  { icon: '✉️', label: 'Email', value: 'hello@jlscarpentry.com' },
                  { icon: '📍', label: 'Location', value: '123 Carpenter St' },
                  { icon: '⏰', label: 'Hours', value: 'Mon-Fri: 8am-6pm' }
                ].map((contact, i) => (
                  <div key={i} className="rounded-xl border border-white/20 bg-white/10 p-5 text-white">
                    <p className="text-2xl mb-3">{contact.icon}</p>
                    <p className="text-sm text-white/80 mb-1">{contact.label}</p>
                    <p className="font-bold">{contact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-950 border-t border-gray-800' : 'bg-slate-900 text-white'} py-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-6 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">JLS Carpentry</h4>
              <p className={isDarkMode ? 'text-gray-400' : 'text-slate-300'}>Premier bespoke woodworking solutions since 1998</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Custom Furniture</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Cabinetry</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Restoration</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">About</button></li>
                <li><button onClick={() => scrollToSection('portfolio')} className="hover:text-white transition">Portfolio</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition">Testimonials</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
                <li>📞 (555) 123-4567</li>
                <li>✉️ hello@jlscarpentry.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Account</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="hover:text-white transition inline-flex items-center gap-2"
                  >
                    <span aria-hidden="true">👤</span>
                    Login
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Follow</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
                <li><button className="hover:text-white transition">Instagram</button></li>
                <li><button className="hover:text-white transition">Facebook</button></li>
                <li><button className="hover:text-white transition">LinkedIn</button></li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-slate-700'} pt-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-slate-300'}`}>
            <p>&copy; 2024 JLS Carpentry. All rights reserved. | Crafted with excellence</p>
          </div>
        </div>
      </footer>

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close login modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLoginModalOpen(false)}
          />
          <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} relative z-10 w-full max-w-md rounded-2xl border shadow-2xl p-8`}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className={`text-sm font-semibold ${accentTextClass} mb-2`}>Member Access</p>
                <h3 className={`text-3xl font-bold ${textClass}`}>Log in to your account</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-slate-100 text-slate-600'} hover:scale-105 transition`}
                aria-label="Close login dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="login-email" className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-teal-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-600'}`}
                />
              </div>

              <div>
                <label htmlFor="login-password" className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-teal-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-600'}`}
                />
              </div>

              {loginError ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {loginError}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-4 pt-2">
                <label className={`inline-flex items-center gap-2 text-sm ${textSecondaryClass}`}>
                  <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  Remember me
                </label>
                <button type="button" className={`text-sm font-medium ${accentTextClass} hover:underline`}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className={`w-full rounded-lg bg-gradient-to-r ${isDarkMode ? 'from-teal-700 to-teal-600' : 'from-teal-600 to-teal-700'} px-4 py-3 font-bold text-white hover:shadow-lg transition`}
              >
                {isSigningIn ? 'Signing in...' : 'Sign in'}
              </button>

              <p className={`text-sm text-center ${textSecondaryClass}`}>
                New here? Contact us and we’ll help set up your access.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
