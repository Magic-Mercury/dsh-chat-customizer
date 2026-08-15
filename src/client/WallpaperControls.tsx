/**
 * Floating wallpaper controls: a small bar on the frame-wide overlay seat,
 * shown only while the current agent owns a wallpaper set (≥2 images). Offers
 * manual prev/next plus an auto-advance toggle (interval from DIY settings).
 */

import { useSyncExternalStore } from 'react'
import clsx from 'clsx'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the runtime's GlobalStandardProps merge (useSessions).
import type {} from '@deepseek-ai/dsh-client-runtime/client'
import {
  advanceWallpaper, agentWallpapers, loadSettings,
  subscribeWallpaperCursor, syncWallpaperTimer, wallpaperCursor,
  wallpaperCursorVersion, type DiySettings,
} from './diy-store.ts'
import css from './WallpaperControls.module.css'

/** The overlay seat's standard props (no owner share). */
type WallpaperControlsProps = PropsRuntime<'shell.overlay'>

/** Default auto-advance interval (seconds) when toggled on. */
const AUTO_INTERVAL_SEC = 30

/**
 * Render the floating wallpaper controls.
 * @param props - the overlay seat's standard props (useSessions included).
 * @returns the control bar, or null when the current agent has no set.
 */
export function WallpaperControls(props: WallpaperControlsProps) {
  // Re-render on cursor moves (manual, auto, or session switch).
  useSyncExternalStore(subscribeWallpaperCursor, wallpaperCursorVersion)
  const { useSessions } = props
  const sessions = useSessions(snapshot => snapshot)
  const current = sessions.current !== undefined ? sessions.byId[sessions.current] : undefined
  const preset = current?.agentPreset

  const settings: DiySettings = loadSettings()
  const cursor = wallpaperCursor()
  // Follow the current session even when the cursor hasn't caught up.
  const activePreset = cursor.preset ?? preset
  const list = activePreset !== undefined ? agentWallpapers(settings, activePreset) : []
  if (list.length < 2) return null

  const index = cursor.index % list.length
  const autoOn = (settings.wallpaperInterval ?? 0) > 0

  const toggleAuto = (): void => {
    const next = { ...settings }
    if (autoOn) delete next.wallpaperInterval
    else next.wallpaperInterval = AUTO_INTERVAL_SEC
    localStorage.setItem('dsh.diy.settings', JSON.stringify(next))
    syncWallpaperTimer()
    advanceWallpaper(0) // re-render the bar
  }

  return (
    <div className={css.bar}>
      <button
        type="button"
        className={css.btn}
        aria-label="上一张壁纸"
        onClick={() => { advanceWallpaper(-1) }}
      >
        ◀
      </button>
      <span className={css.count}>{index + 1} / {list.length}</span>
      <button
        type="button"
        className={css.btn}
        aria-label="下一张壁纸"
        onClick={() => { advanceWallpaper(1) }}
      >
        ▶
      </button>
      <button
        type="button"
        className={clsx(css.btn, css.autoBtn, autoOn && css.autoOn)}
        aria-label={autoOn ? '关闭自动切换' : '开启自动切换'}
        title={autoOn ? '自动切换中' : '自动切换'}
        onClick={toggleAuto}
      >
        {autoOn ? '⏸' : '▶▶'}
      </button>
    </div>
  )
}
