/**
 * DIY settings panel: accent/button/text color pickers plus per-agent
 * wallpaper SET management (add local images, URLs, or gradient presets;
 * remove; auto-advance interval). Every change applies immediately and
 * persists to localStorage.
 */

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  ACCENT_PRESETS, BUTTON_PRESETS, TEXT_PRESETS, WALLPAPER_PRESETS,
  applySettings, clearSettings, loadSettings, saveSettings, syncWallpaperTimer,
  type DiySettings,
} from './diy-store.ts'
import type { ContactsSnapshot } from './contacts-store.ts'
import css from './DiyPanel.module.css'

/** Maximum encoded data-URL length kept small enough for localStorage (UTF-16 doubles it). */
const WALLPAPER_BUDGET = 1_500_000

/** Encode a canvas as WebP, falling back to JPEG when unsupported. */
function encodeCanvas(canvas: HTMLCanvasElement, quality: number): string {
  let dataUrl = canvas.toDataURL('image/webp', quality)
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }
  return dataUrl
}

/**
 * Scale an image to a wallpaper-sized data URL, stepping down edge/quality
 * until it fits the storage budget.
 * @param img - the decoded image.
 * @returns a compressed data URL.
 */
function scaledWallpaper(img: HTMLImageElement): string {
  for (const [edge, quality] of [[1280, 0.82], [960, 0.72]] as const) {
    const scale = Math.min(1, edge / Math.max(img.width, img.height))
    const width = Math.max(1, Math.round(img.width * scale))
    const height = Math.max(1, Math.round(img.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (context === null) throw new Error('Canvas 不可用')
    context.drawImage(img, 0, 0, width, height)
    const dataUrl = encodeCanvas(canvas, quality)
    if (dataUrl.length <= WALLPAPER_BUDGET) return dataUrl
  }
  throw new Error('图片过大，请换一张尺寸小一点的图片')
}

/**
 * Read a local image file and compress it to a data URL.
 * @param file - the picked image file.
 * @returns a data URL usable as a CSS background-image value.
 */
function fileToWallpaper(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => { reject(new Error('读取文件失败')) }
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => { reject(new Error('图片解码失败（请使用 JPG/PNG/WebP 格式）')) }
      img.onload = () => {
        try {
          resolve(scaledWallpaper(img))
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export interface DiyPanelProps {
  /** Whether the dialog is showing. */
  open: boolean
  /** Close the dialog (Escape or mask click). */
  onClose: () => void
  /** Agent preset roster for the per-agent wallpaper target picker. */
  roster: ContactsSnapshot
}

/** Wallpaper target: 'default' or an agent preset id. */
type WallpaperTarget = 'default' | string

/**
 * The wallpaper list for the active target (default keeps at most one).
 */
function listFor(settings: DiySettings, target: WallpaperTarget): string[] {
  if (target === 'default') {
    return settings.wallpaper === undefined ? [] : [settings.wallpaper]
  }
  const entry = settings.perAgent?.[target]
  if (entry === undefined) return []
  return Array.isArray(entry) ? [...entry] : [entry]
}

/**
 * Render the DIY settings dialog.
 * @param props - open state, close callback, and the agent roster.
 * @returns the modal, or null while closed.
 */
export function DiyPanel({ open, onClose, roster }: DiyPanelProps) {
  const [settings, setSettings] = useState<DiySettings>(() => loadSettings())
  const [target, setTarget] = useState<WallpaperTarget>('default')
  const [list, setList] = useState<string[]>([])
  const [draftUrl, setDraftUrl] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Re-read persisted settings each time the dialog opens.
  useEffect(() => {
    if (!open) return
    const loaded = loadSettings()
    setSettings(loaded)
    setTarget('default')
    setList(listFor(loaded, 'default'))
    setDraftUrl('')
    setLocalError(null)
  }, [open])

  const update = (patch: Partial<DiySettings>): void => {
    const next = { ...settings, ...patch }
    setSettings(next)
    // Live preview against the active target.
    applySettings(next, target === 'default' ? undefined : target, 0)
    saveSettings(next)
  }

  /** Clear the chat text color (back to the theme's own value). */
  const clearTextColor = (): void => {
    const next = { ...settings }
    delete next.textColor
    setSettings(next)
    applySettings(next, target === 'default' ? undefined : target)
    saveSettings(next)
  }

  /** Persist the active target's wallpaper list (default keeps a single value). */
  const saveList = (nextList: string[]): void => {
    const next = { ...settings }
    if (target === 'default') {
      if (nextList.length > 0 && nextList[0] !== undefined) next.wallpaper = nextList[0]
      else delete next.wallpaper
    } else {
      const perAgent = { ...(settings.perAgent ?? {}) }
      if (nextList.length > 0) perAgent[target] = nextList
      else delete perAgent[target]
      next.perAgent = perAgent
    }
    setSettings(next)
    applySettings(next, target === 'default' ? undefined : target, 0)
    saveSettings(next)
    syncWallpaperTimer()
  }

  /** Append one wallpaper to the active target's set. */
  const addWallpaper = (value: string): void => {
    const nextList = [...list, value]
    setList(nextList)
    saveList(nextList)
  }

  /** Remove one wallpaper from the active target's set. */
  const removeWallpaperAt = (index: number): void => {
    const nextList = list.filter((_, i) => i !== index)
    setList(nextList)
    saveList(nextList)
  }

  /** Clear the active target's whole set. */
  const clearWallpapers = (): void => {
    setList([])
    saveList([])
  }

  const onTargetChange = (next: WallpaperTarget): void => {
    setTarget(next)
    setList(listFor(settings, next))
    setDraftUrl('')
    setLocalError(null)
  }

  /** Pick local images, compress them, and append them to the set. */
  const onFilesPicked = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = [...(event.target.files ?? [])]
    event.target.value = '' // allow re-picking the same files
    if (files.length === 0) return
    try {
      const added: string[] = []
      for (const file of files) added.push(await fileToWallpaper(file))
      const nextList = [...list, ...added]
      setList(nextList)
      setLocalError(null)
      saveList(nextList)
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : String(error))
    }
  }

  const reset = (): void => {
    setSettings({})
    setList([])
    setDraftUrl('')
    setLocalError(null)
    applySettings({})
    clearSettings()
    syncWallpaperTimer()
  }

  /** Auto-advance interval (seconds; 0 = manual). */
  const intervalSec = settings.wallpaperInterval ?? 0
  const setIntervalSec = (value: number): void => {
    const n = Math.max(0, Math.floor(value))
    const next = { ...settings }
    if (n > 0) next.wallpaperInterval = n
    else delete next.wallpaperInterval
    setSettings(next)
    applySettings(next, target === 'default' ? undefined : target, 0)
    saveSettings(next)
    syncWallpaperTimer()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="DIY 设置"
      closeLabel="关闭"
      footer={(
        <button type="button" className={css.reset} onClick={reset}>恢复默认</button>
      )}
    >
      <div className={css.body}>
        <section className={css.section}>
          <h3 className={css.sectionTitle}>主题色</h3>
          <div className={css.swatches}>
            {ACCENT_PRESETS.map(color => (
              <button
                key={color}
                type="button"
                className={clsx(css.swatch, settings.accent === color && css.swatchActive)}
                style={{ background: color }}
                aria-label={`主题色 ${color}`}
                onClick={() => { update({ accent: color }) }}
              />
            ))}
            <label className={css.customColor} title="自定义颜色">
              <input
                type="color"
                value={settings.accent ?? '#07c160'}
                onChange={e => { update({ accent: e.target.value }) }}
              />
            </label>
          </div>
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>按钮颜色</h3>
          <div className={css.swatches}>
            {BUTTON_PRESETS.map(color => (
              <button
                key={color}
                type="button"
                className={clsx(css.swatch, settings.buttonFill === color && css.swatchActive)}
                style={{ background: color }}
                aria-label={`按钮色 ${color}`}
                onClick={() => { update({ buttonFill: color }) }}
              />
            ))}
            <label className={css.customColor} title="自定义颜色">
              <input
                type="color"
                value={settings.buttonFill ?? '#07c160'}
                onChange={e => { update({ buttonFill: e.target.value }) }}
              />
            </label>
          </div>
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>字体颜色（聊天区）</h3>
          <div className={css.swatches}>
            <button
              type="button"
              className={clsx(css.swatch, css.themeSwatch, settings.textColor === undefined && css.swatchActive)}
              aria-label="跟随主题"
              title="跟随主题"
              onClick={clearTextColor}
            />
            {TEXT_PRESETS.map(color => (
              <button
                key={color}
                type="button"
                className={clsx(css.swatch, settings.textColor === color && css.swatchActive)}
                style={{ background: color }}
                aria-label={`字体颜色 ${color}`}
                onClick={() => { update({ textColor: color }) }}
              />
            ))}
            <label className={css.customColor} title="自定义颜色">
              <input
                type="color"
                value={settings.textColor ?? '#1a1a1a'}
                onChange={e => { update({ textColor: e.target.value }) }}
              />
            </label>
          </div>
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>聊天壁纸（壁纸集）</h3>
          <p className={css.wallpaperHint}>
            推荐分辨率 1920×1080（16:9 横图）或更高；每个 agent 可配多张，对话区右下角可手动/自动切换
          </p>
          <label className={css.targetRow}>
            <span className={css.targetLabel}>应用给</span>
            <select
              className={css.targetSelect}
              value={target}
              onChange={e => { onTargetChange(e.target.value) }}
            >
              <option value="default">默认壁纸（所有 agent）</option>
              {roster.status === 'ready' && roster.presets.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name ?? preset.id}</option>
              ))}
            </select>
          </label>

          {list.length > 0 && (
            <div className={css.setList}>
              {list.map((wallpaper, index) => (
                <div key={index} className={css.setItem}>
                  <span
                    className={css.setThumb}
                    style={wallpaper.startsWith('linear-gradient')
                      ? { background: wallpaper }
                      : { backgroundImage: `url("${wallpaper}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <span className={css.setIndex}>{index + 1}</span>
                  <button
                    type="button"
                    className={css.setRemove}
                    aria-label={`删除第 ${index + 1} 张`}
                    onClick={() => { removeWallpaperAt(index) }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={css.wallpapers}>
            {WALLPAPER_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                className={css.wallpaper}
                style={preset.value === '' ? undefined : { background: preset.value }}
                aria-label={preset.label}
                title={preset.label}
                onClick={() => {
                  if (preset.value === '') clearWallpapers()
                  else addWallpaper(preset.value)
                }}
              >
                {preset.value === '' && <span className={css.wallpaperNone}>无</span>}
              </button>
            ))}
          </div>

          <div className={css.urlRow}>
            <span className={css.urlLabel}>添加图片 URL</span>
            <input
              type="text"
              className={css.urlInput}
              placeholder="https://example.com/bg.png"
              value={draftUrl}
              onChange={e => { setDraftUrl(e.target.value) }}
              onKeyDown={e => {
                if (e.key !== 'Enter') return
                const value = draftUrl.trim()
                if (value === '') return
                addWallpaper(`url("${value}")`)
                setDraftUrl('')
              }}
            />
            <button
              type="button"
              className={css.localBtn}
              onClick={() => {
                const value = draftUrl.trim()
                if (value === '') return
                addWallpaper(`url("${value}")`)
                setDraftUrl('')
              }}
            >
              添加
            </button>
          </div>

          <div className={css.localRow}>
            <button
              type="button"
              className={css.localBtn}
              onClick={() => { fileRef.current?.click() }}
            >
              添加本地图片…
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { void onFilesPicked(e) }}
            />
            {localError !== null && <span className={css.localError}>{localError}</span>}
          </div>

          <label className={css.intervalRow}>
            <span>自动切换间隔（秒）</span>
            <input
              type="number"
              min={0}
              step={5}
              className={css.intervalInput}
              value={intervalSec}
              onChange={e => { setIntervalSec(Number(e.target.value)) }}
            />
            <span className={css.intervalHint}>0 = 手动</span>
          </label>

          <label className={css.immersive}>
            <input
              type="checkbox"
              checked={settings.immersive === true}
              onChange={e => { update({ immersive: e.target.checked }) }}
            />
            <span>沉浸模式（气泡半透明，壁纸透出）</span>
          </label>
        </section>
      </div>
    </Modal>
  )
}
