# dsh-chat-customizer

[English](./README.md)

一个为 **DSH（DeepSeek Harness）** 网页版开发的客户端插件：把侧边栏升级为双模式导航，并为聊天界面提供深度外观定制。

## 功能

- **双模式侧边栏** —— `会话`（官方的工作区/会话树）与 `联系人`（把 agent 预设当作聊天软件联系人）两个标签页；会话模式带"新会话"按钮。
- **联系人模式** —— 每个 agent 预设一行（占位头像 + 名字 + 状态）。单个会话直接打开，多个会话展开成选择列表，没有会话时通过官方流程（`agentPresets.select`）新建并绑定该人格——刷新后绑定不丢。
- **会话行 agent 标签** —— 会话树里每个会话标注其所属 agent 预设 *（需要可选的 ui-workspace 补丁，见下文）*。
- **DIY 面板** —— 侧边栏底部"DIY"按钮打开外观面板：
  - 主题色 / 按钮颜色 / 聊天字体颜色（预设 + 自定义取色器）。
  - 每个 agent 的**壁纸集**：本地图片（可多选）、图片 URL、渐变预设；沉浸模式（气泡半透明）；自动切换间隔。
- **壁纸轮播** —— 当前 agent 拥有 ≥2 张壁纸时，对话区出现浮动控制条（上一张 / 计数 / 下一张 / 自动切换）。切换会话自动换到对应 agent 的壁纸集。

## 环境要求

- DSH 检出目录 `0.1.0-rc.5`，且网页前端已构建（`pnpm run build:web`）。
- Node ≥ 22，pnpm ≥ 10。

## 安装

在存放本仓库的目录下执行（也支持绝对路径）：

```bash
dsh plugin --profile web add /path/to/dsh-chat-customizer
```

或在 DSH 检出目录内：

```bash
pnpm dsh plugin --profile web add /path/to/dsh-chat-customizer
```

插件会加入 `web` profile 的 bundle 栈，禁用官方 `ui-sidebar`，挂载双模式侧边栏。**重启网页服务**（`dsh web`）后生效。

> 仓库自带构建好的 `lib/`，无需构建即可安装使用。

## 从源码构建

```bash
pnpm install
pnpm build
```

构建需要能解析 `@deepseek-ai/*` 的 peer 类型——安装版本匹配的 peer，或在已链接这些包的 DSH 检出目录内构建。

## ui-workspace 补丁（可选，启用会话行 agent 标签）

会话行标签依赖一个通用的行级插槽（`sidebar.workspaces.row.agent`），官方 `ui-workspace` 并未声明它。不打补丁时标签不显示，其余功能不受影响。

`patches/ui-workspace/` 包含 5 个改动后的官方文件。备份原件后复制到检出目录的 `packages/client/ui-workspace/src/...`，重建 `ui-workspace`（`tsc -b` + `tsdown --env.DSH_BUILD_FACE client`），重启 `dsh web`。详见 `patches/PATCH.md`。

## 卸载

```bash
dsh plugin --profile web remove dsh-chat-customizer
```

重启 `dsh web` 即可恢复官方侧边栏。

## 许可证

MIT
