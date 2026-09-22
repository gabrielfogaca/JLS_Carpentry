import { useState } from 'react'
import { Menu, X, ArrowRight, Star, CheckCircle, Award, Users, Moon, Sun } from 'lucide-react'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
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
                Award-Winning Craftsmanship Since 1998
              </div>
              <h1 className={`text-6xl md:text-7xl font-bold leading-tight mb-6 ${textClass}`}>
                Exceptional <span className={`bg-gradient-to-r ${isDarkMode ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-teal-700'} bg-clip-text text-transparent`}>Wood Craftsmanship</span>
              </h1>
              <p className={`text-xl ${textSecondaryClass} leading-relaxed mb-8`}>
                Transform your vision into reality with premium, handcrafted woodworking solutions. JLS Carpentry combines 25+ years of expertise with meticulous attention to detail.
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
              <div><p className={`text-4xl font-bold ${textClass}`}>25+</p><p className={`${textSecondaryClass} text-sm`}>Years Experience</p></div>
              <div><p className={`text-4xl font-bold ${textClass}`}>1000+</p><p className={`${textSecondaryClass} text-sm`}>Projects Completed</p></div>
              <div><p className={`text-4xl font-bold ${textClass}`}>98%</p><p className={`${textSecondaryClass} text-sm`}>Client Satisfaction</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-24 px-4 ${secondaryBgClass} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>Our Specialized Services</h2>
            <p className={`text-xl ${textSecondaryClass} max-w-2xl mx-auto`}>From bespoke furniture to architectural installations, we deliver exceptional craftsmanship that elevates any space</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Custom Furniture Design', icon: 'ðŸª‘', desc: 'Bespoke pieces tailored to your exact specifications', features: ['Made to measure', 'Premium materials', 'Lifetime support'] },
              { title: 'Kitchen Cabinetry', icon: 'ðŸ ', desc: 'Elegant cabinet solutions that maximize your space', features: ['Custom layouts', 'Hardware options', 'Pro installation'] },
              { title: 'Storage Solutions', icon: 'ðŸ“¦', desc: 'Organized, beautiful storage that fits perfectly', features: ['Space optimization', 'Custom finishes', 'Integrated lighting'] },
              { title: 'Architectural Joinery', icon: 'ðŸŽ¨', desc: 'Complex woodwork for unique architectural elements', features: ['Detail oriented', 'Premium joinery', 'Expert craftsmanship'] },
              { title: 'Restoration & Repair', icon: 'ðŸ”¨', desc: 'Restore vintage pieces to their original beauty', features: ['Expert restoration', 'Period-accurate', 'Preservation focused'] },
              { title: 'Design Consultation', icon: 'ðŸ’¡', desc: 'Professional guidance from concept to completion', features: ['Free consultation', 'Design expertise', 'Project management'] }
            ].map((service, i) => (
              <div key={i} className={`${cardBgClass} p-8 rounded-xl border ${cardBorderClass} hover:shadow-lg hover:-translate-y-2 transition-smooth duration-300`}>
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className={`text-2xl font-bold ${textClass} mb-3`}>{service.title}</h3>
                <p className={`${textSecondaryClass} mb-6`}>{service.desc}</p>
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
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>Recent Projects</h2>
            <p className={`text-xl ${textSecondaryClass}`}>Showcasing our finest work across residential and commercial spaces</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Modern Kitchen Renovation', client: 'Downtown Residence', type: 'Kitchen', image: 'https://allskillscollege.com.au/media/course_categories/gallery/carpentry-gallery-01.jpg' },
              { title: 'Executive Study Desk', client: 'Corporate Office', type: 'Furniture', image: 'https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c74b3164f379f7f08c8f8_679c749fc8a9859eed9d7af2_Inner-image-3.jpeg' },
              { title: 'Master Bedroom Cabinetry', client: 'Luxury Home', type: 'Storage', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjDcXpOVtZIziObRFggKmK2VcXKPS0bJ2NoTrYnaQZe6oWnWVD6YbLxcA&s=10' },
              { title: 'Commercial Office Built-ins', client: 'Tech Startup', type: 'Commercial', image: 'https://media.istockphoto.com/id/481628382/photo/carpenter-taking-measurement.jpg?s=612x612&w=0&k=20&c=l2cAPfJL2bGltBasmnqUlsz2OHv6H6bUzjzhx0feOJg=' },
              { title: 'Walnut Dining Table & Chairs', client: 'Private Collection', type: 'Furniture', image: 'https://prestigestaffing.com.au/images/apprenticeships/carpentry-apprenticeship-mildura-hero.png' },
              { title: 'Custom Wardrobe Design', client: 'Penthouse Suite', type: 'Storage', image: 'https://images.squarespace-cdn.com/content/v1/594ac91fd1758e19a10c0d10/512896d6-ef97-4a69-a49c-15c70b4e2941/_DSC0748.jpg' }
            ].map((project, i) => (
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
            <h2 className={`text-5xl font-bold mb-6 ${textClass}`}>Client Testimonials</h2>
            <p className={`text-xl ${textSecondaryClass}`}>What our satisfied clients have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Homeowner', text: 'JLS Carpentry transformed our kitchen beyond expectations. Outstanding work!', rating: 5 },
              { name: 'Michael Chen', role: 'Interior Designer', text: 'Working with JLS is a pleasure. Impeccable craftsmanship and reliability.', rating: 5 },
              { name: 'Emma Williams', role: 'Corporate Client', text: 'The custom built-ins elevated our entire office. Highly recommended!', rating: 5 }
            ].map((testimonial, i) => (
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
          <div className="grid md:grid-cols-2 gap-12">
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm border border-white/20 p-8 rounded-xl`}>
              <h3 className="text-2xl font-bold mb-8 text-white">Free Quote</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className={`w-full p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/10'} border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-smooth`} required />
                <input type="email" placeholder="Email" className={`w-full p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/10'} border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-smooth`} required />
                <input type="tel" placeholder="Phone" className={`w-full p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/10'} border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-smooth`} required />
                <select className={`w-full p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/10'} border border-white/20 rounded-lg text-white focus:outline-none focus:border-white transition-smooth`}>
                  <option>Project Type</option>
                  <option>Custom Furniture</option>
                  <option>Cabinetry</option>
                  <option>Storage</option>
                </select>
                <textarea placeholder="Details" rows={4} className={`w-full p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/10'} border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-smooth`} required></textarea>
                <button type="submit" className="w-full bg-white text-teal-700 font-bold py-3 rounded-lg hover:bg-slate-100 transition">Send</button>
              </form>
            </div>
            <div className="space-y-8">
              {[
                { icon: 'ðŸ“ž', label: 'Phone', value: '(555) 123-4567' },
                { icon: 'ðŸ“§', label: 'Email', value: 'hello@jlscarpentry.com' },
                { icon: 'ðŸ“', label: 'Location', value: '123 Carpenter St' },
                { icon: 'â°', label: 'Hours', value: 'Mon-Fri: 8am-6pm' }
              ].map((contact, i) => (
                <div key={i} className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm border border-white/20 p-6 rounded-xl`}>
                  <p className="text-2xl mb-2">{contact.icon}</p>
                  <p className="text-sm text-white/80 mb-1">{contact.label}</p>
                  <p className="font-bold text-white">{contact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-950 border-t border-gray-800' : 'bg-slate-900 text-white'} py-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
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
                <li>ðŸ“ž (555) 123-4567</li>
                <li>ðŸ“§ hello@jlscarpentry.com</li>
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
    </div>
  )
}
