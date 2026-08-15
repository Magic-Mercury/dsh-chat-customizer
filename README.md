# dsh-chat-customizer

A client-plugin for the **DSH (DeepSeek Harness) web profile** that turns the sidebar into a dual-mode navigation and adds deep appearance customization:

- **双模式侧边栏** — `会话` (the default workspace/session tree) and `联系人` (agent presets as a chat-app contact list) tabs
- **联系人模式** — one row per agent preset (avatar placeholder + name + status); single session opens directly, multiple sessions expand into a chooser, none starts a new session bound to that preset
- **会话行 agent 标签** — the workspace browser shows a small tag naming each session's agent preset *(requires the optional ui-workspace patch, see below)*
- **DIY 面板** — sidebar footer "DIY" button opens a panel to customize:
  - 主题色 / 按钮颜色 / 聊天字体颜色 (accent + button-fill + chat text overrides)
  - 壁纸：per-agent **wallpaper sets** (local images, image URLs, gradient presets), immersive translucent bubbles, auto-advance interval
- **壁纸轮播** — a floating control bar on the conversation (prev/next/count/auto toggle) when the current agent owns ≥2 wallpapers; switching sessions swaps to that agent's set

## Requirements

- A DSH checkout at `0.1.0-rc.5` (web profile), with the web frontend built (`pnpm run build:web` or a prior `pnpm run build`)
- Node ≥ 22, pnpm ≥ 10

## Install

From the directory where you keep this repo (absolute paths work too):

```bash
dsh plugin --profile web add /path/to/dsh-chat-customizer
```

or from a DSH checkout:

```bash
pnpm dsh plugin --profile web add /path/to/dsh-chat-customizer
```

The plugin is added to the `web` profile's bundle stack, disables the stock `ui-sidebar`, and mounts the dual-mode shell. **Restart the web server** (`dsh web`) for the plugin set to take effect.

> Tip: `dsh plugin --profile web add` accepts a relative path anchored to the invoking directory, or `link:`/`file:` specs — pick whatever your DSH version supports.

## Build from source

The repo ships a prebuilt `lib/` (the browser bundle + host entries), so installation works without building. To rebuild:

```bash
pnpm install
pnpm build
```

Building needs the DSH peer packages' types resolvable — either install the `@deepseek-ai/*` peers (version-matching your DSH) or run the build from inside a DSH checkout that has them linked.

## ui-workspace patch (optional, enables the row agent tag)

The session-row agent tag rides a **generic row-level slot** (`sidebar.workspaces.row.agent`) that stock DSH's `ui-workspace` does not declare. Without the patch the tag simply doesn't render; everything else works.

`patches/ui-workspace/` contains the five modified stock files. Apply by copying them over your DSH checkout's `packages/client/ui-workspace/src/...` (back up the originals first) and rebuilding `ui-workspace` (`pnpm --filter @deepseek-ai/dsh-client-ui-workspace exec tsc -b && pnpm --filter @deepseek-ai/dsh-client-ui-workspace exec tsdown --env.DSH_BUILD_FACE client`), then restart `dsh web`. See `patches/PATCH.md`.

## Uninstall

```bash
dsh plugin --profile web remove dsh-chat-customizer
```

Restart `dsh web` to return to the stock sidebar.

## License

MIT
