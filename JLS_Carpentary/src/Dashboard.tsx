import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  RefreshCcw,
  Save,
  Settings,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react'
import type { MediaAsset, SiteContent } from './siteContent'

export type DashboardProps = {
  isDarkMode: boolean
  onLogout: () => void
  onBackToSite: () => void
  siteContent: SiteContent
  onSaveContent: (content: SiteContent) => Promise<void>
  mediaAssets: MediaAsset[]
  onUploadMedia: (file: File, onProgress: (percent: number) => void) => Promise<string>
  mediaStatus: 'loading' | 'ready' | 'error'
  mediaError: string
  contentStatus: 'loading' | 'ready' | 'error'
  contentError: string
  onRetry: () => void
}

type TabKey = 'home' | 'services' | 'portfolio' | 'testimonials' | 'general'

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function joinLines(values: string[] | undefined): string {
  return (values ?? []).join('\n')
}

export default function Dashboard({
  isDarkMode,
  onLogout,
  onBackToSite,
  siteContent,
  onSaveContent,
  mediaAssets,
  onUploadMedia,
  mediaStatus,
  mediaError,
  contentStatus,
  contentError,
  onRetry,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [draft, setDraft] = useState<SiteContent>(siteContent)
  const [saveState, setSaveState] = useState<'saved' | 'unsaved' | 'saving'>('saved')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const [messageProjectIndex, setMessageProjectIndex] = useState<number | null>(null)
  const [saveError, setSaveError] = useState('')
  const dirty = useRef(false)
  const revision = useRef(0)
  const [uploadingProjectIndex, setUploadingProjectIndex] = useState<number | null>(null)
  const [activeMediaPicker, setActiveMediaPicker] = useState<{
    projectIndex: number
    mode: 'cover' | 'gallery'
  } | null>(null)

  useEffect(() => {
    if (!dirty.current) setDraft(siteContent)
  }, [siteContent])

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (dirty.current || isUploading) event.preventDefault()
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [isUploading])

  const leaveDashboard = (action: () => void) => {
    if ((dirty.current || isUploading || saveState === 'saving') && !window.confirm('Leave this page? Unsaved changes will be lost and an upload may be interrupted.')) return
    action()
  }

  const panelClass = isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900'
  const mutedClass = isDarkMode ? 'text-gray-400' : 'text-slate-600'
  const surfaceClass = isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
  const cardClass = isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
  const softCardClass = isDarkMode ? 'bg-gray-950/70 border-gray-800' : 'bg-slate-50 border-slate-200'

  const applyDraftChange = (updater: (current: SiteContent) => SiteContent) => {
    dirty.current = true
    revision.current++
    setDraft((current) => updater(current))
    setSaveError('')
    setSaveState((current) => current === 'saving' ? 'saving' : 'unsaved')
  }

  const handleSave = async () => {
    if (isUploading || contentStatus !== 'ready' || saveState === 'saving') return
    const savedRevision = revision.current
    try {
      setSaveError('')
      setSaveState('saving')
      await onSaveContent(draft)
      if (savedRevision === revision.current) {
        dirty.current = false
        setSaveState('saved')
      } else {
        setSaveState('unsaved')
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save changes. Your draft has been kept.')
      setSaveState('unsaved')
    }
  }

  const handleReset = () => {
    if (dirty.current && !window.confirm('Discard your unsaved changes?')) return
    dirty.current = false
    revision.current++
    setDraft(siteContent)
    setSaveError('')
    setSaveState('saved')
  }

  const assignProjectImage = (projectIndex: number, imageUrl: string, mode: 'cover' | 'gallery') => {
    applyDraftChange((current) => ({
      ...current,
      portfolio: {
        ...current.portfolio,
        items: current.portfolio.items.map((item, itemIndex) => {
          if (itemIndex !== projectIndex) {
            return item
          }

          const existingImages = item.images ?? []
          const nextImages = existingImages.includes(imageUrl) ? existingImages : [...existingImages, imageUrl]

          if (mode === 'cover') {
            return {
              ...item,
              image: imageUrl,
              images: nextImages,
            }
          }

          return {
            ...item,
            images: nextImages,
          }
        }),
      },
    }))
  }

  const handleProjectUpload = async (projectIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) {
      return
    }

    setUploadMessage('')
    setMessageProjectIndex(projectIndex)
    setIsUploading(true)
    setUploadProgress(0)
    setUploadingProjectIndex(projectIndex)

    try {
      const url = await onUploadMedia(file, setUploadProgress)
      assignProjectImage(projectIndex, url, 'cover')
      setUploadMessage('Image uploaded and set as project cover. Click Save changes to publish it.')
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Unable to upload this image. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadingProjectIndex(null)
      input.value = ''
    }
  }

  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'home', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { key: 'services', label: 'Services', icon: <FileText size={16} /> },
    { key: 'portfolio', label: 'Portfolio', icon: <ImageIcon size={16} /> },
    { key: 'testimonials', label: 'Testimonials', icon: <MessageSquareText size={16} /> },
    { key: 'general', label: 'General', icon: <Settings size={16} /> },
  ]

  const imageOptions = mediaAssets.map((asset) => ({ value: asset.url, label: asset.name }))

  const renderImageSelect = (value: string, onChange: (next: string) => void, label = 'Select from media library') => (
    <label className="space-y-1 block">
      <span className={`text-xs ${mutedClass}`}>{label}</span>
      <select
        disabled={mediaStatus !== 'ready'}
        value={imageOptions.some((item) => item.value === value) ? value : ''}
        onChange={(event) => {
          if (event.target.value) {
            onChange(event.target.value)
          }
        }}
        className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
      >
        <option value="">{mediaStatus === 'loading' ? 'Loading image library...' : mediaStatus === 'error' ? 'Image library unavailable' : imageOptions.length === 0 ? 'Upload an image in Portfolio first' : 'Select an uploaded image'}</option>
        {imageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )

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
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Primary button label</span>
              <input
                value={draft.home.primaryCtaLabel}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, primaryCtaLabel: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Secondary button label</span>
              <input
                value={draft.home.secondaryCtaLabel}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, secondaryCtaLabel: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Hero image URL</span>
              <input
                value={draft.home.heroImage}
                onChange={(event) => applyDraftChange((current) => ({ ...current, home: { ...current.home, heroImage: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          {renderImageSelect(draft.home.heroImage, (next) =>
            applyDraftChange((current) => ({ ...current, home: { ...current.home, heroImage: next } })),
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {draft.home.stats.map((stat, index) => (
              <div key={index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
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
              <div key={index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
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
                          itemIndex === index ? { ...item, features: splitLines(event.target.value).slice(0, 6) } : item
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

          <div className="grid gap-4">
            {draft.portfolio.items.map((project, index) => (
              <div key={index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-teal-600">Project {index + 1}</p>
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={project.isVisible !== false}
                      onChange={(event) => applyDraftChange((current) => ({
                        ...current,
                        portfolio: {
                          ...current.portfolio,
                          items: current.portfolio.items.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, isVisible: event.target.checked } : item,
                          ),
                        },
                      }))}
                    />
                    Show on homepage
                  </label>
                </div>

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
                </div>

                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Description</span>
                  <textarea
                    value={project.description ?? ''}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      portfolio: {
                        ...current.portfolio,
                        items: current.portfolio.items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: event.target.value } : item,
                        ),
                      },
                    }))}
                    rows={2}
                    className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </label>

                <div className="grid md:grid-cols-2 gap-3">
                  <label className="space-y-1 block">
                    <span className={`text-xs ${mutedClass}`}>Main image URL</span>
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

                  {renderImageSelect(project.image, (next) =>
                    applyDraftChange((current) => ({
                      ...current,
                      portfolio: {
                        ...current.portfolio,
                        items: current.portfolio.items.map((item, itemIndex) => (itemIndex === index ? { ...item, image: next } : item)),
                      },
                    })),
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-teal-700 transition-colors">
                    <Upload size={14} />
                    {isUploading && uploadingProjectIndex === index ? `Uploading... ${uploadProgress}%` : 'Upload to this project'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      className="hidden"
                      onChange={(event) => {
                        void handleProjectUpload(index, event)
                      }}
                      disabled={isUploading}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveMediaPicker((currentPicker) =>
                        currentPicker?.projectIndex === index && currentPicker.mode === 'cover'
                          ? null
                          : { projectIndex: index, mode: 'cover' },
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDarkMode ? 'border-gray-700 text-white hover:border-gray-500' : 'border-slate-300 text-slate-700 hover:border-slate-500'}`}
                  >
                    Choose cover from library
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveMediaPicker((currentPicker) =>
                        currentPicker?.projectIndex === index && currentPicker.mode === 'gallery'
                          ? null
                          : { projectIndex: index, mode: 'gallery' },
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${isDarkMode ? 'border-gray-700 text-white hover:border-gray-500' : 'border-slate-300 text-slate-700 hover:border-slate-500'}`}
                  >
                    Add gallery photo from library
                  </button>
                </div>

                {isUploading && uploadingProjectIndex === index && (
                  <div role="status" className="space-y-2 text-sm">
                    <p>{uploadProgress === 0 ? 'Preparing upload. Checking your connection and library access...' : uploadProgress === 100 ? 'Upload complete. Adding image to the library...' : `Uploading image: ${uploadProgress}%`}</p>
                    <progress value={uploadProgress} max={100} aria-label="Image upload progress" className="w-full accent-teal-600" />
                  </div>
                )}

                {uploadMessage && messageProjectIndex === index && (
                  <p role="status" className={`rounded-lg border px-3 py-2 text-sm ${softCardClass}`}>{uploadMessage}</p>
                )}

                {activeMediaPicker?.projectIndex === index && (
                  <div className={`rounded-xl border ${softCardClass} p-3 space-y-3`}>
                    <p className="text-xs text-teal-600 font-semibold">
                      {activeMediaPicker.mode === 'cover' ? 'Select a cover image' : 'Select an image to add to gallery'}
                    </p>
                    {mediaStatus === 'loading' && <p role="status" className={`text-sm ${mutedClass}`}>Loading image library...</p>}
                    {mediaStatus === 'error' && <div role="alert" className="text-sm"><p>{mediaError}</p><button type="button" onClick={onRetry} className="mt-2 underline">Try again</button></div>}
                    {mediaStatus === 'ready' && mediaAssets.length === 0 && <p className={`text-sm ${mutedClass}`}>Your library is empty. Use Upload to this project to add your first image.</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-56 overflow-auto pr-1">
                      {mediaAssets.map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          aria-label={activeMediaPicker.mode === 'cover' ? `Select ${asset.name} as cover` : `Add ${asset.name} to gallery`}
                          aria-pressed={activeMediaPicker.mode === 'cover' ? project.image === asset.url : (project.images ?? []).includes(asset.url)}
                          onClick={() => {
                            assignProjectImage(index, asset.url, activeMediaPicker.mode)
                            setActiveMediaPicker(null)
                            setMessageProjectIndex(index)
                            setUploadMessage(
                              activeMediaPicker.mode === 'cover'
                                ? 'Cover image selected from library.'
                                : 'Gallery image added from library.',
                            )
                          }}
                          className={`overflow-hidden rounded-lg border text-left ${isDarkMode ? 'border-gray-700 hover:border-teal-500' : 'border-slate-200 hover:border-teal-500'}`}
                        >
                          <img src={asset.url} alt={asset.name} className="h-20 w-full object-cover" />
                          <p className="px-2 py-1 text-[10px] truncate">{asset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="space-y-1 block">
                  <span className={`text-xs ${mutedClass}`}>Gallery images one URL per line</span>
                  <textarea
                    value={joinLines(project.images)}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      portfolio: {
                        ...current.portfolio,
                        items: current.portfolio.items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, images: splitLines(event.target.value) } : item,
                        ),
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

    if (activeTab === 'testimonials') {
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
              <div key={index} className={`rounded-2xl border ${softCardClass} p-4 space-y-3`}>
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

    if (activeTab === 'general') {
      return (
        <div className="space-y-8">
          <div className={`rounded-2xl border ${softCardClass} p-4 space-y-4`}>
            <h3 className="text-lg font-semibold">Instagram section</h3>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Instagram username (without @)</span>
              <input value={draft.instagram.handle} onChange={(event) => applyDraftChange((current) => ({ ...current, instagram: { ...current.instagram, handle: event.target.value.replace(/^@/, '').trim() } }))} className={`w-full rounded-lg border px-3 py-2 ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Title</span>
                <input
                  value={draft.instagram.title}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, instagram: { ...current.instagram, title: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Button label</span>
                <input
                  value={draft.instagram.buttonLabel}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, instagram: { ...current.instagram, buttonLabel: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Subtitle</span>
              <textarea
                value={draft.instagram.subtitle}
                onChange={(event) => applyDraftChange((current) => ({ ...current, instagram: { ...current.instagram, subtitle: event.target.value } }))}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>

          <div className={`rounded-2xl border ${softCardClass} p-4 space-y-4`}>
            <h3 className="text-lg font-semibold">About section</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Title</span>
                <input
                  value={draft.about.title}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, about: { ...current.about, title: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Image URL</span>
                <input
                  value={draft.about.image}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, about: { ...current.about, image: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            {renderImageSelect(draft.about.image, (next) =>
              applyDraftChange((current) => ({ ...current, about: { ...current.about, image: next } })),
            )}
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Paragraph one</span>
              <textarea
                value={draft.about.paragraphOne}
                onChange={(event) => applyDraftChange((current) => ({ ...current, about: { ...current.about, paragraphOne: event.target.value } }))}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Paragraph two</span>
              <textarea
                value={draft.about.paragraphTwo}
                onChange={(event) => applyDraftChange((current) => ({ ...current, about: { ...current.about, paragraphTwo: event.target.value } }))}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Highlights title</span>
              <input
                value={draft.about.highlightsTitle}
                onChange={(event) => applyDraftChange((current) => ({ ...current, about: { ...current.about, highlightsTitle: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {draft.about.highlights.map((highlight, index) => (
                <div key={index} className={`rounded-xl border ${softCardClass} p-3 space-y-2`}>
                  <p className="text-xs font-semibold text-teal-600">Highlight {index + 1}</p>
                  <input
                    value={highlight.title}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      about: {
                        ...current.about,
                        highlights: current.about.highlights.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: event.target.value } : item,
                        ),
                      },
                    }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <textarea
                    value={highlight.desc}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      about: {
                        ...current.about,
                        highlights: current.about.highlights.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, desc: event.target.value } : item,
                        ),
                      },
                    }))}
                    rows={3}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border ${softCardClass} p-4 space-y-4`}>
            <h3 className="text-lg font-semibold">Contact section</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Title</span>
                <input
                  value={draft.contact.title}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, title: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Subtitle</span>
                <input
                  value={draft.contact.subtitle}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, subtitle: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>WhatsApp number</span>
                <input
                  value={draft.contact.whatsappNumber}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, whatsappNumber: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>SMS number</span>
                <input
                  value={draft.contact.smsNumber}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, smsNumber: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Quote title</span>
                <input
                  value={draft.contact.quoteTitle}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, quoteTitle: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>WhatsApp button label</span>
                <input
                  value={draft.contact.whatsappButtonLabel}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, whatsappButtonLabel: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Quote description</span>
              <textarea
                value={draft.contact.quoteDescription}
                onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, quoteDescription: event.target.value } }))}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>WhatsApp message</span>
              <textarea
                value={draft.contact.whatsappMessage}
                onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, whatsappMessage: event.target.value } }))}
                rows={2}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>SMS button label</span>
              <input
                value={draft.contact.smsButtonLabel}
                onChange={(event) => applyDraftChange((current) => ({ ...current, contact: { ...current.contact, smsButtonLabel: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {draft.contact.cards.map((card, index) => (
                <div key={index} className={`rounded-xl border ${softCardClass} p-3 space-y-2`}>
                  <input
                    value={card.label}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        cards: current.contact.cards.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: event.target.value } : item,
                        ),
                      },
                    }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <input
                    value={card.value}
                    onChange={(event) => applyDraftChange((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        cards: current.contact.cards.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: event.target.value } : item,
                        ),
                      },
                    }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border ${softCardClass} p-4 space-y-4`}>
            <h3 className="text-lg font-semibold">Footer section</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Brand title</span>
                <input
                  value={draft.footer.brandTitle}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, brandTitle: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Copyright name</span>
                <input
                  value={draft.footer.copyrightName}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, copyrightName: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Brand description</span>
              <input
                value={draft.footer.brandDescription}
                onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, brandDescription: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Contact phone</span>
                <input
                  value={draft.footer.contactPhone}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, contactPhone: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Contact email</span>
                <input
                  value={draft.footer.contactEmail}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, contactEmail: event.target.value } }))}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Services footer one per line</span>
                <textarea
                  value={draft.footer.services.join('\n')}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, services: splitLines(event.target.value) } }))}
                  rows={4}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
              <label className="space-y-1 block">
                <span className={`text-xs ${mutedClass}`}>Company footer one per line</span>
                <textarea
                  value={draft.footer.company.join('\n')}
                  onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, company: splitLines(event.target.value) } }))}
                  rows={4}
                  className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Follow label</span>
              <input
                value={draft.footer.followLabel}
                onChange={(event) => applyDraftChange((current) => ({ ...current, footer: { ...current.footer, followLabel: event.target.value } }))}
                className={`w-full rounded-lg border px-3 py-2 outline-none transition ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </label>
          </div>
        </div>
      )
    }

    return null
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
            onClick={() => leaveDashboard(onBackToSite)}
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
              {tabs.map((item) => (
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
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">Complete control over text and images.</h2>
                  <p className={`max-w-2xl ${mutedClass}`}>
                    Manage all site content and choose exactly which images appear on the homepage.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isUploading || saveState === 'saving' || contentStatus !== 'ready'}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${isDarkMode ? 'border-gray-800 text-white hover:bg-gray-800' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                  >
                    <RefreshCcw size={16} />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saveState === 'saving' || isUploading || contentStatus !== 'ready'}
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

              {contentStatus === 'loading' && <p role="status">Loading website content...</p>}
              {contentStatus === 'error' && <div role="alert" className="mb-4 space-y-2 text-sm"><p>{contentError}</p><p>Your draft has been kept. Loading must succeed before you can save.</p><button type="button" onClick={onRetry} className="underline">Try again</button></div>}
              {saveError && <p role="alert" className="mb-4 text-sm text-red-500">{saveError}</p>}
              {isUploading && <p role="status" className="mb-4 text-sm">Image upload in progress ({uploadProgress}%). Save changes will be available when it finishes.</p>}
              <fieldset disabled={contentStatus !== 'ready'} className="min-w-0 space-y-4 disabled:opacity-60">
                {renderTabContent()}
              </fieldset>
            </section>
          </main>
        </div>
      </div>

      <button
        type="button"
        onClick={() => leaveDashboard(onLogout)}
        className={`fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold shadow-lg transition ${isDarkMode ? 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-800' : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  )
}
