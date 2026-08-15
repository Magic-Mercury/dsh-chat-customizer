/**
 * DIY settings entry: a footer action that opens the DIY panel. Renders as a
 * labeled row when the sidebar is wide and an icon-only control on the rail.
 */

import { useState } from 'react'
import clsx from 'clsx'
import { IconPersonalizationOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsRuntime, SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { ContactsSnapshot } from './contacts-store.ts'
import { DiyPanel } from './DiyPanel.tsx'
import css from './DiyButton.module.css'

/** Component-side view of the injected face: the bound roster selector hook. */
type DiyButtonProps = PropsRuntime<'sidebar.footer.action'> & {
  useRoster: SnapshotSelectorHook<ContactsSnapshot>
}

/**
 * Render the DIY footer action and its modal panel.
 * @param props - the footer-action owner share plus the roster hook.
 * @returns the action button plus the (portal) panel.
 */
export function DiyButton({ wide, useRoster }: DiyButtonProps) {
  const [open, setOpen] = useState(false)
  const roster = useRoster(snapshot => snapshot)
  return (
    <>
      <button
        type="button"
        className={clsx(css.action, !wide && css.railAction)}
        aria-label="DIY 设置"
        title="DIY 设置"
        onClick={() => { setOpen(true) }}
      >
        <IconPersonalizationOutline16 size={wide ? 16 : 18} />
        {wide && <span className={css.label}>DIY</span>}
      </button>
      <DiyPanel open={open} onClose={() => { setOpen(false) }} roster={roster} />
    </>
  )
}
