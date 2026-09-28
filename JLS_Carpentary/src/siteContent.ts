export type SiteStat = {
  value: string
  label: string
}

export type HomeContent = {
  eyebrow: string
  title: string
  highlight: string
  description: string
  stats: SiteStat[]
}

export type ServiceItem = {
  title: string
  icon: string
  description: string
  features: string[]
}

export type ServiceContent = {
  title: string
  subtitle: string
  items: ServiceItem[]
}

export type PortfolioItem = {
  title: string
  client: string
  type: string
  image: string
}

export type PortfolioContent = {
  title: string
  subtitle: string
  items: PortfolioItem[]
}

export type TestimonialItem = {
  name: string
  role: string
  text: string
  rating: number
}

export type TestimonialsContent = {
  title: string
  subtitle: string
  items: TestimonialItem[]
}

export type SiteContent = {
  home: HomeContent
  services: ServiceContent
  portfolio: PortfolioContent
  testimonials: TestimonialsContent
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  home: {
    eyebrow: 'Award-Winning Craftsmanship Since 1998',
    title: 'Exceptional',
    highlight: 'Wood Craftsmanship',
    description:
      'Transform your vision into reality with premium, handcrafted woodworking solutions. JLS Carpentry combines 25+ years of expertise with meticulous attention to detail.',
    stats: [
      { value: '25+', label: 'Years Experience' },
      { value: '1000+', label: 'Projects Completed' },
      { value: '98%', label: 'Client Satisfaction' },
    ],
  },
  services: {
    title: 'Our Specialized Services',
    subtitle: 'From bespoke furniture to architectural installations, we deliver exceptional craftsmanship that elevates any space',
    items: [
      {
        title: 'Custom Furniture Design',
        icon: '🪑',
        description: 'Bespoke pieces tailored to your exact specifications',
        features: ['Made to measure', 'Premium materials', 'Lifetime support'],
      },
      {
        title: 'Kitchen Cabinetry',
        icon: '🏠',
        description: 'Elegant cabinet solutions that maximize your space',
        features: ['Custom layouts', 'Hardware options', 'Pro installation'],
      },
      {
        title: 'Storage Solutions',
        icon: '📦',
        description: 'Organized, beautiful storage that fits perfectly',
        features: ['Space optimization', 'Custom finishes', 'Integrated lighting'],
      },
      {
        title: 'Architectural Joinery',
        icon: '🎨',
        description: 'Complex woodwork for unique architectural elements',
        features: ['Detail oriented', 'Premium joinery', 'Expert craftsmanship'],
      },
      {
        title: 'Restoration & Repair',
        icon: '🔨',
        description: 'Restore vintage pieces to their original beauty',
        features: ['Expert restoration', 'Period-accurate', 'Preservation focused'],
      },
      {
        title: 'Design Consultation',
        icon: '💡',
        description: 'Professional guidance from concept to completion',
        features: ['Free consultation', 'Design expertise', 'Project management'],
      },
    ],
  },
  portfolio: {
    title: 'Recent Projects',
    subtitle: 'Showcasing our finest work across residential and commercial spaces',
    items: [
      { title: 'Modern Kitchen Renovation', client: 'Downtown Residence', type: 'Kitchen', image: 'https://allskillscollege.com.au/media/course_categories/gallery/carpentry-gallery-01.jpg' },
      { title: 'Executive Study Desk', client: 'Corporate Office', type: 'Furniture', image: 'https://cdn.prod.website-files.com/6390e14cc734a931f8327343/679c74b3164f379f7f08c8f8_679c749fc8a9859eed9d7af2_Inner-image-3.jpeg' },
      { title: 'Master Bedroom Cabinetry', client: 'Luxury Home', type: 'Storage', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjDcXpOVtZIziObRFggKmK2VcXKPS0bJ2NoTrYnaQZe6oWnWVD6YbLxcA&s=10' },
      { title: 'Commercial Office Built-ins', client: 'Tech Startup', type: 'Commercial', image: 'https://media.istockphoto.com/id/481628382/photo/carpenter-taking-measurement.jpg?s=612x612&w=0&k=20&c=l2cAPfJL2bGltBasmnqUlsz2OHv6H6bUzjzhx0feOJg=' },
      { title: 'Walnut Dining Table & Chairs', client: 'Private Collection', type: 'Furniture', image: 'https://prestigestaffing.com.au/images/apprenticeships/carpentry-apprenticeship-mildura-hero.png' },
      { title: 'Custom Wardrobe Design', client: 'Penthouse Suite', type: 'Storage', image: 'https://images.squarespace-cdn.com/content/v1/594ac91fd1758e19a10c0d10/512896d6-ef97-4a69-a49c-15c70b4e2941/_DSC0748.jpg' },
    ],
  },
  testimonials: {
    title: 'Client Testimonials',
    subtitle: 'What our satisfied clients have to say',
    items: [
      { name: 'Sarah Johnson', role: 'Homeowner', text: 'JLS Carpentry transformed our kitchen beyond expectations. Outstanding work!', rating: 5 },
      { name: 'Michael Chen', role: 'Interior Designer', text: 'Working with JLS is a pleasure. Impeccable craftsmanship and reliability.', rating: 5 },
      { name: 'Emma Williams', role: 'Corporate Client', text: 'The custom built-ins elevated our entire office. Highly recommended!', rating: 5 },
    ],
  },
}
