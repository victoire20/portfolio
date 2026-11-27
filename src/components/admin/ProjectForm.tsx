import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'
import createProject from '../../hooks/createProject'
import type { CatalogItem } from './ProjectCatalogPage'
import './ProjectForm.css'

type ProjectStatus = 'In progress' | 'Done'

type ProjectDraft = {
  title: string
  descriptionFr: string
  descriptionEn: string
  cover: string
  isPrivate: boolean
  liveUrl: string
  githubUrl: string
  maquetteSupport: string
  maquetteUrl: string
  isSmallProject: boolean
  startedAt: string
  endedAt: string
  status: ProjectStatus
  skillIds: CatalogItem['id'][]
  targetIds: CatalogItem['id'][]
  projectTypeIds: CatalogItem['id'][]
}

type Notification = {
  type: 'success' | 'error'
  message: string
}

export type ProjectEditSource = {
  id: number
  name: string
  thumbnail?: string
  type: string
  target: string
  status: ProjectStatus
  started: string
  ended: string
}

type ProjectFormProps = {
  mode: 'create' | 'edit'
  initialProject?: ProjectEditSource
}

type CloudinaryWidgetResult = {
  event?: string
  info?: { secure_url?: unknown }
}

type CloudinaryApi = {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result?: CloudinaryWidgetResult) => void,
  ) => { open: () => void }
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function createDraft(project?: ProjectEditSource): ProjectDraft {
  return {
    title: project?.name ?? '',
    descriptionFr: '',
    descriptionEn: '',
    cover: project?.thumbnail ?? '',
    isPrivate: false,
    liveUrl: '',
    githubUrl: '',
    maquetteSupport: '',
    maquetteUrl: '',
    isSmallProject: false,
    startedAt: project?.started ?? '',
    endedAt: project?.ended ?? '',
    status: project?.status ?? 'In progress',
    skillIds: [],
    targetIds: [],
    projectTypeIds: [],
  }
}

export default function ProjectForm({ mode, initialProject }: ProjectFormProps) {
  const [draft, setDraft] = useState(() => createDraft(initialProject))
  const skills = useSupabaseCatalog('skills')
  const targets = useSupabaseCatalog('targets')
  const projectTypes = useSupabaseCatalog('project_types')
  const [widgetReady, setWidgetReady] = useState(false)
  const [widgetError, setWidgetError] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!cloudName || !uploadPreset) return

    let active = true
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js'
    script.async = true
    script.onload = () => {
      if (active) setWidgetReady(true)
    }
    script.onerror = () => {
      if (active) setWidgetError('Cloudinary Upload Widget could not be loaded.')
    }
    document.head.appendChild(script)

    return () => {
      active = false
      script.remove()
    }
  }, [])

  function openCloudinaryWidget() {
    const cloudinary = (window as Window & { cloudinary?: CloudinaryApi }).cloudinary
    if (!cloudinary || !cloudName || !uploadPreset) {
      setWidgetError('Configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable image uploads.')
      return
    }

    setWidgetError(null)
    const widget = cloudinary.createUploadWidget({
      cloudName,
      uploadPreset,
      resourceType: 'image',
      sources: ['local'],
      multiple: false,
      maxFiles: 1,
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      maxImageFileSize: 10_000_000,
      maxImageWidth: 1920,
      maxImageHeight: 1080,
      cropping: true,
      croppingAspectRatio: 16 / 9,
      showSkipCropButton: false,
      showUploadMoreButton: false,
    }, (error, result) => {
      if (error) {
        setWidgetError(error instanceof Error ? error.message : 'Cloudinary image upload failed.')
        return
      }
      const secureUrl = result?.info?.secure_url
      if (result?.event === 'success' && typeof secureUrl === 'string') {
        setDraft((current) => ({ ...current, cover: secureUrl }))
      }
    })
    widget.open()
  }

  function toggleSelection(
    field: 'skillIds' | 'targetIds' | 'projectTypeIds',
    id: CatalogItem['id'],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((selectedId) => selectedId !== id)
        : [...current[field], id],
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode !== 'create' || submitting) return

    if (
      !draft.title.trim()
      || !draft.descriptionFr.trim()
      || !draft.descriptionEn.trim()
    ) {
      setNotification({
        type: 'error',
        message: 'Enter a project title and the description in both French and English.',
      })
      return
    }

    const invalidUrl = [draft.liveUrl, draft.githubUrl, draft.maquetteUrl]
      .some((value) => value.trim() && !isValidUrl(value.trim()))
    if (invalidUrl) {
      setNotification({ type: 'error', message: 'Enter a valid URL or leave the optional URL field empty.' })
      return
    }
    if (draft.startedAt && draft.endedAt && draft.endedAt < draft.startedAt) {
      setNotification({ type: 'error', message: 'The end date must be on or after the start date.' })
      return
    }

    setSubmitting(true)
    setNotification(null)
    createProject(draft)
      .then(() => {
        setDraft(createDraft())
        setNotification({ type: 'success', message: 'Project added successfully.' })
      })
      .catch((error: unknown) => {
        setNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Could not add the project.',
        })
      })
      .finally(() => setSubmitting(false))
  }

  const optionErrors = [
    skills.error && `Skills: ${skills.error}`,
    targets.error && `Targets: ${targets.error}`,
    projectTypes.error && `Project types: ${projectTypes.error}`,
  ].filter(Boolean)

  return (
    <div className="project-form-page">
      <header className="project-form-page__header">
        <div>
          <h1>{mode === 'create' ? 'Add new project' : 'Edit project'}</h1>
          <p>Prepare project details and choose the related skills, targets and types.</p>
        </div>
      </header>

      {mode === 'edit' && !initialProject && (
        <p className="project-form__notice" role="status">
          Open this form from a project row to load its current details. No project data was changed.
        </p>
      )}
      {optionErrors.length > 0 && (
        <div className="project-form__error" role="alert">
          {optionErrors.map((message) => <p key={message}>{message}</p>)}
        </div>
      )}
      {notification && (
        <div className={`project-form__notification project-form__notification--${notification.type}`} role={notification.type === 'error' ? 'alert' : 'status'}>
          <span>{notification.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      <form className="project-form" noValidate onSubmit={handleSubmit}>
        <section className="project-form__section">
          <h2>Project details</h2>
          <label>
            Title
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} disabled={submitting} />
          </label>
          <label>
            Description (French)
            <textarea rows={4} value={draft.descriptionFr} onChange={(event) => setDraft({ ...draft, descriptionFr: event.target.value })} disabled={submitting} />
          </label>
          <label>
            Description (English)
            <textarea rows={4} value={draft.descriptionEn} onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })} disabled={submitting} />
          </label>
          <div className="project-form__grid">
            <label>
              Status
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ProjectStatus })} disabled={submitting}>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </select>
            </label>
            <label>
              Started at (optional)
              <input type="date" value={draft.startedAt} onChange={(event) => setDraft({ ...draft, startedAt: event.target.value })} disabled={submitting} />
            </label>
            <label>
              Ended at (optional)
              <input type="date" min={draft.startedAt || undefined} value={draft.endedAt} onChange={(event) => setDraft({ ...draft, endedAt: event.target.value })} disabled={submitting} />
            </label>
          </div>
          <div className="project-form__checkboxes">
            <label>
              <input type="checkbox" checked={draft.isPrivate} onChange={(event) => setDraft({ ...draft, isPrivate: event.target.checked })} disabled={submitting} />
              Private project
            </label>
            <label>
              <input type="checkbox" checked={draft.isSmallProject} onChange={(event) => setDraft({ ...draft, isSmallProject: event.target.checked })} disabled={submitting} />
              Small project
            </label>
          </div>
        </section>

        <section className="project-form__section">
          <h2>Cover image (optional)</h2>
          <p className="project-form__help">Cloudinary lets you crop the image before upload and resize large images to a maximum of 1920 × 1080.</p>
          {draft.cover && (
            <img className="project-form__cover-preview" src={draft.cover} alt="Project cover preview" />
          )}
          <button className="project-form__button project-form__button--outline" type="button" onClick={openCloudinaryWidget} disabled={!widgetReady || submitting}>
            {draft.cover ? 'Replace cover image' : 'Choose and crop image'}
          </button>
          {!cloudName || !uploadPreset
            ? <p className="project-form__help">Set the Cloudinary cloud name and unsigned upload preset in the Vite environment to enable uploads.</p>
            : !widgetReady && <p className="project-form__help">Loading Cloudinary image tools…</p>}
          {widgetError && <p className="project-form__error" role="alert">{widgetError}</p>}
        </section>

        <section className="project-form__section">
          <h2>Links</h2>
          <div className="project-form__grid">
            <label>
              Live URL (optional)
              <input type="url" value={draft.liveUrl} onChange={(event) => setDraft({ ...draft, liveUrl: event.target.value })} disabled={submitting} />
            </label>
            <label>
              GitHub URL (optional)
              <input type="url" value={draft.githubUrl} onChange={(event) => setDraft({ ...draft, githubUrl: event.target.value })} disabled={submitting} />
            </label>
            <label>
              Maquette support (optional)
              <input value={draft.maquetteSupport} onChange={(event) => setDraft({ ...draft, maquetteSupport: event.target.value })} disabled={submitting} />
            </label>
            <label>
              Maquette URL (optional)
              <input type="url" value={draft.maquetteUrl} onChange={(event) => setDraft({ ...draft, maquetteUrl: event.target.value })} disabled={submitting} />
            </label>
          </div>
        </section>

        <section className="project-form__section">
          <h2>Related records</h2>
          <div className="project-form__relations">
            <CatalogPicker
              title="Skills"
              items={skills.items.filter((item) => item.status === 'Enabled')}
              selectedIds={draft.skillIds}
              loading={skills.loading}
              disabled={submitting}
              onToggle={(id) => toggleSelection('skillIds', id)}
            />
            <CatalogPicker
              title="Targets"
              items={targets.items.filter((item) => item.status === 'Enabled')}
              selectedIds={draft.targetIds}
              loading={targets.loading}
              disabled={submitting}
              onToggle={(id) => toggleSelection('targetIds', id)}
            />
            <CatalogPicker
              title="Project types"
              items={projectTypes.items.filter((item) => item.status === 'Enabled')}
              selectedIds={draft.projectTypeIds}
              loading={projectTypes.loading}
              disabled={submitting}
              onToggle={(id) => toggleSelection('projectTypeIds', id)}
            />
          </div>
        </section>

        {mode === 'edit' && (
          <p className="project-form__notice" role="status">
            Project updates are not enabled yet; no changes will be written.
          </p>
        )}
        <footer className="project-form__footer">
          <Link className="project-form__button project-form__button--outline" to="/admin/projects" onClick={(event) => {
            if (submitting) event.preventDefault()
          }}>Cancel</Link>
          <button className="project-form__button project-form__button--primary" type="submit" disabled={mode !== 'create' || submitting}>
            {mode === 'create' ? submitting ? 'Adding…' : 'Add project' : 'Save changes'}
          </button>
        </footer>
      </form>
    </div>
  )
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function CatalogPicker({
  title,
  items,
  selectedIds,
  loading,
  disabled,
  onToggle,
}: {
  title: string
  items: CatalogItem[]
  selectedIds: CatalogItem['id'][]
  loading: boolean
  disabled: boolean
  onToggle: (id: CatalogItem['id']) => void
}) {
  return (
    <fieldset className="project-form__picker">
      <legend>{title}</legend>
      {loading && <p className="project-form__help">Loading {title.toLowerCase()}…</p>}
      {!loading && items.length === 0 && <p className="project-form__help">No active {title.toLowerCase()} available.</p>}
      {items.map((item) => (
        <label key={item.id}>
          <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => onToggle(item.id)} disabled={disabled} />
          <span>{item.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
