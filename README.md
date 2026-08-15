# dsh-chat-customizer

[中文](./README.zh.md)

A client plugin for the **DSH (DeepSeek Harness)** web profile that turns the sidebar into a dual-mode navigation and adds deep chat appearance customization.

## Features

- **Dual-mode sidebar** — `Sessions` (the stock workspace/session tree) and `Contacts` (agent presets as a chat-app contact list) tabs, with a New Session button in sessions mode.
- **Contacts mode** — one row per agent preset (avatar placeholder + name + status). A single session opens directly, multiple sessions expand into a chooser, and none starts a new session bound to that preset through the host flow (`agentPresets.select`), so the binding survives refresh.
- **Session-row agent tag** — the workspace browser labels each session with the agent preset it runs *(needs the optional ui-workspace patch, see below)*.
- **DIY panel** — a sidebar footer "DIY" button opens an appearance panel:
  - Accent / button / chat text colors (presets + custom pickers).
  - Per-agent **wallpaper sets**: local images (multi-select), image URLs, and gradient presets; immersive translucent bubbles; auto-advance interval.
- **Wallpaper carousel** — a floating control bar on the conversation (prev / count / next / auto toggle) whenever the current agent owns two or more wallpapers. Switching sessions swaps to that agent's set.

## Requirements

- A DSH checkout at `0.1.0-rc.5` with the web frontend built (`pnpm run build:web`).
- Node ≥ 22, pnpm ≥ 10.

## Install

From the directory where you keep this repository (absolute paths work too):

```bash
dsh plugin --profile web add /path/to/dsh-chat-customizer
```

or from a DSH checkout:

```bash
pnpm dsh plugin --profile web add /path/to/dsh-chat-customizer
```

The plugin joins the `web` profile's bundle stack, disables the stock `ui-sidebar`, and mounts the dual-mode shell. **Restart the web server** (`dsh web`) for the plugin set to take effect.

> The repo ships a prebuilt `lib/`, so installation works without building.

## Build from source

```bash
pnpm install
pnpm build
```

Building needs the `@deepseek-ai/*` peer types resolvable — install version-matched peers, or run the build inside a DSH checkout that has them linked.

## ui-workspace patch (optional, enables the row agent tag)

The session-row agent tag rides a generic row-level slot (`sidebar.workspaces.row.agent`) that stock `ui-workspace` does not declare. Without the patch the tag simply doesn't render; everything else works.

`patches/ui-workspace/` holds the five modified stock files. Copy them over your checkout's `packages/client/ui-workspace/src/...` (back up the originals first), rebuild `ui-workspace` (`tsc -b` + `tsdown --env.DSH_BUILD_FACE client`), and restart `dsh web`. See `patches/PATCH.md`.

## Uninstall

```bash
dsh plugin --profile web remove dsh-chat-customizer
```

Restart `dsh web` to return to the stock sidebar.

## License

MIT
