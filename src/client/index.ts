/**
 * Contacts-mode sidebar plugin, browser half: registers the dual-mode shell
 * into the layout-owned `sidebar` slot, re-declaring the workspace/settings/
 * footer child seats so the default session tree keeps rendering in sessions
 * mode. ui-sidebar is disabled by this package's cordis patch, so the child
 * declarations collide with nothing.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-api-remotes/client'
import type { IApiClient } from '@deepseek-ai/dsh-api-remotes/client'
// Type-only merges: the 'sidebar' SlotMap entry (ui-layout) and the child
// seats (ui-sidebar contract). Erased at build; no purity violation.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
// Type-only: pulls the theme service's Events merge ('theme/change').
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots'
import { ContactsController } from './contacts-store.ts'
import { SidebarShell, type SidebarShellInjected } from './SidebarShell.tsx'
import { AgentRowTag } from './AgentRowTag.tsx'
import { DiyButton } from './DiyButton.tsx'
import { WallpaperControls } from './WallpaperControls.tsx'
import {
  applySettings, bindWallpaperCursor, ensureWallpaperCss, loadSettings,
  setWallpaperPreset, syncWallpaperTimer,
} from './diy-store.ts'

// Declare the session-row agent hole locally (ui-workspace declares the same
// key in its own package; we must not import its client types here, because
// that pulls ui-conversation → ui-attachment sources into this package's
// compile). Interface merging makes both declarations compatible.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'sidebar.workspaces.row.agent': {
      kind: 'single'
      scope: 'root'
      owner: { sessionId: string; agentPreset?: string }
    }
  }
}

export type { ContactPreset, ContactsSnapshot, ContactsController } from './contacts-store.ts'
export type { SidebarMode, SidebarShellInjected, SidebarShellProps } from './SidebarShell.tsx'
export { ContactsPanel, type ContactsPanelProps } from './ContactsPanel.tsx'
export { AgentRowTag, type AgentRowTagProps } from './AgentRowTag.tsx'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'layout', 'sessions', 'workspaces', 'connection']

/** Inject face of the row-agent tag: the roster source bound as useRoster. */
type AgentRowTagInjected = {
  hooks: {
    roster: HostObservable<import('./contacts-store.ts').ContactsSnapshot>
  }
}

/**
 * Replace the sidebar with the dual-mode shell.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const { api } = ctx.get('connection') as ConnectionHandle
  const contacts = new ContactsController(api)
  void contacts.load()

  // DIY: restore persisted appearance and install the wallpaper CSS seam.
  ensureWallpaperCss()
  applySettings(loadSettings())

  // Wallpaper carousel driver: session switches reset the cursor to the new
  // agent's set; the timer (from settings) auto-advances; manual advance and
  // the timer both go through the bound applier.
  bindWallpaperCursor((preset, index) => applySettings(loadSettings(), preset, index))
  let diyPreset: string | undefined
  ctx.effect(() => ctx.sessions.list.subscribe(() => {
    const state = ctx.sessions.list.getSnapshot()
    const summary = state.current !== undefined ? state.byId[state.current] : undefined
    const preset = summary?.agentPreset
    if (preset === diyPreset) return
    diyPreset = preset
    setWallpaperPreset(preset)
    applySettings(loadSettings(), preset, 0)
    syncWallpaperTimer()
  }), 'ui-contacts: diy per-agent wallpaper')
  // The theme presenter rewrites body inline tokens on theme change; replay
  // our overrides afterwards so they keep winning.
  ctx.effect(() => ctx.on('theme/change', () => applySettings(loadSettings(), diyPreset, 0)), 'ui-contacts: diy theme replay')

  ctx.slots.inject('sidebar', () => ctx.slots.register({
    name: 'sidebar',
    // Shade below the default (0) so this shell wins if ui-sidebar ever
    // re-enables without the patch's disable row.
    priority: -1,
    children: {
      'sidebar.workspaces': { kind: 'single', scope: 'root' },
      'sidebar.settings': { kind: 'single', scope: 'root' },
      'sidebar.footer.action': { kind: 'list', scope: 'root' },
    },
    inject: (): SidebarShellInjected => ({
      startSession: (workspaceId) => { void ctx.workspaces.startSession(workspaceId) },
      toggleSidebar: () => { ctx.layout.toggleSidebar() },
      openSession: (sessionId) => { ctx.sessions.open(sessionId) },
      startWithPreset: (presetId) => { startWithPreset(ctx, api, presetId) },
      hooks: { roster: contacts.store },
    }),
  }, SidebarShell))

  // Per-session-row agent tag in the workspace browser: waits for
  // ui-workspace to declare the hole, then contributes the tag component.
  ctx.slots.inject('sidebar.workspaces.row.agent', () => ctx.slots.register({
    name: 'sidebar.workspaces.row.agent',
    inject: (): AgentRowTagInjected => ({ hooks: { roster: contacts.store } }),
  }, AgentRowTag))

  // DIY settings entry at the sidebar foot (additive list seat).
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'diy',
    order: 10,
    inject: (): DiyButtonInjected => ({ hooks: { roster: contacts.store } }),
  }, DiyButton))

  // Floating wallpaper controls (manual next/prev + auto toggle) on the
  // frame-wide overlay seat, shown only when the current agent owns a set.
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'wallpaper-controls',
    order: 100,
  }, WallpaperControls))
}

/** Inject face of the DIY button: the roster source bound as useRoster. */
type DiyButtonInjected = {
  hooks: {
    roster: HostObservable<import('./contacts-store.ts').ContactsSnapshot>
  }
}

/**
 * Open the session already running the preset, or start a new one and bind
 * the preset to it once the blank session lands. The preset switch goes
 * through the HOST (`agentPresets.select`) — a client-side `noteAgentPreset`
 * alone is overwritten by the next list refresh, which is what made contact
 * sessions appear stale. The new session is created in the CURRENT session's
 * workspace when one is selected, so it lands in the group in view.
 * @param ctx - client root context.
 * @param api - the wire face (host preset switch).
 * @param presetId - the agent preset id the contact maps to.
 */
function startWithPreset(ctx: ClientContext, api: IApiClient, presetId: string): void {
  const before = ctx.sessions.list.getSnapshot()
  const existing = Object.values(before.byId).find(summary => summary.agentPreset === presetId)
  if (existing !== undefined) {
    ctx.sessions.open(existing.id)
    return
  }

  // Target workspace: the current session's workspace, else the workspace
  // list's own recency projection (mirrors startSession's internal choice,
  // made explicit so the new session joins the group in view).
  const workspaceState = ctx.workspaces.list.getSnapshot()
  const currentWorkspaceId = before.current !== undefined
    ? workspaceState.items.find(item => item.sessionIds.includes(before.current as never))?.workspaceId
    : undefined

  let settled = false
  const stop = ctx.sessions.list.subscribe(() => {
    if (settled) return
    const next = ctx.sessions.list.getSnapshot()
    const fresh = Object.values(next.byId).find(summary => !(summary.id in before.byId))
    if (fresh === undefined) return
    settled = true
    stop()
    void (async () => {
      try {
        const response = await api.agentPresets.select({ sessionId: fresh.id, agentPreset: presetId })
        if (response.result.ok) {
          // Host confirmed: record the composition so the label/wallpaper move
          // immediately; the host's own summary keeps it from then on.
          ctx.sessions.noteAgentPreset(fresh.id, response.result.value.agentPreset)
        }
      } catch {
        // Host refused (e.g. session already started); open it as-is.
      }
      ctx.sessions.open(fresh.id)
    })()
  })
  // Safety net: drop the listener if no fresh session shows up.
  window.setTimeout(() => {
    if (settled) return
    settled = true
    stop()
  }, 10_000)
  ctx.workspaces.startSession(currentWorkspaceId)
}
