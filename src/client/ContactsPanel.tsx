/**
 * Contacts panel: the contacts-mode body of the dual-mode sidebar. Renders
 * one row per healthy agent preset (avatar placeholder + name + status).
 * Clicking a contact opens its single session, starts a new one bound to the
 * preset when none exists, or expands a chooser when the preset runs several
 * sessions.
 */

import { useState } from 'react'
import clsx from 'clsx'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionListState, WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import type { SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { ContactsSnapshot } from './contacts-store.ts'
import css from './ContactsPanel.module.css'

export interface ContactsPanelProps {
  /** Roster snapshot (from the injected useRoster hook). */
  roster: ContactsSnapshot
  /** Live session list (from the standard useSessions hook). */
  sessions: SessionListState
  /** Workspace selector hook (for the archived-session filter). */
  useWorkspaces: SnapshotSelectorHook<WorkspaceListState>
  /** Open an existing session. */
  openSession: (sessionId: SessionId) => void
  /** Start a new session bound to the given preset id. */
  startWithPreset: (presetId: string) => void
}

/**
 * Render the contacts list.
 * @param props - roster, session list, and session actions.
 * @returns the contact rows.
 */
export function ContactsPanel({ roster, sessions, useWorkspaces, openSession, startWithPreset }: ContactsPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  // Archived sessions stay in the sessions list (the tree view filters them
  // out); the contacts list must hide them too, otherwise "归纳" rows linger.
  const archived = useWorkspaces(snapshot => snapshot.archivedSessionIds)

  if (roster.status === 'idle' || roster.status === 'loading') {
    return <div className={css.hint}>加载联系人…</div>
  }
  if (roster.status === 'error') {
    return <div className={css.hint}>{roster.error}</div>
  }
  if (roster.status === 'unavailable') {
    return <div className={css.hint}>没有可用的 Agent 预设</div>
  }

  // Every session per preset, in list order (archived sessions excluded).
  const sessionsByPreset = new Map<string, SessionId[]>()
  for (const id of sessions.ids) {
    if (archived.includes(id)) continue
    const summary = sessions.byId[id]
    if (summary === undefined || summary.agentPreset === undefined) continue
    const list = sessionsByPreset.get(summary.agentPreset) ?? []
    list.push(id)
    sessionsByPreset.set(summary.agentPreset, list)
  }

  return (
    <div className={css.list}>
      {roster.presets.map(preset => {
        const ids = sessionsByPreset.get(preset.id) ?? []
        const label = preset.name ?? preset.id
        const isExpanded = expanded[preset.id] === true
        return (
          <div key={preset.id} className={css.group}>
            <button
              type="button"
              className={css.row}
              onClick={() => {
                if (ids.length === 0) startWithPreset(preset.id)
                else if (ids.length === 1 && ids[0] !== undefined) openSession(ids[0])
                else setExpanded(prev => ({ ...prev, [preset.id]: !prev[preset.id] }))
              }}
            >
              <span className={css.avatar} aria-hidden="true">{label.slice(0, 1).toUpperCase()}</span>
              <span className={css.info}>
                <span className={css.name}>{label}</span>
                <span className={css.sub}>
                  {ids.length === 0
                    ? (preset.description ?? '未开始')
                    : ids.length === 1 ? '已有会话' : `${ids.length} 个会话`}
                </span>
              </span>
              {ids.length > 1 && (
                <span className={clsx(css.caret, isExpanded && css.caretOpen)} aria-hidden="true">▸</span>
              )}
            </button>
            {isExpanded && (
              <div className={css.subList}>
                {ids.map(id => {
                  const summary = sessions.byId[id]
                  if (summary === undefined) return null
                  return (
                    <button
                      key={id}
                      type="button"
                      className={css.subRow}
                      onClick={() => { openSession(id) }}
                    >
                      <span className={clsx(css.statusDot, summary.running && css.statusRunning)} />
                      <span className={css.subTitle}>{summary.displayTitle}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
