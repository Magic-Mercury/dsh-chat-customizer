/**
 * Dual-mode sidebar shell: replaces the default sidebar (ui-sidebar) with a
 * shell that toggles between `sessions` mode (the default workspace/session
 * browser, re-declared as child seats) and `contacts` mode (agent presets as
 * a chat-app contact list).
 *
 * The shell re-declares the same child seats ui-sidebar owned — workspaces,
 * settings, footer actions — so their registrants (ui-workspace, ui-settings)
 * render unchanged in sessions mode. ui-sidebar itself is disabled by this
 * package's cordis patch, so the declarations collide with nothing.
 */

import { useState } from 'react'
import clsx from 'clsx'
import {
  IconNewChatOutline16, IconPanelLeftOutline16, IconUserOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  HostObservable, PropsRenderSlots, PropsRuntime, SnapshotSelectorHook,
} from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the runtime's GlobalStandardProps merge (useSessions /
// useWorkspaces) into this file.
import type {} from '@deepseek-ai/dsh-client-runtime/client'
import type { SessionId, WorkspaceId } from '@deepseek-ai/dsh-client-connection/client'
import type { ContactsSnapshot } from './contacts-store.ts'
import { ContactsPanel } from './ContactsPanel.tsx'
import css from './SidebarShell.module.css'

/** Which mode the shell is showing. */
export type SidebarMode = 'sessions' | 'contacts'

/** Registrant-private injected share (arrives via the register inject factory). */
export interface SidebarShellInjected {
  /** Start a New Session with the current/recent workspace. */
  startSession: (workspaceId?: WorkspaceId) => void
  /** Toggle the sidebar column through the layout service. */
  toggleSidebar: () => void
  /** Select an existing session as current. */
  openSession: (sessionId: SessionId) => void
  /** Start a new session and bind the given agent preset to it. */
  startWithPreset: (presetId: string) => void
  /** Observable sources bound as use<Name> selector hooks on the component. */
  hooks: {
    /** The agent-preset roster. */
    roster: HostObservable<ContactsSnapshot>
  }
}

/** Component-side view of the injected face: hooks become selector hooks. */
type InjectedFace = Omit<SidebarShellInjected, 'hooks'> & {
  useRoster: SnapshotSelectorHook<ContactsSnapshot>
}

/** Full component props: layout owner state + declared holes' render shares + injected face. */
export type SidebarShellProps =
  PropsRuntime<'sidebar'>
  & PropsRenderSlots<'sidebar.workspaces' | 'sidebar.settings' | 'sidebar.footer.action'>
  & InjectedFace

/**
 * Render the dual-mode sidebar column shell.
 * @param props - composed slot props.
 * @returns the sidebar element tree.
 */
export function SidebarShell(props: SidebarShellProps) {
  const {
    collapsed,
    startSession,
    toggleSidebar,
    openSession,
    startWithPreset,
    useRoster,
    useSessions,
    renderSlot,
  } = props
  const [mode, setMode] = useState<SidebarMode>('sessions')
  const roster = useRoster(snapshot => snapshot)
  const sessions = useSessions(snapshot => snapshot)

  // Collapsed rail: expand on any action so a tap always has visible
  // feedback — the mode buttons also switch the mode, the first just expands.
  if (collapsed) {
    return (
      <div className={css.rail}>
        <button
          type="button"
          className={css.railBtn}
          aria-label="展开侧边栏"
          onClick={() => { toggleSidebar() }}
        >
          <IconPanelLeftOutline16 size={18} />
        </button>
        <button
          type="button"
          className={clsx(css.railBtn, mode === 'contacts' && css.railActive)}
          aria-label="联系人模式"
          onClick={() => { setMode('contacts'); toggleSidebar() }}
        >
          <IconUserOutline16 size={18} />
        </button>
        <button
          type="button"
          className={clsx(css.railBtn, mode === 'sessions' && css.railActive)}
          aria-label="会话模式"
          onClick={() => { setMode('sessions'); toggleSidebar() }}
        >
          <IconNewChatOutline16 size={18} />
        </button>
        <div className={css.railFoot}>
          {renderSlot('sidebar.settings', { wide: false })}
        </div>
      </div>
    )
  }

  return (
    <div className={css.root}>
      <div className={css.top}>
        <button
          type="button"
          className={css.toggle}
          aria-label="收起侧边栏"
          onClick={() => { toggleSidebar() }}
        >
          <IconPanelLeftOutline16 size={16} />
        </button>
        <div className={css.tabs} role="tablist" aria-label="侧边栏模式">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sessions'}
            className={clsx(css.tab, mode === 'sessions' && css.tabActive)}
            onClick={() => { setMode('sessions') }}
          >
            会话
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'contacts'}
            className={clsx(css.tab, mode === 'contacts' && css.tabActive)}
            onClick={() => { setMode('contacts') }}
          >
            联系人
          </button>
        </div>
      </div>

      {/* New Session bar (sessions mode only; contacts create via their rows). */}
      {mode === 'sessions' && (
        <button
          type="button"
          className={css.newSession}
          onClick={() => { startSession() }}
        >
          <IconNewChatOutline16 size={14} />
          <span className={css.newSessionLabel}>新会话</span>
        </button>
      )}

      <div className={css.body}>
        {mode === 'sessions'
          ? renderSlot('sidebar.workspaces', {
            wide: true,
            expandSidebar: () => { if (collapsed) toggleSidebar() },
          })
          : (
            <ContactsPanel
              roster={roster}
              sessions={sessions}
              openSession={openSession}
              startWithPreset={startWithPreset}
            />
          )}
      </div>

      <div className={css.foot}>
        <div className={css.footActions}>
          {renderSlot('sidebar.footer.action', { wide: true })}
        </div>
        <div className={css.footSettings}>
          {renderSlot('sidebar.settings', { wide: true })}
        </div>
      </div>
    </div>
  )
}
