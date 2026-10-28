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
  type: string
  image: string
  description?: string
  images?: string[]
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

export type InstagramPost = {
  id: string
  image: string
  likes: number
  comments: number
}

export type InstagramContent = {
  handle: string
  bio: string
  followerCount: number
  followingCount: number
  postCount: number
  posts: InstagramPost[]
}

export type SiteContent = {
  home: HomeContent
  services: ServiceContent
  portfolio: PortfolioContent
  testimonials: TestimonialsContent
  instagram: InstagramContent
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  home: {
    eyebrow: 'Bespoke Craftsmanship Since 2016',
    title: 'Premium Home Renovations',
    highlight: '& Extensions',
    description:
      'Ready to upgrade your living space? JLS Carpentry delivers top-tier craftsmanship across a full suite of specialised renovation services. Backed by 10+ years of local expertise, we pride ourselves on transparent communication, reliable timelines, and an uncompromising standard of finish.',
    stats: [
      { value: '10', label: 'Years Experience' },
      { value: '200', label: 'Projects' },
      { value: '98%', label: 'Client Satisfaction' },
    ],
  },
  services: {
    title: 'Specialised Renovation Services',
    subtitle: 'Premium solutions designed to elevate comfort, value, and everyday living.',
    items: [
      {
        title: 'Home Extensions',
        icon: '🏗️',
        description: 'Seamlessly expanding your footprint to accommodate growing families.',
        features: ['Integrated design', 'Structural framing', 'Space-maximising layouts'],
      },
      {
        title: 'Alfresco Living',
        icon: '🪵',
        description: 'Custom-built timber decks and functional pergolas perfect for entertaining.',
        features: ['Custom timber decks', 'Functional pergolas', 'Entertainment-ready builds'],
      },
      {
        title: 'Kitchen & Bathroom Renovations',
        icon: '🍽️',
        description: 'Modern, high-end transformations designed for daily luxury.',
        features: ['Premium finishes', 'Smart layouts', 'Daily-use durability'],
      },
      {
        title: 'Wardrobes and Storage Fitouts',
        icon: '🎨',
        description: 'Built-in wardrobes and storage solutions tailored to each room and client needs.',
        features: ['Mirrored sliders', 'Custom shelving', 'Space optimization'],
      },
      {
        title: 'Bathrooms and Renovation Carpentry',
        icon: '🛁',
        description: 'Carpentry support for bathroom renovations, from framing to finishing details.',
        features: ['Renovation-ready', 'Detail focused', 'Trade coordination'],
      },
      {
        title: 'Flooring Installation',
        icon: '💡',
        description: 'Professional timber flooring installation for seamless transitions and long-term performance.',
        features: ['Blackbutt and hardwood', 'Accurate leveling', 'Clean finishing'],
      },
    ],
  },
  portfolio: {
    title: 'Recent Projects',
    subtitle: 'Showcasing our finest work across residential and commercial spaces',
    items: [
      {
        title: 'Master Ensuite Renovation',
        type: 'Bathroom',
        image: '/images/projects/bathroom/bathroom.jpeg',
        description: 'Master ensuite renovation with custom tile feature and premium finishes.',
        images: [
          '/images/projects/bathroom/bathroom.jpeg',
          '/images/projects/bathroom/WhatsApp Image 2026-10-19 at 7.31.24 PM (1).jpeg',
          '/images/projects/bathroom/WhatsApp Image 2026-10-19 at 7.31.28 PM.jpeg',
          '/images/projects/bathroom/WhatsApp Image 2026-10-19 at 7.31.34 PM.jpeg',
          '/images/projects/bathroom/WhatsApp Image 2026-10-19 at 7.32.05 PM (1).jpeg',
        ],
      },
      {
        title: 'Pergola and Decking Build',
        type: 'Decking',
        image: '/images/projects/decking/pergola.jpeg',
        description: 'Large-format pergola and hardwood decking project from frame to final finish.',
        images: [
          '/images/projects/decking/pergola.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.24 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.24 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.25 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.25 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.26 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.26 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.27 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.27 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.27 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.28 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.28 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.29 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.30 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.31 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.31 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.33 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.34 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.54 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.54 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.55 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.55 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.31.59 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.00 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.00 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.01 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.01 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.02 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.02 PM (2).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.03 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.03 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.04 PM (1).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.07 PM.jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.09 PM (3).jpeg',
          '/images/projects/decking/WhatsApp Image 2026-10-19 at 7.32.11 PM (1).jpeg',
        ],
      },
      {
        title: 'Internal Floor Renovation',
        type: 'Flooring',
        image: '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.26 PM.jpeg',
        description: 'Interior flooring renovation with staged install and final detailing.',
        images: [
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.26 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.30 PM (1).jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.31 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.55 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.57 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.31.58 PM (1).jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.00 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.04 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.05 PM (2).jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.08 PM.jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.09 PM (1).jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.09 PM (2).jpeg',
          '/images/projects/floor/WhatsApp Image 2026-10-19 at 7.32.11 PM.jpeg',
        ],
      },
      {
        title: 'Custom Kitchen Joinery',
        type: 'Kitchen',
        image: '/images/projects/kitchen/WhatsApp Image 2026-10-19 at 7.31.33 PM (1).jpeg',
        description: 'Kitchen cabinetry and benchtop installation with clean contemporary lines.',
        images: [
          '/images/projects/kitchen/WhatsApp Image 2026-10-19 at 7.31.33 PM (1).jpeg',
          '/images/projects/kitchen/WhatsApp Image 2026-10-19 at 7.31.56 PM (1).jpeg',
          '/images/projects/kitchen/WhatsApp Image 2026-10-19 at 7.31.58 PM.jpeg',
        ],
      },
      {
        title: 'Outdoor Playground Timber Works',
        type: 'Outdoor',
        image: '/images/projects/playground/03.jpeg',
        description: 'Playground carpentry package with climbing wall and timber activity features.',
        images: [
          '/images/projects/playground/03.jpeg',
          '/images/projects/playground/WhatsApp Image 2026-10-19 at 7.31.57 PM (1).jpeg',
          '/images/projects/playground/WhatsApp Image 2026-10-19 at 7.32.02 PM.jpeg',
          '/images/projects/playground/WhatsApp Image 2026-10-19 at 7.32.09 PM.jpeg',
          '/images/projects/playground/WhatsApp Image 2026-10-19 at 7.32.11 PM (2).jpeg',
        ],
      },
      {
        title: 'Roof and Pergola Framing',
        type: 'Roofing',
        image: '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.26 PM (1).jpeg',
        description: 'Roof framing and pergola structural work with staged progress documentation.',
        images: [
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.26 PM (1).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.27 PM.jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.28 PM (2).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.32 PM.jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.33 PM.jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.59 PM (1).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.31.59 PM (2).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.04 PM (2).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.05 PM.jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.06 PM (1).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.06 PM.jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.07 PM (1).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.07 PM (2).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.08 PM (1).jpeg',
          '/images/projects/roof/WhatsApp Image 2026-10-19 at 7.32.12 PM (1).jpeg',
        ],
      },
      {
        title: 'Custom Stair Build',
        type: 'Stairs',
        image: '/images/projects/stairs/WhatsApp Image 2026-10-19 at 7.31.32 PM (1).jpeg',
        description: 'Timber stair construction with finish detailing and site-fit precision.',
        images: [
          '/images/projects/stairs/WhatsApp Image 2026-10-19 at 7.31.32 PM (1).jpeg',
          '/images/projects/stairs/WhatsApp Image 2026-10-19 at 7.31.32 PM (2).jpeg',
          '/images/projects/stairs/WhatsApp Image 2026-10-19 at 7.32.10 PM (1).jpeg',
        ],
      },
      {
        title: 'Custom Wardrobe Fitout',
        type: 'Wardrobe',
        image: '/images/projects/wardrobe/hero.jpeg',
        description: 'Bespoke bedroom wardrobe with mirrored sliding doors, shelving, and practical storage layout.',
        images: [
          '/images/projects/wardrobe/hero.jpeg',
          '/images/projects/wardrobe/02.jpeg',
        ],
      },
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
  instagram: {
    handle: 'jls_carpentry_co',
    bio: 'Premium Bespoke Carpentry & Woodworking | Custom builds | Design | 25+ years expertise',
    followerCount: 2800,
    followingCount: 84,
    postCount: 150,
    posts: [
      { id: '1', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop', likes: 324, comments: 12 },
      { id: '2', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', likes: 456, comments: 18 },
      { id: '3', image: 'https://images.unsplash.com/photo-1595440707802-9b009979a914?w=400&h=400&fit=crop', likes: 389, comments: 14 },
      { id: '4', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', likes: 512, comments: 22 },
      { id: '5', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop', likes: 478, comments: 19 },
      { id: '6', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', likes: 345, comments: 11 },
      { id: '7', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop', likes: 534, comments: 25 },
      { id: '8', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', likes: 401, comments: 16 },
      { id: '9', image: 'https://images.unsplash.com/photo-1595440707802-9b009979a914?w=400&h=400&fit=crop', likes: 467, comments: 17 },
    ],
  },
}
