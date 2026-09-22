import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#sobre' },
  { label: 'Services', href: '#servicos' },
  { label: 'Work', href: '#trabalhos' },
  { label: 'Contact', href: '#contacto' },
];

const SERVICES = [
  {
    title: 'Bespoke Furniture',
    desc: 'One-of-a-kind pieces designed for your space — wardrobes, shelving, dining tables, and beds crafted to measure from hand-selected timber.',
    icon: '⬡',
  },
  {
    title: 'Restoration & Repair',
    desc: 'We breathe new life into antique and worn pieces. Stripping, sanding, finishing, and repairing furniture with respect for its history.',
    icon: '◈',
  },
  {
    title: 'Interior Joinery',
    desc: 'Skirting boards, architraves, timber ceilings, panelling, and wall linings that transform an ordinary interior into something memorable.',
    icon: '◇',
  },
  {
    title: 'Kitchens & Wardrobes',
    desc: 'Built-in kitchen fronts and fitted wardrobes designed to the millimetre for a perfect fit, with finishes that last for decades.',
    icon: '▷',
  },
];

const PROJECTS = [
  {
    id: 1,
    title: 'Oak Dining Table',
    category: 'Furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
    year: '2024',
  },
  {
    id: 2,
    title: 'Walnut Library',
    category: 'Joinery',
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&auto=format',
    year: '2024',
  },
  {
    id: 3,
    title: 'Ash Timber Kitchen',
    category: 'Kitchen',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
    year: '2023',
  },
  {
    id: 4,
    title: 'Chair Restoration',
    category: 'Restoration',
    img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
    year: '2023',
  },
  {
    id: 5,
    title: 'Carved Bedhead',
    category: 'Furniture',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format',
    year: '2023',
  },
  {
    id: 6,
    title: 'Timber Workbench',
    category: 'Joinery',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format',
    year: '2022',
  },
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return scrolled;
}

function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(21, 16, 10, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(196,136,42,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="flex flex-col leading-none">
          <span
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: '#f0e6d0', letterSpacing: '-0.02em' }}
          >
            Manuel Ferreira
          </span>
          <span style={{ fontSize: '0.65rem', color: '#c4882a', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
            Carpenter & Cabinet Maker
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#b8a890',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#c4882a')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#b8a890')}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#15100a',
              background: '#c4882a',
              padding: '0.5rem 1.2rem',
              borderRadius: '2px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#e4a84a')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#c4882a')}
          >
            Get a Quote
          </a>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span style={{ width: 22, height: 1.5, background: '#f0e6d0', display: 'block', transition: 'transform 0.2s', transform: open ? 'rotate(45deg) translateY(5px)' : 'none' }} />
          <span style={{ width: 22, height: 1.5, background: '#f0e6d0', display: 'block', opacity: open ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ width: 22, height: 1.5, background: '#f0e6d0', display: 'block', transition: 'transform 0.2s', transform: open ? 'rotate(-45deg) translateY(-5px)' : 'none' }} />
        </button>
      </div>

      {open && (
        <div style={{ background: '#1f160d', borderTop: '1px solid rgba(196,136,42,0.12)' }} className="md:hidden px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b8a890' }}>
              {l.label}
            </a>
          ))}
          <a href="#contacto" onClick={() => setOpen(false)}
            style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: '#15100a', background: '#c4882a', padding: '0.6rem 1rem', borderRadius: '2px', textAlign: 'center' }}>
            Get a Quote
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-end" style={{ background: '#15100a' }}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=1600&h=1000&fit=crop&auto=format"
          alt="Carpenter working with timber"
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #15100a 40%, rgba(21,16,10,0.4) 100%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1.5rem' }}>
            Est. 1998 · Melbourne, Australia
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              lineHeight: 1.0,
              color: '#f0e6d0',
              letterSpacing: '-0.03em',
              marginBottom: '2rem',
            }}
          >
            Timber holds<br />
            <em style={{ fontStyle: 'italic', color: '#c4882a' }}>memory.</em>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#b8a890', lineHeight: 1.75, maxWidth: '480px', marginBottom: '2.5rem' }}>
            Bespoke furniture, restoration, and interior joinery.
            Every piece is made by hand, from carefully selected timber, with a care you can feel at first touch.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#trabalhos"
              style={{
                fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                color: '#15100a', background: '#c4882a', padding: '0.85rem 2rem', borderRadius: '2px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#e4a84a')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#c4882a')}
            >
              View Work
            </a>
            <a
              href="#contacto"
              style={{
                fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
                color: '#f0e6d0', border: '1px solid rgba(196,136,42,0.35)', padding: '0.85rem 2rem', borderRadius: '2px',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = '#c4882a'; (e.target as HTMLElement).style.color = '#c4882a'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'rgba(196,136,42,0.35)'; (e.target as HTMLElement).style.color = '#f0e6d0'; }}
            >
              Request a Quote
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 md:right-12 z-10 hidden md:flex flex-col items-center gap-2">
        <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, rgba(196,136,42,0.6))' }} />
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', writingMode: 'vertical-rl' }}>
          Scroll
        </p>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: '26', label: 'Years of Experience' },
    { value: '800+', label: 'Pieces Delivered' },
    { value: '100%', label: 'Handcrafted' },
    { value: '5★', label: 'Average Rating' },
  ];
  return (
    <div style={{ background: '#1f160d', borderTop: '1px solid rgba(196,136,42,0.12)', borderBottom: '1px solid rgba(196,136,42,0.12)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2.2rem', color: '#c4882a', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b8a890', marginTop: '0.4rem' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="sobre" className="py-24 md:py-32" style={{ background: '#15100a' }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div
            style={{
              position: 'absolute',
              inset: '-16px -16px 16px 16px',
              border: '1px solid rgba(196,136,42,0.2)',
              borderRadius: '2px',
              pointerEvents: 'none',
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&h=850&fit=crop&auto=format"
            alt="Manuel Ferreira in his workshop"
            className="w-full rounded-sm object-cover"
            style={{ height: '520px', background: '#2a1e11' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1.5rem',
              right: '-1.5rem',
              background: '#c4882a',
              color: '#15100a',
              padding: '1.25rem 1.5rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              lineHeight: 1.3,
            }}
          >
            Workshop in Melbourne<br />
            <span style={{ fontWeight: 400, fontStyle: 'italic' }}>since 1998</span>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1.2rem' }}>
            About the Craftsman
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              color: '#f0e6d0',
              letterSpacing: '-0.02em',
              marginBottom: '1.8rem',
            }}
          >
            I learnt from my father.<br />
            <em style={{ fontStyle: 'italic', color: '#b8a890' }}>He learnt from his.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#b8a890', lineHeight: 1.8, fontSize: '0.95rem' }}>
            <p>
              I started working with timber at sixteen, in my father's workshop in rural Victoria.
              I learnt early that wood isn't just a material — it has grain, scent, warmth, and a character entirely its own.
            </p>
            <p>
              Today, with over 25 years of experience, I still work piece by piece, by hand,
              with the same respect for the timber and the client that I learnt in that first workshop.
            </p>
            <p>
              I work primarily with Australian hardwoods — blackwood, spotted gum, Victorian ash, and jarrah —
              and with imported timbers when the project calls for it.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {['Blackwood', 'Spotted Gum', 'Vic Ash', 'Jarrah', 'Huon Pine', 'Teak'].map((m) => (
              <span
                key={m}
                style={{
                  fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
                  color: '#c4882a', border: '1px solid rgba(196,136,42,0.3)', padding: '0.3rem 0.8rem', borderRadius: '2px',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="py-24 md:py-32" style={{ background: '#1f160d' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-lg mb-16">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1rem' }}>
            What I Do
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              color: '#f0e6d0',
              letterSpacing: '-0.02em',
            }}
          >
            Services made with the time they deserve.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px" style={{ border: '1px solid rgba(196,136,42,0.12)', background: 'rgba(196,136,42,0.12)' }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              style={{ background: '#1f160d', padding: '2.5rem', transition: 'background 0.25s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#2a1e11')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#1f160d')}
            >
              <div style={{ fontSize: '1.4rem', color: '#c4882a', marginBottom: '1.2rem', lineHeight: 1 }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.3rem', color: '#f0e6d0', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}>
                {s.title}
              </h3>
              <p style={{ color: '#b8a890', lineHeight: 1.75, fontSize: '0.9rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState('Todos');
  const categories = ['All', 'Furniture', 'Joinery', 'Kitchen', 'Restoration'];
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="trabalhos" className="py-24 md:py-32" style={{ background: '#15100a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1rem' }}>
              Portfolio
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.1,
                color: '#f0e6d0',
                letterSpacing: '-0.02em',
              }}
            >
              Recent work.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
                  padding: '0.45rem 1rem', borderRadius: '2px', cursor: 'pointer', transition: 'all 0.2s',
                  color: filter === c ? '#15100a' : '#b8a890',
                  background: filter === c ? '#c4882a' : 'transparent',
                  border: filter === c ? '1px solid #c4882a' : '1px solid rgba(196,136,42,0.25)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: 'rgba(196,136,42,0.1)' }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden"
              style={{ background: '#15100a', cursor: 'pointer' }}
            >
              <img
                src={p.img}
                alt={p.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ height: '280px', background: '#2a1e11' }}
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-6"
                style={{
                  background: 'linear-gradient(to top, rgba(21,16,10,0.95) 30%, transparent 80%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0')}
              >
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4882a', marginBottom: '0.4rem' }}>
                  {p.category} · {p.year}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: '#f0e6d0' }}>
                  {p.title}
                </p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ border: '2px solid rgba(196,136,42,0.4)' }} />
              <div style={{ padding: '1rem 1.2rem', background: '#1a1208' }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4882a', marginBottom: '0.2rem' }}>
                  {p.category}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', color: '#f0e6d0' }}>
                  {p.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: '01', title: 'Consultation', desc: 'We arrange a free visit to understand your space, your needs, and your taste.' },
    { n: '02', title: 'Design & Quote', desc: 'We present a technical drawing and a detailed quote. No surprises, no hidden costs.' },
    { n: '03', title: 'Production', desc: 'Every piece is made in our Melbourne workshop. You\'re welcome to visit during the process.' },
    { n: '04', title: 'Delivery & Install', desc: 'We deliver, install, and aren\'t satisfied until you are.' },
  ];
  return (
    <section style={{ background: '#1f160d', borderTop: '1px solid rgba(196,136,42,0.12)' }} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-lg mb-16">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1rem' }}>
            How I Work
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: '#f0e6d0', letterSpacing: '-0.02em' }}>
            A simple process, no complications.
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-full w-full h-px" style={{ background: 'rgba(196,136,42,0.2)', transform: 'translateX(-50%)' }} />
              )}
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem', color: 'rgba(196,136,42,0.2)', lineHeight: 1, marginBottom: '1rem' }}>{s.n}</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: '#f0e6d0', marginBottom: '0.6rem' }}>{s.title}</h3>
              <p style={{ color: '#b8a890', fontSize: '0.88rem', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: 'Catherine Alvarez', loc: 'Fitzroy, Melbourne', text: 'Manuel built our fitted library and it\'s simply perfect. He respected our space to the millimetre and the quality is extraordinary.', stars: 5 },
    { name: 'James Mendez', loc: 'Geelong', text: 'He restored my grandmother\'s dining table. It looks brand new without losing any of its character. Impeccable work from a thoroughly trustworthy craftsman.', stars: 5 },
    { name: 'Sophie & Robert Costa', loc: 'Brunswick', text: 'The kitchen Manuel made for us completely transformed our home. The attention to detail is remarkable. We recommend him without hesitation.', stars: 5 },
  ];
  return (
    <section style={{ background: '#15100a', borderTop: '1px solid rgba(196,136,42,0.12)' }} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1rem' }}>
            Testimonials
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: '#f0e6d0', letterSpacing: '-0.02em' }}>
            What clients say.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} style={{ background: '#1f160d', border: '1px solid rgba(196,136,42,0.12)', padding: '2rem', borderRadius: '2px' }}>
              <div style={{ color: '#c4882a', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>{'★'.repeat(r.stars)}</div>
              <p style={{ color: '#b8a890', lineHeight: 1.8, fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{r.text}"</p>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#f0e6d0', fontSize: '0.95rem' }}>{r.name}</p>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4882a' }}>{r.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '', servico: '' });
  const [sent, setSent] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    width: '100%',
    background: '#2a1e11',
    border: '1px solid rgba(196,136,42,0.2)',
    borderRadius: '2px',
    padding: '0.85rem 1rem',
    color: '#f0e6d0',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#b8a890',
    fontWeight: 500,
    display: 'block',
    marginBottom: '0.5rem',
  };

  return (
    <section id="contacto" className="py-24 md:py-32" style={{ background: '#1f160d', borderTop: '1px solid rgba(196,136,42,0.12)' }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, marginBottom: '1rem' }}>
            Contact
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: '#f0e6d0', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            Let's talk about your project.
          </h2>
          <p style={{ color: '#b8a890', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            The initial consultation is free and without obligation. I respond to all enquiries within 24 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { label: 'Workshop', value: '14 Timber Lane, Collingwood VIC 3066' },
              { label: 'Phone', value: '+61 412 345 678' },
              { label: 'Email', value: 'manuel@ferreiracarpentry.com.au' },
              { label: 'Hours', value: 'Mon–Fri 8am–6pm · Sat 9am–1pm' },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4882a', fontWeight: 500, minWidth: '70px', paddingTop: '2px' }}>{c.label}</span>
                <span style={{ color: '#b8a890', fontSize: '0.92rem' }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {sent ? (
            <div style={{ background: '#2a1e11', border: '1px solid rgba(196,136,42,0.3)', padding: '3rem 2rem', borderRadius: '2px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#c4882a', marginBottom: '0.8rem' }}>Message received.</p>
              <p style={{ color: '#b8a890', lineHeight: 1.7 }}>Thank you for getting in touch. I'll be in contact shortly.</p>
            </div>
          ) : (
            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Name</label>
                  <input required style={inputStyle} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    onFocus={(e) => (e.target.style.borderColor = '#c4882a')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(196,136,42,0.2)')}
                    placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    onFocus={(e) => (e.target.style.borderColor = '#c4882a')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(196,136,42,0.2)')}
                    placeholder="+61 4xx xxx xxx" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = '#c4882a')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(196,136,42,0.2)')}
                  placeholder="your@email.com.au" />
              </div>
              <div>
                <label style={labelStyle}>Service</label>
                <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.servico}
                  onChange={(e) => setForm({ ...form, servico: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = '#c4882a')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(196,136,42,0.2)')}>
                  <option value="">Select a service</option>
                  <option>Bespoke Furniture</option>
                  <option>Restoration & Repair</option>
                  <option>Interior Joinery</option>
                  <option>Kitchens & Wardrobes</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea required rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = '#c4882a')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(196,136,42,0.2)')}
                  placeholder="Describe your project..." />
              </div>
              <button
                type="submit"
                style={{
                  background: '#c4882a', color: '#15100a', fontSize: '0.8rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', fontWeight: 600, padding: '1rem', borderRadius: '2px',
                  border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#e4a84a')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#c4882a')}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#0f0b06', borderTop: '1px solid rgba(196,136,42,0.12)', padding: '2.5rem 1.5rem' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#6a5c46' }}>
          © 2024 Manuel Ferreira · Carpenter & Cabinet Maker
        </p>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a3c2c' }}>
          Melbourne, Australia
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
