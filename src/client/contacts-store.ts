/**
 * Contacts roster controller: reads the agent-preset roster over the wire
 * (the same `agentPresets.list` RPC the settings surface uses) and exposes
 * it as a snapshot store the sidebar shell binds as the `useRoster` hook.
 */

import type { IApiClient } from '@deepseek-ai/dsh-api-remotes/client'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/** One contact: a healthy agent preset the deployment composes. */
export interface ContactPreset {
  /** Preset id (also the directory name). */
  id: string
  /** Whether the preset ships with the deployment or was authored locally. */
  trust: 'system' | 'user'
  /** Display name the preset published, absent when it published none. */
  name?: string
  /** One sentence on what the preset is for. */
  description?: string
  /** Why the preset cannot compose a session, absent when it can. */
  broken?: string
}

/** Roster snapshot the contacts panel renders. */
export interface ContactsSnapshot {
  status: 'idle' | 'loading' | 'ready' | 'unavailable' | 'error'
  error: string | null
  presets: readonly ContactPreset[]
}

const INITIAL: ContactsSnapshot = { status: 'idle', error: null, presets: [] }

/**
 * Loads and caches the agent-preset roster.
 */
export class ContactsController {
  /** Roster snapshot the renderer subscribes to (a HostObservable source). */
  readonly store: SnapshotStore<ContactsSnapshot> = createSnapshotStore(INITIAL)

  constructor(private readonly api: IApiClient) {}

  private set(patch: Partial<ContactsSnapshot>): void {
    this.store.set({ ...this.store.getSnapshot(), ...patch })
  }

  /**
   * Read the roster. An empty roster means the deployment composes no
   * presets, which is a valid deployment rather than a failure.
   * @returns once the snapshot reflects the host.
   */
  async load(): Promise<void> {
    const before = this.store.getSnapshot()
    if (before.status === 'loading') return
    this.set({ status: 'loading', error: null })
    let response
    try {
      response = await this.api.agentPresets.list({})
    } catch (error) {
      this.set({ status: 'error', error: error instanceof Error ? error.message : String(error) })
      return
    }
    if (!response.result.ok) {
      this.set({ status: 'error', error: response.result.error.message })
      return
    }
    const { presets } = response.result.value
    if (presets.length === 0) {
      this.set({ status: 'unavailable', presets: [] })
      return
    }
    this.set({
      status: 'ready',
      presets: presets.map(preset => ({
        id: preset.id,
        trust: preset.trust,
        ...preset.name === undefined ? {} : { name: preset.name },
        ...preset.description === undefined ? {} : { description: preset.description },
        ...preset.broken === undefined ? {} : { broken: preset.broken },
      })),
    })
  }
}
