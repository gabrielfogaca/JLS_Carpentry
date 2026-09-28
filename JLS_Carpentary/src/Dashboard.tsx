import { useEffect, useState } from 'react'
import { ArrowLeft, BarChart3, CalendarDays, FileText, Image as ImageIcon, LayoutDashboard, LogOut, MessageSquareText, RefreshCcw, Save, Settings, Sparkles, UserRound } from 'lucide-react'
import type { SiteContent } from './siteContent'

export type DashboardProps = {
  isDarkMode: boolean
  onLogout: () => void
  siteContent: SiteContent
  onSaveContent: (content: SiteContent) => Promise<void>
}

type TabKey = 'home' | 'services' | 'portfolio' | 'testimonials'

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function Dashboard({ isDarkMode, onLogout, siteContent, onSaveContent }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [draft, setDraft] = useState<SiteContent>(siteContent)
  const [saveState, setSaveState] = useState<'saved' | 'unsaved' | 'saving'>('saved')

  useEffect(() => {
    setDraft(siteContent)
    setSaveState('saved')
  }, [siteContent])

  const panelClass = isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900'
  const mutedClass = isDarkMode ? 'text-gray-400' : 'text-slate-600'
  const surfaceClass = isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
  const cardClass = isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
  const softCardClass = isDarkMode ? 'bg-gray-950/70 border-gray-800' : 'bg-slate-50 border-slate-200'

  const applyDraftChange = (updater: (current: SiteContent) => SiteContent) => {
    setDraft((current) => updater(current))
    setSaveState('unsaved')
  }

  const handleSave = async () => {
    try {
      setSaveState('saving')
      await onSaveContent(draft)
      setSaveState('saved')
    } catch {
      setSaveState('unsaved')
    }
  }

  const handleReset = () => {
    setDraft(siteContent)
    setSaveState('saved')
  }

  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'home', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { key: 'services', label: 'Services', icon: <FileText size={16} /> },
    { key: 'portfolio', label: 'Portfolio', icon: <ImageIcon size={16} /> },
    { key: 'testimonials', label: 'Testimonials', icon: <MessageSquareText size={16} /> },
  ]

  const renderTabContent = () => {
    if (activeTab === 'home') {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Eyebrow</span>
              <input
                value={draft.home.eyebrow}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, eyebrow: event.target.value } }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Highlighted line</span>
              <input
                value={draft.home.highlight}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, highlight: event.target.value } }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Hero title</span>
              <input
                value={draft.home.title}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, title: event.target.value } }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Description</span>
              <textarea
                value={draft.home.description}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, description: event.target.value } }))}
                rows={4}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {draft.home.stats.map((stat, index) => (
              <div key={stat.label} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
                <p className="text-sm font-semibold text-teal-600">Stat {index + 1}</p>
                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Value</span>
                  <input
                    value={stat.value}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      home: {
                        ...current.home,
                        stats: current.home.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, value: event.target.value } : item)),
                      },
                    }))}
                    className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </label>
                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Label</span>
                  <input
                    value={stat.label}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      home: {
                        ...current.home,
                        stats: current.home.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item)),
                      },
                    }))}
                    className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (activeTab === 'services') {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Section title</span>
              <input
                value={draft.services.title}
                onChange={(event) => applyDraftChange((current) => ({ ...current, services: { ...current.services, title: event.target.value } }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Subtitle</span>
              <textarea
                value={draft.services.subtitle}
                onChange={(event) => applyDraftChange((current) => ({ ...current, services: { ...current.services, subtitle: event.target.value } }))}
                rows={3}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          <div className="grid xl:grid-cols-2 gap-4">
            {draft.services.items.map((service, index) => (
              <div key={service.title + index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
                <p className="text-sm font-semibold text-teal-600">Service {index + 1}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Title</span>
                    <input
                      value={service.title}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        services: {
                          ...current.services,
                          items: current.services.items.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Icon</span>
                    <input
                      value={service.icon}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        services: {
                          ...current.services,
                          items: current.services.items.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                </div>
                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Description</span>
                  <textarea
                    value={service.description}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      services: {
                        ...current.services,
                        items: current.services.items.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)),
                      },
                    }))}
                    rows={3}
                    className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </label>
                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Features one per line</span>
                  <textarea
                    value={service.features.join('\n')}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      services: {
                        ...current.services,
                        items: current.services.items.map((item, itemIndex) => (
                          itemIndex === index ? { ...item, features: splitLines(event.target.value).slice(0, 3) } : item
                        )),
                      },
                    }))}
                    rows={4}
                    className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (activeTab === 'portfolio') {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Section title</span>
              <input
                value={draft.portfolio.title}
                onChange={(event) => applyDraftChange((current) => ({ ...current, portfolio: { ...current.portfolio, title: event.target.value } }))}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-2 block">
              <span className={`text-sm font-medium ${mutedClass}`}>Subtitle</span>
              <textarea
                value={draft.portfolio.subtitle}
                onChange={(event) => applyDraftChange((current) => ({ ...current, portfolio: { ...current.portfolio, subtitle: event.target.value } }))}
                rows={3}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          <div className="grid xl:grid-cols-2 gap-4">
            {draft.portfolio.items.map((project, index) => (
              <div key={project.title + index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
                <p className="text-sm font-semibold text-teal-600">Project {index + 1}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Title</span>
                    <input
                      value={project.title}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        portfolio: {
                          ...current.portfolio,
                          items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Client</span>
                    <input
                      value={project.client}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        portfolio: {
                          ...current.portfolio,
                          items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, client: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Type</span>
                    <input
                      value={project.type}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        portfolio: {
                          ...current.portfolio,
                          items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, type: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Image URL</span>
                    <input
                      value={project.image}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        portfolio: {
                          ...current.portfolio,
                          items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, image: event.target.value } : item)),
                        },
                      }))}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2 block">
            <span className={`text-sm font-medium ${mutedClass}`}>Section title</span>
            <input
              value={draft.testimonials.title}
              onChange={(event) => applyDraftChange((current) => ({ ...current, testimonials: { ...current.testimonials, title: event.target.value } }))}
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
          </label>
          <label className="space-y-2 block">
            <span className={`text-sm font-medium ${mutedClass}`}>Subtitle</span>
            <textarea
              value={draft.testimonials.subtitle}
              onChange={(event) => applyDraftChange((current) => ({ ...current, testimonials: { ...current.testimonials, subtitle: event.target.value } }))}
              rows={3}
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
          </label>
        </div>

        <div className="grid xl:grid-cols-3 gap-4">
          {draft.testimonials.items.map((testimonial, index) => (
            <div key={testimonial.name + index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
              <p className="text-sm font-semibold text-teal-600">Testimonial {index + 1}</p>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Name</span>
                <input
                  value={testimonial.name}
                  onChange={(event) => applyDraftChange((current) => ({
                    ...current,
                    testimonials: {
                      ...current.testimonials,
                      items: current.testimonials.items.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)),
                    },
                  }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Role</span>
                <input
                  value={testimonial.role}
                  onChange={(event) => applyDraftChange((current) => ({
                    ...current,
                    testimonials: {
                      ...current.testimonials,
                      items: current.testimonials.items.map((item, itemIndex) => (itemIndex === index ? { ...item, role: event.target.value } : item)),
                    },
                  }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Rating</span>
                <select
                  value={testimonial.rating}
                  onChange={(event) => applyDraftChange((current) => ({
                    ...current,
                    testimonials: {
                      ...current.testimonials,
                      items: current.testimonials.items.map((item, itemIndex) => (itemIndex === index ? { ...item, rating: Number(event.target.value) } : item)),
                    },
                  }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Text</span>
                <textarea
                  value={testimonial.text}
                  onChange={(event) => applyDraftChange((current) => ({
                    ...current,
                    testimonials: {
                      ...current.testimonials,
                      items: current.testimonials.items.map((item, itemIndex) => (itemIndex === index ? { ...item, text: event.target.value } : item)),
                    },
                  }))}
                  rows={4}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${surfaceClass} ${textClass}`}>
      <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-950/85' : 'border-slate-200 bg-white/85'} backdrop-blur sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-600">JLS Carpentry</p>
              <h1 className="text-2xl font-bold">Content Dashboard</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 transition"
          >
            <ArrowLeft size={18} />
            Back to site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className={`${panelClass} rounded-2xl border p-6 shadow-sm h-fit sticky top-24`}>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white flex items-center justify-center shadow-lg shrink-0">
                <UserRound size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-teal-600">Logged in as</p>
                <p className="font-bold">JLS Admin</p>
                <p className={`text-sm ${mutedClass}`}>Content editor</p>
              </div>
            </div>

            <div className="space-y-3">
              {[{ icon: <LayoutDashboard size={18} />, label: 'Home', key: 'home' as TabKey }, { icon: <FileText size={18} />, label: 'Services', key: 'services' as TabKey }, { icon: <ImageIcon size={18} />, label: 'Portfolio', key: 'portfolio' as TabKey }, { icon: <MessageSquareText size={18} />, label: 'Testimonials', key: 'testimonials' as TabKey }].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${activeTab === item.key ? 'bg-teal-600 text-white' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}
                >
                  <span className={activeTab === item.key ? 'text-white' : 'text-teal-600'}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className={`mt-8 rounded-2xl border ${softCardClass} p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Status</p>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${saveState === 'saved' ? 'bg-emerald-500/10 text-emerald-600' : saveState === 'saving' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {saveState === 'saved' ? 'Saved' : saveState === 'saving' ? 'Saving' : 'Unsaved'}
                </span>
              </div>
              <p className={`text-sm ${mutedClass}`}>Edits are stored in Firebase after you click Save.</p>
            </div>
          </aside>

          <main className="space-y-8">
            <section className={`${cardClass} rounded-2xl border p-8 shadow-sm overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-cyan-500/10 pointer-events-none`} />
              <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
                <div className="space-y-4 max-w-3xl">
                  <p className="text-sm font-semibold text-teal-600 mb-2">Website content manager</p>
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">Update your public site from one place.</h2>
                  <p className={`max-w-2xl ${mutedClass}`}>
                    Edit the Home, Services, Portfolio, and Testimonials sections. The changes are reflected on the main site immediately after saving.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${isDarkMode ? 'border-gray-800 text-white hover:bg-gray-800' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                  >
                    <RefreshCcw size={16} />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saveState === 'saving'}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 transition"
                  >
                    <Save size={16} />
                    {saveState === 'saving' ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            </section>

            <section className={`${cardClass} rounded-2xl border p-6 shadow-sm`}>
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-teal-600 text-white' : isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {renderTabContent()}
            </section>
          </main>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className={`fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold shadow-lg transition ${isDarkMode ? 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-800' : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  )
}
