# ui-workspace patch: session-row agent slot

`dsh-chat-customizer` renders a small agent tag beside each session title in the
workspace browser. That tag occupies a **row-level slot**
(`sidebar.workspaces.row.agent`) which stock DSH's `ui-workspace` does not
declare. This directory contains the five modified stock files that add the
slot as a generic extension point.

## What changed

| File (relative to `packages/client/ui-workspace/src/client/`) | Change |
|---|---|
| `tree.ts` | `SessionNode` gains `agentPreset?`; `sessionNode()` forwards it from the session summary |
| `contract/slots.ts` | Declares `sidebar.workspaces.row.agent` (single/root) + `SessionRowAgentOwnerProps`; `WorkspaceBrowserProps` authorizes rendering it |
| `index.ts` | The `sidebar.workspaces` registration declares the new child seat |
| `WorkspaceBrowser.tsx` | `SessionTreeProps`/`FlatList` carry `renderSlot`; both `SessionNodeItem` call sites pass `renderAgent` |
| `rows/Rows.tsx` | `SessionNodeItem` accepts `renderAgent` and renders it between title and timestamp |

All changes are additive — with no occupant the slot renders nothing, so the
patch is safe to apply or to skip.

## Apply

1. Back up the five originals in your DSH checkout
   (`packages/client/ui-workspace/src/client/...`).
2. Copy the files from this directory over the originals, preserving the
   paths above.
3. Rebuild the package and restart the web server:

```bash
pnpm --filter @deepseek-ai/dsh-client-ui-workspace exec tsc -b
pnpm --filter @deepseek-ai/dsh-client-ui-workspace exec tsdown --env.DSH_BUILD_FACE client
# then restart `dsh web`
```

## Skip it?

Without the patch, the session-row agent tag simply doesn't render. Contacts
mode, the DIY panel, wallpapers, and the dual-mode sidebar all work
independently of it.
