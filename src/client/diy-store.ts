/**
 * DIY settings store: custom UI color overrides + conversation wallpaper,
 * persisted to localStorage and applied to the document root as CSS variable
 * overrides (theme aliases for colors, --dsh-wallpaper-image for the chat
 * background). Pure DOM/state — no core package changes.
 */

/** One DIY settings snapshot. */
export interface DiySettings {
  /** Accent color override (--dsw-alias-state-business-primary). */
  accent?: string
  /** Button fill override (--dsw-alias-button-elevated-fill). */
  buttonFill?: string
  /** Chat text color override (applied to the conversation column only). */
  textColor?: string
  /** Default wallpaper: a CSS background-image value (url()/data: or gradient), absent = none. */
  wallpaper?: string
  /**
   * Per-agent wallpapers keyed by agent preset id: a single value (legacy)
   * or a list (the wallpaper set, cycled manually or on a timer). Absent
   * entry falls back to `wallpaper`.
   */
  perAgent?: Record<string, string | string[]>
  /** Immersive mode: translucent bubbles so the wallpaper shows through. */
  immersive?: boolean
  /** Auto-advance interval in seconds; 0/absent = manual switching only. */
  wallpaperInterval?: number
}

/** localStorage key for DIY settings. */
const STORAGE_KEY = 'dsh.diy.settings'

/** Accent preset palette. */
export const ACCENT_PRESETS = [
  '#07c160', // 微信绿
  '#4d6bfe', // DeepSeek 蓝
  '#8b5cf6', // 紫
  '#f59e0b', // 橙
  '#ef4444', // 红
  '#06b6d4', // 青
  '#ec4899', // 粉
] as const

/** Button-fill preset palette. */
export const BUTTON_PRESETS = [
  '#07c160',
  '#4d6bfe',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#334155', // 石板灰
] as const

/** Chat text-color preset palette (a "reset to theme" entry lives in the panel). */
export const TEXT_PRESETS = [
  '#1a1a1a', // 墨黑（浅色主题）
  '#e6e9ef', // 浅灰白（深色主题）
  '#07c160', // 微信绿
  '#4d6bfe', // 蓝
  '#8b5cf6', // 紫
  '#f59e0b', // 橙
  '#ef4444', // 红
  '#ec4899', // 粉
  '#06b6d4', // 青
] as const

/** Built-in wallpaper presets (CSS background-image values). */
export const WALLPAPER_PRESETS: readonly { id: string; label: string; value: string }[] = [
  { id: 'none', label: '无', value: '' },
  { id: 'mist', label: '晨雾', value: 'linear-gradient(160deg, #e0eafc 0%, #cfdef3 100%)' },
  { id: 'sunset', label: '落日', value: 'linear-gradient(160deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'mint', label: '薄荷', value: 'linear-gradient(160deg, #d4fc79 0%, #96e6a1 100%)' },
  { id: 'night', label: '星空', value: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { id: 'blush', label: '玫瑰', value: 'linear-gradient(160deg, #ff9a9e 0%, #fecfef 100%)' },
] as const

/** Read persisted settings; falls back to empty when absent or corrupt. */
export function loadSettings(): DiySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const s = parsed as Record<string, unknown>
    return {
      ...(typeof s.accent === 'string' ? { accent: s.accent } : {}),
      ...(typeof s.buttonFill === 'string' ? { buttonFill: s.buttonFill } : {}),
      ...(typeof s.textColor === 'string' ? { textColor: s.textColor } : {}),
      ...(typeof s.wallpaper === 'string' ? { wallpaper: s.wallpaper } : {}),
      ...(typeof s.perAgent === 'object' && s.perAgent !== null
        ? { perAgent: s.perAgent as Record<string, string | string[]> }
        : {}),
      ...(typeof s.immersive === 'boolean' ? { immersive: s.immersive } : {}),
      ...(typeof s.wallpaperInterval === 'number' ? { wallpaperInterval: s.wallpaperInterval } : {}),
    }
  } catch {
    return {}
  }
}

/** Persist settings; storage failures (quota) are non-fatal — the live
 * session keeps the applied look, only persistence is lost. */
export function saveSettings(settings: DiySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('[ui-contacts] DIY settings save failed:', error)
  }
}

/** Clear persisted settings. */
export function clearSettings(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Apply settings to the document: color overrides and the wallpaper variable
 * are written to BODY inline style — the same layer the theme presenter uses,
 * so a later write wins and the override beats the html-root fallback. The
 * immersive (translucent bubbles) body class toggles separately. Empty/absent
 * values remove the override so the theme's own value wins again.
 * @param settings - the settings to apply.
 * @param presetId - the current agent preset; selects its per-agent wallpaper set.
 * @param wallpaperIndex - index into the agent's set; 0 by default.
 */
export function applySettings(settings: DiySettings, presetId?: string, wallpaperIndex = 0): void {
  const body = document.body
  setVar(body, '--dsw-alias-state-business-primary', settings.accent)
  setVar(body, '--dsh-chat-text-color', settings.textColor)
  setVar(body, '--dsw-alias-button-elevated-fill', settings.buttonFill)
  const wallpaper = wallpaperAt(settings, presetId, wallpaperIndex)
  setVar(body, '--dsh-wallpaper-image', wallpaperValue(wallpaper))
  const wallpaperOn = wallpaper !== undefined && wallpaper !== ''
  // dsh-wallpaper-active: any wallpaper is shown (drops the composer fade band).
  body.classList.toggle('dsh-wallpaper-active', wallpaperOn)
  // dsh-wallpaper-on: immersive translucent bubbles on top of the wallpaper.
  body.classList.toggle('dsh-wallpaper-on', wallpaperOn && settings.immersive === true)
}

/**
 * The agent's wallpaper list (normalized: legacy single values become a
 * one-element list; an absent entry yields an empty list).
 * @param settings - the DIY settings.
 * @param presetId - the agent preset id.
 * @returns the agent's wallpapers in display order.
 */
export function agentWallpapers(settings: DiySettings, presetId: string): readonly string[] {
  const entry = settings.perAgent?.[presetId]
  if (entry === undefined) return []
  return Array.isArray(entry) ? entry : [entry]
}

/**
 * The wallpaper to show for a preset at an index: the agent's set when it
 * has one (cycled), else the default `wallpaper`.
 * @param settings - the DIY settings.
 * @param presetId - the agent preset id (undefined uses only the default).
 * @param index - position in the agent's set (wrapped by the set length).
 * @returns the wallpaper value, or undefined for none.
 */
export function wallpaperAt(
  settings: DiySettings,
  presetId: string | undefined,
  index: number,
): string | undefined {
  if (presetId !== undefined) {
    const list = agentWallpapers(settings, presetId)
    if (list.length > 0) return list[((index % list.length) + list.length) % list.length]
  }
  return settings.wallpaper
}

/**
 * Convenience for callers that only want to re-apply the wallpaper for a
 * session switch (colors stay put).
 * @param settings - the current DIY settings.
 * @param presetId - the agent preset the current session runs.
 * @param index - position in the agent's wallpaper set.
 */
export function applyWallpaper(presetId: string | undefined, settings: DiySettings, index = 0): void {
  applySettings(settings, presetId, index)
}

/* ── wallpaper carousel cursor (per-agent set + manual/auto advance) ───── */

/** Current carousel position: which agent and which image. */
export interface WallpaperCursor {
  preset: string | undefined
  index: number
}

let cursor: WallpaperCursor = { preset: undefined, index: 0 }
/** Registered by the plugin apply: (preset, index) => applySettings(loadSettings(), preset, index). */
let cursorApplier: ((preset: string | undefined, index: number) => void) | undefined
/** Auto-advance timer handle. */
let cursorTimer: number | undefined
/** Monotonic cursor version + listeners (the floating controls subscribe). */
let cursorVersion = 0
const cursorListeners = new Set<() => void>()

/** Subscribe to cursor moves (manual/auto/session changes). */
export function subscribeWallpaperCursor(listener: () => void): () => void {
  cursorListeners.add(listener)
  return () => { cursorListeners.delete(listener) }
}

/** The cursor version (useSyncExternalStore snapshot). */
export function wallpaperCursorVersion(): number {
  return cursorVersion
}

function notifyCursor(): void {
  cursorVersion += 1
  for (const listener of [...cursorListeners]) listener()
}

/** Bind the cursor applier (the plugin's apply); idempotent. */
export function bindWallpaperCursor(fn: (preset: string | undefined, index: number) => void): void {
  cursorApplier = fn
}

/** The current carousel position (for the floating controls). */
export function wallpaperCursor(): WallpaperCursor {
  return cursor
}

/** Reset the cursor to a new preset (session switch): index 0 + re-sync the timer. */
export function setWallpaperPreset(preset: string | undefined): void {
  cursor = { preset, index: 0 }
  notifyCursor()
  syncWallpaperTimer()
}

/**
 * Move the carousel. Manual calls (and session switches) restart the timer
 * so the next auto tick starts from a full interval; automatic ticks pass
 * `resetTimer: false` so the fixed setInterval cadence stays uniform instead
 * of being rebuilt on every tick (which drifted with render cost).
 * @param delta - direction (+1 next, -1 prev, 0 re-apply).
 * @param resetTimer - whether to restart the auto timer (default true).
 */
export function advanceWallpaper(delta: 1 | -1 | 0, resetTimer = true): void {
  cursor = { ...cursor, index: Math.max(0, cursor.index + delta) }
  cursorApplier?.(cursor.preset, cursor.index)
  notifyCursor()
  if (resetTimer) syncWallpaperTimer()
}

/**
 * (Re)start the auto-advance timer from settings: interval > 0 and the
 * current agent owning ≥2 wallpapers. Stopped otherwise. Auto ticks advance
 * WITHOUT restarting the timer, so the cadence is a uniform setInterval.
 */
export function syncWallpaperTimer(): void {
  if (cursorTimer !== undefined) {
    window.clearInterval(cursorTimer)
    cursorTimer = undefined
  }
  const settings = loadSettings()
  const interval = settings.wallpaperInterval
  if (interval === undefined || interval <= 0) return
  if (cursor.preset === undefined || agentWallpapers(settings, cursor.preset).length < 2) return
  cursorTimer = window.setInterval(() => { advanceWallpaper(1, false) }, interval * 1000)
}

/**
 * Resolve the applied wallpaper value to a legal background-image value:
 * gradient presets pass through, url("…") links pass through, and bare data
 * URLs (local-file wallpapers) get wrapped in url("…") — a raw data URL is
 * not a valid background-image and would silently render nothing.
 * @param wallpaper - the stored wallpaper value.
 * @returns the background-image value, or undefined for none.
 */
function wallpaperValue(wallpaper: string | undefined): string | undefined {
  if (wallpaper === undefined || wallpaper === '') return undefined
  if (wallpaper.startsWith('linear-gradient')) return wallpaper
  if (wallpaper.startsWith('url(')) return wallpaper
  return `url("${wallpaper}")`
}

/** Set one CSS variable, removing it when the value is absent. */
function setVar(root: HTMLElement, name: string, value: string | undefined): void {
  if (value === undefined || value === '') root.style.removeProperty(name)
  else root.style.setProperty(name, value)
}

/** Injected style tag wiring the wallpaper variable into the conversation column. */
let wallpaperStyle: HTMLStyleElement | null = null

/**
 * Install the wallpaper CSS seams once: the conversation column root carries
 * `data-phase` in hero/active/settling states (the wallpaper consumer), and
 * the immersive class makes the user bubble translucent so the wallpaper
 * shows through. Idempotent.
 */
export function ensureWallpaperCss(): void {
  if (wallpaperStyle !== null) return
  const style = document.createElement('style')
  style.dataset.plugin = 'dsh-contacts-wallpaper'
  style.textContent = [
    "[data-phase='hero'],[data-phase='active'],[data-phase='settling']{",
    'background-image:var(--dsh-wallpaper-image,none) !important;',
    'background-size:cover;background-position:center;background-repeat:no-repeat;',
    '}',
    // Immersive mode: user bubbles become translucent (theme-aware).
    'body.dsh-wallpaper-on{',
    '--dsw-specific-bubble:color-mix(in srgb, var(--dsw-static-deepseek-50) 78%, transparent);',
    '}',
    'body.dsh-wallpaper-on[data-ds-dark-theme]{',
    '--dsw-specific-bubble:color-mix(in srgb, var(--dsw-static-neutral-bluish-850) 78%, transparent);',
    '}',
    // Any wallpaper on: drop the composer seat's 36px fade band so the
    // wallpaper runs edge-to-edge instead of stopping under a base-color bar.
    'body.dsh-wallpaper-active [data-composer-seat]{',
    'background:transparent !important;',
    '}',
    // Chat text color: re-map the label aliases inside the conversation
    // column only (hero/active/settling). An unset --dsh-chat-text-color
    // leaves the declarations invalid, so the theme's own values win.
    "[data-phase='hero'],[data-phase='active'],[data-phase='settling']{",
    '--dsw-alias-label-primary:var(--dsh-chat-text-color,var(--dsw-alias-label-primary));',
    '--dsw-alias-label-secondary:color-mix(in srgb,var(--dsh-chat-text-color,var(--dsw-alias-label-secondary)) 72%,transparent);',
    '--dsw-alias-label-tertiary:color-mix(in srgb,var(--dsh-chat-text-color,var(--dsw-alias-label-tertiary)) 52%,transparent);',
    '}',
  ].join('')
  document.head.appendChild(style)
  wallpaperStyle = style
}
