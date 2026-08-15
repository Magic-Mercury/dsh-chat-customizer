/**
 * Per-session-row agent tag: renders a small label beside a session title in
 * the workspace browser, naming the agent preset the session runs. Occupies
 * ui-workspace's `sidebar.workspaces.row.agent` hole; absent a preset (or
 * while the roster is still loading) it renders nothing.
 */

import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { ContactsSnapshot } from './contacts-store.ts'
import css from './AgentRowTag.module.css'

export interface AgentRowTagProps {
  /** The session whose row is rendering. */
  sessionId: string
  /** The agent preset id the session runs; absent renders nothing. */
  agentPreset?: string
  /** Bound roster selector hook (from the inject hooks compartment). */
  useRoster: SnapshotSelectorHook<ContactsSnapshot>
}

/**
 * Render the row agent tag.
 * @param props - session facts and the roster hook.
 * @returns the tag, or null when there is nothing to name.
 */
export function AgentRowTag({ agentPreset, useRoster }: AgentRowTagProps) {
  if (agentPreset === undefined) return null
  const roster = useRoster(snapshot => snapshot)
  const preset = roster.status === 'ready'
    ? roster.presets.find(p => p.id === agentPreset)
    : undefined
  const label = preset?.name ?? agentPreset
  return (
    <span className={css.tag} title={agentPreset}>{label}</span>
  )
}
