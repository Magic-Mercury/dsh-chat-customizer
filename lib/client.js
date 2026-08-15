window.__ModuleLoader__.load({
	id: "dsh-chat-customizer",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region lib/types/client/contacts-store.js
		/**
		* Contacts roster controller: reads the agent-preset roster over the wire
		* (the same `agentPresets.list` RPC the settings surface uses) and exposes
		* it as a snapshot store the sidebar shell binds as the `useRoster` hook.
		*/
		const INITIAL = {
			status: "idle",
			error: null,
			presets: []
		};
		/**
		* Loads and caches the agent-preset roster.
		*/
		var ContactsController = class {
			api;
			/** Roster snapshot the renderer subscribes to (a HostObservable source). */
			store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(INITIAL);
			constructor(api) {
				this.api = api;
			}
			set(patch) {
				this.store.set({
					...this.store.getSnapshot(),
					...patch
				});
			}
			/**
			* Read the roster. An empty roster means the deployment composes no
			* presets, which is a valid deployment rather than a failure.
			* @returns once the snapshot reflects the host.
			*/
			async load() {
				if (this.store.getSnapshot().status === "loading") return;
				this.set({
					status: "loading",
					error: null
				});
				let response;
				try {
					response = await this.api.agentPresets.list({});
				} catch (error) {
					this.set({
						status: "error",
						error: error instanceof Error ? error.message : String(error)
					});
					return;
				}
				if (!response.result.ok) {
					this.set({
						status: "error",
						error: response.result.error.message
					});
					return;
				}
				const { presets } = response.result.value;
				if (presets.length === 0) {
					this.set({
						status: "unavailable",
						presets: []
					});
					return;
				}
				this.set({
					status: "ready",
					presets: presets.map((preset) => ({
						id: preset.id,
						trust: preset.trust,
						...preset.name === void 0 ? {} : { name: preset.name },
						...preset.description === void 0 ? {} : { description: preset.description },
						...preset.broken === void 0 ? {} : { broken: preset.broken }
					}))
				});
			}
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:src/client/ContactsPanel.module.css.mjs
		const css$5 = "._4amxPG_list{flex-direction:column;height:100%;padding:4px 0;display:flex;overflow-y:auto}._4amxPG_group{flex:none}._4amxPG_row{cursor:pointer;text-align:left;width:100%;color:inherit;background:0 0;border:none;align-items:center;gap:10px;padding:8px 12px;display:flex}._4amxPG_row:hover{background:var(--dsw-alias-interactive-bg-hover)}._4amxPG_avatar{color:#fff;background:linear-gradient(135deg,#07c160 0%,#10aeff 100%);border-radius:6px;flex:none;justify-content:center;align-items:center;width:40px;height:40px;font-size:18px;font-weight:600;display:flex}._4amxPG_info{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}._4amxPG_name{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-size:14px;font-weight:500;overflow:hidden}._4amxPG_sub{color:var(--dsw-alias-label-secondary);white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}._4amxPG_caret{color:var(--dsw-alias-label-tertiary);transition:transform .12s var(--ds-ease-in-out);flex:none;font-size:12px}._4amxPG_caretOpen{transform:rotate(90deg)}._4amxPG_subList{flex-direction:column;padding:2px 0 6px;display:flex}._4amxPG_subRow{cursor:pointer;text-align:left;width:100%;color:inherit;background:0 0;border:none;align-items:center;gap:8px;padding:6px 12px 6px 62px;display:flex}._4amxPG_subRow:hover{background:var(--dsw-alias-interactive-bg-hover)}._4amxPG_statusDot{background:var(--dsw-alias-label-tertiary);border-radius:50%;flex:none;width:8px;height:8px}._4amxPG_statusRunning{background:#07c160}._4amxPG_subTitle{color:var(--dsw-alias-label-secondary);white-space:nowrap;text-overflow:ellipsis;font-size:13px;overflow:hidden}._4amxPG_hint{color:var(--dsw-alias-label-secondary);text-align:center;padding:16px;font-size:13px}";
		const tagId$5 = "dsh-chat-customizer/ContactsPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var ContactsPanel_module_css_default = {
			"name": "_4amxPG_name",
			"info": "_4amxPG_info",
			"hint": "_4amxPG_hint",
			"statusDot": "_4amxPG_statusDot",
			"sub": "_4amxPG_sub",
			"subTitle": "_4amxPG_subTitle",
			"statusRunning": "_4amxPG_statusRunning",
			"row": "_4amxPG_row",
			"subRow": "_4amxPG_subRow",
			"subList": "_4amxPG_subList",
			"caret": "_4amxPG_caret",
			"avatar": "_4amxPG_avatar",
			"list": "_4amxPG_list",
			"caretOpen": "_4amxPG_caretOpen",
			"group": "_4amxPG_group"
		};
		//#endregion
		//#region lib/types/client/ContactsPanel.js
		/**
		* Contacts panel: the contacts-mode body of the dual-mode sidebar. Renders
		* one row per healthy agent preset (avatar placeholder + name + status).
		* Clicking a contact opens its single session, starts a new one bound to the
		* preset when none exists, or expands a chooser when the preset runs several
		* sessions.
		*/
		/**
		* Render the contacts list.
		* @param props - roster, session list, and session actions.
		* @returns the contact rows.
		*/
		function ContactsPanel({ roster, sessions, useWorkspaces, openSession, startWithPreset }) {
			const [expanded, setExpanded] = (0, react.useState)({});
			const archived = useWorkspaces((snapshot) => snapshot.archivedSessionIds);
			if (roster.status === "idle" || roster.status === "loading") return (0, react_jsx_runtime.jsx)("div", {
				className: ContactsPanel_module_css_default.hint,
				children: "加载联系人…"
			});
			if (roster.status === "error") return (0, react_jsx_runtime.jsx)("div", {
				className: ContactsPanel_module_css_default.hint,
				children: roster.error
			});
			if (roster.status === "unavailable") return (0, react_jsx_runtime.jsx)("div", {
				className: ContactsPanel_module_css_default.hint,
				children: "没有可用的 Agent 预设"
			});
			const sessionsByPreset = /* @__PURE__ */ new Map();
			for (const id of sessions.ids) {
				if (archived.includes(id)) continue;
				const summary = sessions.byId[id];
				if (summary === void 0 || summary.agentPreset === void 0) continue;
				const list = sessionsByPreset.get(summary.agentPreset) ?? [];
				list.push(id);
				sessionsByPreset.set(summary.agentPreset, list);
			}
			return (0, react_jsx_runtime.jsx)("div", {
				className: ContactsPanel_module_css_default.list,
				children: roster.presets.map((preset) => {
					const ids = sessionsByPreset.get(preset.id) ?? [];
					const label = preset.name ?? preset.id;
					const isExpanded = expanded[preset.id] === true;
					return (0, react_jsx_runtime.jsxs)("div", {
						className: ContactsPanel_module_css_default.group,
						children: [(0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: ContactsPanel_module_css_default.row,
							onClick: () => {
								if (ids.length === 0) startWithPreset(preset.id);
								else if (ids.length === 1 && ids[0] !== void 0) openSession(ids[0]);
								else setExpanded((prev) => ({
									...prev,
									[preset.id]: !prev[preset.id]
								}));
							},
							children: [
								(0, react_jsx_runtime.jsx)("span", {
									className: ContactsPanel_module_css_default.avatar,
									"aria-hidden": "true",
									children: label.slice(0, 1).toUpperCase()
								}),
								(0, react_jsx_runtime.jsxs)("span", {
									className: ContactsPanel_module_css_default.info,
									children: [(0, react_jsx_runtime.jsx)("span", {
										className: ContactsPanel_module_css_default.name,
										children: label
									}), (0, react_jsx_runtime.jsx)("span", {
										className: ContactsPanel_module_css_default.sub,
										children: ids.length === 0 ? preset.description ?? "未开始" : ids.length === 1 ? "已有会话" : `${ids.length} 个会话`
									})]
								}),
								ids.length > 1 && (0, react_jsx_runtime.jsx)("span", {
									className: clsx(ContactsPanel_module_css_default.caret, isExpanded && ContactsPanel_module_css_default.caretOpen),
									"aria-hidden": "true",
									children: "▸"
								})
							]
						}), isExpanded && (0, react_jsx_runtime.jsx)("div", {
							className: ContactsPanel_module_css_default.subList,
							children: ids.map((id) => {
								const summary = sessions.byId[id];
								if (summary === void 0) return null;
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: ContactsPanel_module_css_default.subRow,
									onClick: () => {
										openSession(id);
									},
									children: [(0, react_jsx_runtime.jsx)("span", { className: clsx(ContactsPanel_module_css_default.statusDot, summary.running && ContactsPanel_module_css_default.statusRunning) }), (0, react_jsx_runtime.jsx)("span", {
										className: ContactsPanel_module_css_default.subTitle,
										children: summary.displayTitle
									})]
								}, id);
							})
						})]
					}, preset.id);
				})
			});
		}
		//#endregion
		//#region \0dsh-css:src/client/SidebarShell.module.css.mjs
		const css$4 = ".qxfXna_root{background:var(--dsw-specific-sidebar-fill);min-width:0;height:100%;color:var(--dsw-alias-label-primary);flex-direction:column;font-size:14px;display:flex}.qxfXna_top{border-bottom:1px solid var(--dsw-alias-border-l2);flex:none;align-items:center;gap:4px;padding:8px 8px 4px;display:flex}.qxfXna_toggle{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:4px 6px;display:inline-flex}.qxfXna_toggle:hover{background:var(--dsw-alias-interactive-bg-hover)}.qxfXna_tabs{background:var(--dsw-alias-interactive-bg-hover);border-radius:8px;flex:1;gap:2px;min-width:0;padding:2px;display:flex}.qxfXna_tab{color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:6px;flex:1;padding:0 8px;font-size:13px;line-height:24px}.qxfXna_tabActive{background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);font-weight:600}.qxfXna_newSession{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:38px;color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:12px;flex:none;justify-content:center;align-items:center;gap:6px;margin:8px 10px 0;padding:8px 16px;font-size:14px;font-weight:500;line-height:22px;display:flex}.qxfXna_newSession:hover{background:var(--dsw-alias-interactive-bg-hover)}.qxfXna_newSessionLabel{white-space:nowrap}.qxfXna_body{flex:1;min-height:0;overflow:hidden}.qxfXna_foot{border-top:1px solid var(--dsw-alias-border-l2);flex:none}.qxfXna_footActions{flex-direction:column;display:flex}.qxfXna_footSettings{display:flex}.qxfXna_rail{background:var(--dsw-specific-sidebar-fill);flex-direction:column;align-items:center;gap:6px;height:100%;padding:12px 0 6px;display:flex}.qxfXna_railBtn{cursor:pointer;width:36px;height:36px;color:var(--dsw-alias-label-primary);background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;display:inline-flex}.qxfXna_railBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}.qxfXna_railActive{color:#07c160;background:#07c16029}.qxfXna_railFoot{justify-content:center;width:100%;margin-top:auto;display:flex}";
		const tagId$4 = "dsh-chat-customizer/SidebarShell.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var SidebarShell_module_css_default = {
			"body": "qxfXna_body",
			"foot": "qxfXna_foot",
			"rail": "qxfXna_rail",
			"toggle": "qxfXna_toggle",
			"tab": "qxfXna_tab",
			"newSessionLabel": "qxfXna_newSessionLabel",
			"footActions": "qxfXna_footActions",
			"tabActive": "qxfXna_tabActive",
			"tabs": "qxfXna_tabs",
			"root": "qxfXna_root",
			"railActive": "qxfXna_railActive",
			"newSession": "qxfXna_newSession",
			"footSettings": "qxfXna_footSettings",
			"railBtn": "qxfXna_railBtn",
			"railFoot": "qxfXna_railFoot",
			"top": "qxfXna_top"
		};
		//#endregion
		//#region lib/types/client/SidebarShell.js
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
		/**
		* Render the dual-mode sidebar column shell.
		* @param props - composed slot props.
		* @returns the sidebar element tree.
		*/
		function SidebarShell(props) {
			const { collapsed, startSession, toggleSidebar, openSession, startWithPreset, useRoster, useSessions, useWorkspaces, renderSlot } = props;
			const [mode, setMode] = (0, react.useState)("sessions");
			const roster = useRoster((snapshot) => snapshot);
			const sessions = useSessions((snapshot) => snapshot);
			if (collapsed) return (0, react_jsx_runtime.jsxs)("div", {
				className: SidebarShell_module_css_default.rail,
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: SidebarShell_module_css_default.railBtn,
						"aria-label": "展开侧边栏",
						onClick: () => {
							toggleSidebar();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, { size: 18 })
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clsx(SidebarShell_module_css_default.railBtn, mode === "contacts" && SidebarShell_module_css_default.railActive),
						"aria-label": "联系人模式",
						onClick: () => {
							setMode("contacts");
							toggleSidebar();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconUserOutline16, { size: 18 })
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clsx(SidebarShell_module_css_default.railBtn, mode === "sessions" && SidebarShell_module_css_default.railActive),
						"aria-label": "会话模式",
						onClick: () => {
							setMode("sessions");
							toggleSidebar();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16, { size: 18 })
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: SidebarShell_module_css_default.railFoot,
						children: renderSlot("sidebar.settings", { wide: false })
					})
				]
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: SidebarShell_module_css_default.root,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: SidebarShell_module_css_default.top,
						children: [(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: SidebarShell_module_css_default.toggle,
							"aria-label": "收起侧边栏",
							onClick: () => {
								toggleSidebar();
							},
							children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, { size: 16 })
						}), (0, react_jsx_runtime.jsxs)("div", {
							className: SidebarShell_module_css_default.tabs,
							role: "tablist",
							"aria-label": "侧边栏模式",
							children: [(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === "sessions",
								className: clsx(SidebarShell_module_css_default.tab, mode === "sessions" && SidebarShell_module_css_default.tabActive),
								onClick: () => {
									setMode("sessions");
								},
								children: "会话"
							}), (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === "contacts",
								className: clsx(SidebarShell_module_css_default.tab, mode === "contacts" && SidebarShell_module_css_default.tabActive),
								onClick: () => {
									setMode("contacts");
								},
								children: "联系人"
							})]
						})]
					}),
					mode === "sessions" && (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: SidebarShell_module_css_default.newSession,
						onClick: () => {
							startSession();
						},
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16, { size: 14 }), (0, react_jsx_runtime.jsx)("span", {
							className: SidebarShell_module_css_default.newSessionLabel,
							children: "新会话"
						})]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: SidebarShell_module_css_default.body,
						children: mode === "sessions" ? renderSlot("sidebar.workspaces", {
							wide: true,
							expandSidebar: () => {
								if (collapsed) toggleSidebar();
							}
						}) : (0, react_jsx_runtime.jsx)(ContactsPanel, {
							roster,
							sessions,
							useWorkspaces,
							openSession,
							startWithPreset
						})
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: SidebarShell_module_css_default.foot,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: SidebarShell_module_css_default.footActions,
							children: renderSlot("sidebar.footer.action", { wide: true })
						}), (0, react_jsx_runtime.jsx)("div", {
							className: SidebarShell_module_css_default.footSettings,
							children: renderSlot("sidebar.settings", { wide: true })
						})]
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:src/client/AgentRowTag.module.css.mjs
		const css$3 = ".pt032q_tag{white-space:nowrap;text-overflow:ellipsis;color:#07c160;background:#07c16024;border-radius:8px;flex:none;max-width:96px;margin-left:6px;padding:0 6px;font-size:11px;line-height:16px;overflow:hidden}";
		const tagId$3 = "dsh-chat-customizer/AgentRowTag.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var AgentRowTag_module_css_default = { "tag": "pt032q_tag" };
		//#endregion
		//#region lib/types/client/AgentRowTag.js
		/**
		* Render the row agent tag.
		* @param props - session facts and the roster hook.
		* @returns the tag, or null when there is nothing to name.
		*/
		function AgentRowTag({ agentPreset, useRoster }) {
			if (agentPreset === void 0) return null;
			const roster = useRoster((snapshot) => snapshot);
			const label = (roster.status === "ready" ? roster.presets.find((p) => p.id === agentPreset) : void 0)?.name ?? agentPreset;
			return (0, react_jsx_runtime.jsx)("span", {
				className: AgentRowTag_module_css_default.tag,
				title: agentPreset,
				children: label
			});
		}
		//#endregion
		//#region lib/types/client/diy-store.js
		/**
		* DIY settings store: custom UI color overrides + conversation wallpaper,
		* persisted to localStorage and applied to the document root as CSS variable
		* overrides (theme aliases for colors, --dsh-wallpaper-image for the chat
		* background). Pure DOM/state — no core package changes.
		*/
		/** localStorage key for DIY settings. */
		const STORAGE_KEY = "dsh.diy.settings";
		/** Accent preset palette. */
		const ACCENT_PRESETS = [
			"#07c160",
			"#4d6bfe",
			"#8b5cf6",
			"#f59e0b",
			"#ef4444",
			"#06b6d4",
			"#ec4899"
		];
		/** Button-fill preset palette. */
		const BUTTON_PRESETS = [
			"#07c160",
			"#4d6bfe",
			"#8b5cf6",
			"#f59e0b",
			"#ef4444",
			"#06b6d4",
			"#334155"
		];
		/** Chat text-color preset palette (a "reset to theme" entry lives in the panel). */
		const TEXT_PRESETS = [
			"#1a1a1a",
			"#e6e9ef",
			"#07c160",
			"#4d6bfe",
			"#8b5cf6",
			"#f59e0b",
			"#ef4444",
			"#ec4899",
			"#06b6d4"
		];
		/** Built-in wallpaper presets (CSS background-image values). */
		const WALLPAPER_PRESETS = [
			{
				id: "none",
				label: "无",
				value: ""
			},
			{
				id: "mist",
				label: "晨雾",
				value: "linear-gradient(160deg, #e0eafc 0%, #cfdef3 100%)"
			},
			{
				id: "sunset",
				label: "落日",
				value: "linear-gradient(160deg, #ffecd2 0%, #fcb69f 100%)"
			},
			{
				id: "mint",
				label: "薄荷",
				value: "linear-gradient(160deg, #d4fc79 0%, #96e6a1 100%)"
			},
			{
				id: "night",
				label: "星空",
				value: "linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)"
			},
			{
				id: "blush",
				label: "玫瑰",
				value: "linear-gradient(160deg, #ff9a9e 0%, #fecfef 100%)"
			}
		];
		/** Read persisted settings; falls back to empty when absent or corrupt. */
		function loadSettings() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw === null) return {};
				const parsed = JSON.parse(raw);
				if (typeof parsed !== "object" || parsed === null) return {};
				const s = parsed;
				return {
					...typeof s.accent === "string" ? { accent: s.accent } : {},
					...typeof s.buttonFill === "string" ? { buttonFill: s.buttonFill } : {},
					...typeof s.textColor === "string" ? { textColor: s.textColor } : {},
					...typeof s.wallpaper === "string" ? { wallpaper: s.wallpaper } : {},
					...typeof s.perAgent === "object" && s.perAgent !== null ? { perAgent: s.perAgent } : {},
					...typeof s.immersive === "boolean" ? { immersive: s.immersive } : {},
					...typeof s.wallpaperInterval === "number" ? { wallpaperInterval: s.wallpaperInterval } : {}
				};
			} catch {
				return {};
			}
		}
		/** Persist settings; storage failures (quota) are non-fatal — the live
		* session keeps the applied look, only persistence is lost. */
		function saveSettings(settings) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
			} catch (error) {
				console.warn("[ui-contacts] DIY settings save failed:", error);
			}
		}
		/** Clear persisted settings. */
		function clearSettings() {
			localStorage.removeItem(STORAGE_KEY);
		}
		/**
		* Apply settings to the document: color overrides and the wallpaper variable
		* are written to BODY inline style — the same layer the theme presenter uses,
		* so a later write wins and the override beats the html-root fallback. The
		* immersive (translucent bubbles) body class toggles separately. Empty/absent
		* values remove the override so the theme's own value wins again.
		* @param settings - the settings to apply.
		* @param presetId - the current agent preset; selects its per-agent wallpaper set.
		* @param wallpaperIndex - index into the agent's set; 0 by default.
		*/
		function applySettings(settings, presetId, wallpaperIndex = 0) {
			const body = document.body;
			setVar(body, "--dsw-alias-state-business-primary", settings.accent);
			setVar(body, "--dsh-chat-text-color", settings.textColor);
			setVar(body, "--dsw-alias-button-elevated-fill", settings.buttonFill);
			const wallpaper = wallpaperAt(settings, presetId, wallpaperIndex);
			setVar(body, "--dsh-wallpaper-image", wallpaperValue(wallpaper));
			const wallpaperOn = wallpaper !== void 0 && wallpaper !== "";
			body.classList.toggle("dsh-wallpaper-active", wallpaperOn);
			body.classList.toggle("dsh-wallpaper-on", wallpaperOn && settings.immersive === true);
		}
		/**
		* The agent's wallpaper list (normalized: legacy single values become a
		* one-element list; an absent entry yields an empty list).
		* @param settings - the DIY settings.
		* @param presetId - the agent preset id.
		* @returns the agent's wallpapers in display order.
		*/
		function agentWallpapers(settings, presetId) {
			const entry = settings.perAgent?.[presetId];
			if (entry === void 0) return [];
			return Array.isArray(entry) ? entry : [entry];
		}
		/**
		* The wallpaper to show for a preset at an index: the agent's set when it
		* has one (cycled), else the default `wallpaper`.
		* @param settings - the DIY settings.
		* @param presetId - the agent preset id (undefined uses only the default).
		* @param index - position in the agent's set (wrapped by the set length).
		* @returns the wallpaper value, or undefined for none.
		*/
		function wallpaperAt(settings, presetId, index) {
			if (presetId !== void 0) {
				const list = agentWallpapers(settings, presetId);
				if (list.length > 0) return list[(index % list.length + list.length) % list.length];
			}
			return settings.wallpaper;
		}
		let cursor = {
			preset: void 0,
			index: 0
		};
		/** Registered by the plugin apply: (preset, index) => applySettings(loadSettings(), preset, index). */
		let cursorApplier;
		/** Auto-advance timer handle. */
		let cursorTimer;
		/** Monotonic cursor version + listeners (the floating controls subscribe). */
		let cursorVersion = 0;
		const cursorListeners = /* @__PURE__ */ new Set();
		/** Subscribe to cursor moves (manual/auto/session changes). */
		function subscribeWallpaperCursor(listener) {
			cursorListeners.add(listener);
			return () => {
				cursorListeners.delete(listener);
			};
		}
		/** The cursor version (useSyncExternalStore snapshot). */
		function wallpaperCursorVersion() {
			return cursorVersion;
		}
		function notifyCursor() {
			cursorVersion += 1;
			for (const listener of [...cursorListeners]) listener();
		}
		/** Bind the cursor applier (the plugin's apply); idempotent. */
		function bindWallpaperCursor(fn) {
			cursorApplier = fn;
		}
		/** The current carousel position (for the floating controls). */
		function wallpaperCursor() {
			return cursor;
		}
		/** Reset the cursor to a new preset (session switch): index 0 + re-sync the timer. */
		function setWallpaperPreset(preset) {
			cursor = {
				preset,
				index: 0
			};
			notifyCursor();
			syncWallpaperTimer();
		}
		/** Move the carousel (manual next/prev); re-applies and re-syncs. */
		function advanceWallpaper(delta) {
			cursor = {
				...cursor,
				index: Math.max(0, cursor.index + delta)
			};
			cursorApplier?.(cursor.preset, cursor.index);
			notifyCursor();
			syncWallpaperTimer();
		}
		/**
		* (Re)start the auto-advance timer from settings: interval > 0 and the
		* current agent owning ≥2 wallpapers. Stopped otherwise.
		*/
		function syncWallpaperTimer() {
			if (cursorTimer !== void 0) {
				window.clearInterval(cursorTimer);
				cursorTimer = void 0;
			}
			const settings = loadSettings();
			const interval = settings.wallpaperInterval;
			if (interval === void 0 || interval <= 0) return;
			if (cursor.preset === void 0 || agentWallpapers(settings, cursor.preset).length < 2) return;
			cursorTimer = window.setInterval(() => {
				advanceWallpaper(1);
			}, interval * 1e3);
		}
		/**
		* Resolve the applied wallpaper value to a legal background-image value:
		* gradient presets pass through, url("…") links pass through, and bare data
		* URLs (local-file wallpapers) get wrapped in url("…") — a raw data URL is
		* not a valid background-image and would silently render nothing.
		* @param wallpaper - the stored wallpaper value.
		* @returns the background-image value, or undefined for none.
		*/
		function wallpaperValue(wallpaper) {
			if (wallpaper === void 0 || wallpaper === "") return void 0;
			if (wallpaper.startsWith("linear-gradient")) return wallpaper;
			if (wallpaper.startsWith("url(")) return wallpaper;
			return `url("${wallpaper}")`;
		}
		/** Set one CSS variable, removing it when the value is absent. */
		function setVar(root, name, value) {
			if (value === void 0 || value === "") root.style.removeProperty(name);
			else root.style.setProperty(name, value);
		}
		/** Injected style tag wiring the wallpaper variable into the conversation column. */
		let wallpaperStyle = null;
		/**
		* Install the wallpaper CSS seams once: the conversation column root carries
		* `data-phase` in hero/active/settling states (the wallpaper consumer), and
		* the immersive class makes the user bubble translucent so the wallpaper
		* shows through. Idempotent.
		*/
		function ensureWallpaperCss() {
			if (wallpaperStyle !== null) return;
			const style = document.createElement("style");
			style.dataset.plugin = "dsh-contacts-wallpaper";
			style.textContent = [
				"[data-phase='hero'],[data-phase='active'],[data-phase='settling']{",
				"background-image:var(--dsh-wallpaper-image,none) !important;",
				"background-size:cover;background-position:center;background-repeat:no-repeat;",
				"}",
				"body.dsh-wallpaper-on{",
				"--dsw-specific-bubble:color-mix(in srgb, var(--dsw-static-deepseek-50) 78%, transparent);",
				"}",
				"body.dsh-wallpaper-on[data-ds-dark-theme]{",
				"--dsw-specific-bubble:color-mix(in srgb, var(--dsw-static-neutral-bluish-850) 78%, transparent);",
				"}",
				"body.dsh-wallpaper-active [data-composer-seat]{",
				"background:transparent !important;",
				"}",
				"[data-phase='hero'],[data-phase='active'],[data-phase='settling']{",
				"--dsw-alias-label-primary:var(--dsh-chat-text-color,var(--dsw-alias-label-primary));",
				"--dsw-alias-label-secondary:color-mix(in srgb,var(--dsh-chat-text-color,var(--dsw-alias-label-secondary)) 72%,transparent);",
				"--dsw-alias-label-tertiary:color-mix(in srgb,var(--dsh-chat-text-color,var(--dsw-alias-label-tertiary)) 52%,transparent);",
				"}"
			].join("");
			document.head.appendChild(style);
			wallpaperStyle = style;
		}
		//#endregion
		//#region \0dsh-css:src/client/DiyPanel.module.css.mjs
		const css$2 = "._0d8eUG_body{flex-direction:column;gap:18px;padding:4px 0 8px;display:flex}._0d8eUG_section{flex-direction:column;gap:8px;display:flex}._0d8eUG_sectionTitle{color:var(--dsw-alias-label-primary);margin:0;font-size:13px;font-weight:600}._0d8eUG_wallpaperHint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}._0d8eUG_targetRow{align-items:center;gap:8px;display:flex}._0d8eUG_targetLabel{color:var(--dsw-alias-label-secondary);flex:none;font-size:12px}._0d8eUG_targetSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);min-width:0;color:var(--dsw-alias-label-primary);border-radius:8px;flex:1;padding:5px 8px;font-size:13px}._0d8eUG_targetSelect:focus{border-color:var(--dsw-alias-state-business-primary);outline:none}._0d8eUG_targetSelect option{background:var(--dsw-specific-sidebar-fill);color:var(--dsw-alias-label-primary)}._0d8eUG_clearBtn{color:var(--dsw-alias-state-error-primary);cursor:pointer;background:0 0;border:none;align-self:flex-start;padding:2px 0;font-size:12px}._0d8eUG_clearBtn:hover{text-decoration:underline}._0d8eUG_swatches{flex-wrap:wrap;align-items:center;gap:8px;display:flex}._0d8eUG_swatch{cursor:pointer;border:2px solid #0000;border-radius:50%;width:28px;height:28px;padding:0}._0d8eUG_swatch:hover{transform:scale(1.1)}._0d8eUG_swatchActive{border-color:var(--dsw-alias-label-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 30%, transparent)}._0d8eUG_themeSwatch{background:linear-gradient(135deg,#1a1a1a 50%,#e6e9ef 50%)}._0d8eUG_customColor{border:1px dashed var(--dsw-alias-border-l2);cursor:pointer;border-radius:50%;width:28px;height:28px;position:relative;overflow:hidden}._0d8eUG_customColor input{cursor:pointer;border:none;width:40px;height:40px;position:absolute;inset:-6px}._0d8eUG_wallpapers,._0d8eUG_setList{flex-wrap:wrap;gap:8px;display:flex}._0d8eUG_setItem{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex:none;width:72px;height:44px;position:relative;overflow:hidden}._0d8eUG_setThumb{width:100%;height:100%;display:block}._0d8eUG_setIndex{color:#fff;background:#0000008c;border-radius:4px;padding:0 4px;font-size:10px;line-height:14px;position:absolute;top:3px;left:3px}._0d8eUG_setRemove{color:#fff;cursor:pointer;background:#0000008c;border:none;border-radius:50%;justify-content:center;align-items:center;width:16px;height:16px;font-size:10px;line-height:1;display:flex;position:absolute;top:2px;right:2px}._0d8eUG_setRemove:hover{background:var(--dsw-alias-state-error-primary)}._0d8eUG_intervalRow{color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;margin-top:10px;font-size:13px;display:flex}._0d8eUG_intervalInput{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);width:72px;color:var(--dsw-alias-label-primary);border-radius:8px;padding:5px 8px;font-size:13px}._0d8eUG_intervalInput:focus{border-color:var(--dsw-alias-state-business-primary);outline:none}._0d8eUG_intervalHint{color:var(--dsw-alias-label-tertiary);font-size:12px}._0d8eUG_wallpaper{cursor:pointer;border:2px solid #0000;border-radius:8px;justify-content:center;align-items:center;width:72px;height:44px;padding:0;display:flex}._0d8eUG_wallpaper:hover{transform:scale(1.04)}._0d8eUG_wallpaperActive{border-color:var(--dsw-alias-label-primary)}._0d8eUG_wallpaperNone{color:var(--dsw-alias-label-secondary);font-size:12px}._0d8eUG_urlRow{align-items:center;gap:8px;margin-top:4px;display:flex}._0d8eUG_urlLabel{color:var(--dsw-alias-label-secondary);flex:none;font-size:12px}._0d8eUG_urlInput{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);min-width:0;color:var(--dsw-alias-label-primary);border-radius:8px;flex:1;padding:6px 10px;font-size:13px}._0d8eUG_urlInput:focus{border-color:var(--dsw-alias-state-business-primary);outline:none}._0d8eUG_localRow{align-items:center;gap:8px;margin-top:8px;display:flex}._0d8eUG_localBtn{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:8px;padding:6px 12px;font-size:13px}._0d8eUG_localBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}._0d8eUG_localError{color:var(--dsw-alias-state-error-primary);font-size:12px}._0d8eUG_immersive{color:var(--dsw-alias-label-secondary);cursor:pointer;user-select:none;align-items:center;gap:8px;margin-top:10px;font-size:13px;display:flex}._0d8eUG_immersive input{accent-color:var(--dsw-alias-state-business-primary);cursor:pointer}._0d8eUG_reset{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:8px;padding:6px 12px;font-size:13px}._0d8eUG_reset:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}";
		const tagId$2 = "dsh-chat-customizer/DiyPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var DiyPanel_module_css_default = {
			"customColor": "_0d8eUG_customColor",
			"section": "_0d8eUG_section",
			"localBtn": "_0d8eUG_localBtn",
			"setThumb": "_0d8eUG_setThumb",
			"setIndex": "_0d8eUG_setIndex",
			"immersive": "_0d8eUG_immersive",
			"localRow": "_0d8eUG_localRow",
			"intervalHint": "_0d8eUG_intervalHint",
			"swatches": "_0d8eUG_swatches",
			"urlRow": "_0d8eUG_urlRow",
			"body": "_0d8eUG_body",
			"clearBtn": "_0d8eUG_clearBtn",
			"setRemove": "_0d8eUG_setRemove",
			"wallpaperNone": "_0d8eUG_wallpaperNone",
			"targetLabel": "_0d8eUG_targetLabel",
			"setList": "_0d8eUG_setList",
			"targetSelect": "_0d8eUG_targetSelect",
			"setItem": "_0d8eUG_setItem",
			"intervalInput": "_0d8eUG_intervalInput",
			"sectionTitle": "_0d8eUG_sectionTitle",
			"wallpaperHint": "_0d8eUG_wallpaperHint",
			"targetRow": "_0d8eUG_targetRow",
			"themeSwatch": "_0d8eUG_themeSwatch",
			"swatchActive": "_0d8eUG_swatchActive",
			"wallpapers": "_0d8eUG_wallpapers",
			"wallpaper": "_0d8eUG_wallpaper",
			"wallpaperActive": "_0d8eUG_wallpaperActive",
			"urlInput": "_0d8eUG_urlInput",
			"intervalRow": "_0d8eUG_intervalRow",
			"localError": "_0d8eUG_localError",
			"reset": "_0d8eUG_reset",
			"swatch": "_0d8eUG_swatch",
			"urlLabel": "_0d8eUG_urlLabel"
		};
		//#endregion
		//#region lib/types/client/DiyPanel.js
		/**
		* DIY settings panel: accent/button/text color pickers plus per-agent
		* wallpaper SET management (add local images, URLs, or gradient presets;
		* remove; auto-advance interval). Every change applies immediately and
		* persists to localStorage.
		*/
		/** Maximum encoded data-URL length kept small enough for localStorage (UTF-16 doubles it). */
		const WALLPAPER_BUDGET = 15e5;
		/** Encode a canvas as WebP, falling back to JPEG when unsupported. */
		function encodeCanvas(canvas, quality) {
			let dataUrl = canvas.toDataURL("image/webp", quality);
			if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/jpeg", quality);
			return dataUrl;
		}
		/**
		* Scale an image to a wallpaper-sized data URL, stepping down edge/quality
		* until it fits the storage budget.
		* @param img - the decoded image.
		* @returns a compressed data URL.
		*/
		function scaledWallpaper(img) {
			for (const [edge, quality] of [[1280, .82], [960, .72]]) {
				const scale = Math.min(1, edge / Math.max(img.width, img.height));
				const width = Math.max(1, Math.round(img.width * scale));
				const height = Math.max(1, Math.round(img.height * scale));
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d");
				if (context === null) throw new Error("Canvas 不可用");
				context.drawImage(img, 0, 0, width, height);
				const dataUrl = encodeCanvas(canvas, quality);
				if (dataUrl.length <= WALLPAPER_BUDGET) return dataUrl;
			}
			throw new Error("图片过大，请换一张尺寸小一点的图片");
		}
		/**
		* Read a local image file and compress it to a data URL.
		* @param file - the picked image file.
		* @returns a data URL usable as a CSS background-image value.
		*/
		function fileToWallpaper(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onerror = () => {
					reject(/* @__PURE__ */ new Error("读取文件失败"));
				};
				reader.onload = () => {
					const img = new Image();
					img.onerror = () => {
						reject(/* @__PURE__ */ new Error("图片解码失败（请使用 JPG/PNG/WebP 格式）"));
					};
					img.onload = () => {
						try {
							resolve(scaledWallpaper(img));
						} catch (error) {
							reject(error instanceof Error ? error : new Error(String(error)));
						}
					};
					img.src = String(reader.result);
				};
				reader.readAsDataURL(file);
			});
		}
		/**
		* The wallpaper list for the active target (default keeps at most one).
		*/
		function listFor(settings, target) {
			if (target === "default") return settings.wallpaper === void 0 ? [] : [settings.wallpaper];
			const entry = settings.perAgent?.[target];
			if (entry === void 0) return [];
			return Array.isArray(entry) ? [...entry] : [entry];
		}
		/**
		* Render the DIY settings dialog.
		* @param props - open state, close callback, and the agent roster.
		* @returns the modal, or null while closed.
		*/
		function DiyPanel({ open, onClose, roster }) {
			const [settings, setSettings] = (0, react.useState)(() => loadSettings());
			const [target, setTarget] = (0, react.useState)("default");
			const [list, setList] = (0, react.useState)([]);
			const [draftUrl, setDraftUrl] = (0, react.useState)("");
			const [localError, setLocalError] = (0, react.useState)(null);
			const fileRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!open) return;
				const loaded = loadSettings();
				setSettings(loaded);
				setTarget("default");
				setList(listFor(loaded, "default"));
				setDraftUrl("");
				setLocalError(null);
			}, [open]);
			const update = (patch) => {
				const next = {
					...settings,
					...patch
				};
				setSettings(next);
				applySettings(next, target === "default" ? void 0 : target, 0);
				saveSettings(next);
			};
			/** Clear the chat text color (back to the theme's own value). */
			const clearTextColor = () => {
				const next = { ...settings };
				delete next.textColor;
				setSettings(next);
				applySettings(next, target === "default" ? void 0 : target);
				saveSettings(next);
			};
			/** Persist the active target's wallpaper list (default keeps a single value). */
			const saveList = (nextList) => {
				const next = { ...settings };
				if (target === "default") if (nextList.length > 0 && nextList[0] !== void 0) next.wallpaper = nextList[0];
				else delete next.wallpaper;
				else {
					const perAgent = { ...settings.perAgent ?? {} };
					if (nextList.length > 0) perAgent[target] = nextList;
					else delete perAgent[target];
					next.perAgent = perAgent;
				}
				setSettings(next);
				applySettings(next, target === "default" ? void 0 : target, 0);
				saveSettings(next);
				syncWallpaperTimer();
			};
			/** Append one wallpaper to the active target's set. */
			const addWallpaper = (value) => {
				const nextList = [...list, value];
				setList(nextList);
				saveList(nextList);
			};
			/** Remove one wallpaper from the active target's set. */
			const removeWallpaperAt = (index) => {
				const nextList = list.filter((_, i) => i !== index);
				setList(nextList);
				saveList(nextList);
			};
			/** Clear the active target's whole set. */
			const clearWallpapers = () => {
				setList([]);
				saveList([]);
			};
			const onTargetChange = (next) => {
				setTarget(next);
				setList(listFor(settings, next));
				setDraftUrl("");
				setLocalError(null);
			};
			/** Pick local images, compress them, and append them to the set. */
			const onFilesPicked = async (event) => {
				const files = [...event.target.files ?? []];
				event.target.value = "";
				if (files.length === 0) return;
				try {
					const added = [];
					for (const file of files) added.push(await fileToWallpaper(file));
					const nextList = [...list, ...added];
					setList(nextList);
					setLocalError(null);
					saveList(nextList);
				} catch (error) {
					setLocalError(error instanceof Error ? error.message : String(error));
				}
			};
			const reset = () => {
				setSettings({});
				setList([]);
				setDraftUrl("");
				setLocalError(null);
				applySettings({});
				clearSettings();
				syncWallpaperTimer();
			};
			/** Auto-advance interval (seconds; 0 = manual). */
			const intervalSec = settings.wallpaperInterval ?? 0;
			const setIntervalSec = (value) => {
				const n = Math.max(0, Math.floor(value));
				const next = { ...settings };
				if (n > 0) next.wallpaperInterval = n;
				else delete next.wallpaperInterval;
				setSettings(next);
				applySettings(next, target === "default" ? void 0 : target, 0);
				saveSettings(next);
				syncWallpaperTimer();
			};
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open,
				onClose,
				title: "DIY 设置",
				closeLabel: "关闭",
				footer: (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: DiyPanel_module_css_default.reset,
					onClick: reset,
					children: "恢复默认"
				}),
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: DiyPanel_module_css_default.body,
					children: [
						(0, react_jsx_runtime.jsxs)("section", {
							className: DiyPanel_module_css_default.section,
							children: [(0, react_jsx_runtime.jsx)("h3", {
								className: DiyPanel_module_css_default.sectionTitle,
								children: "主题色"
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: DiyPanel_module_css_default.swatches,
								children: [ACCENT_PRESETS.map((color) => (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(DiyPanel_module_css_default.swatch, settings.accent === color && DiyPanel_module_css_default.swatchActive),
									style: { background: color },
									"aria-label": `主题色 ${color}`,
									onClick: () => {
										update({ accent: color });
									}
								}, color)), (0, react_jsx_runtime.jsx)("label", {
									className: DiyPanel_module_css_default.customColor,
									title: "自定义颜色",
									children: (0, react_jsx_runtime.jsx)("input", {
										type: "color",
										value: settings.accent ?? "#07c160",
										onChange: (e) => {
											update({ accent: e.target.value });
										}
									})
								})]
							})]
						}),
						(0, react_jsx_runtime.jsxs)("section", {
							className: DiyPanel_module_css_default.section,
							children: [(0, react_jsx_runtime.jsx)("h3", {
								className: DiyPanel_module_css_default.sectionTitle,
								children: "按钮颜色"
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: DiyPanel_module_css_default.swatches,
								children: [BUTTON_PRESETS.map((color) => (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(DiyPanel_module_css_default.swatch, settings.buttonFill === color && DiyPanel_module_css_default.swatchActive),
									style: { background: color },
									"aria-label": `按钮色 ${color}`,
									onClick: () => {
										update({ buttonFill: color });
									}
								}, color)), (0, react_jsx_runtime.jsx)("label", {
									className: DiyPanel_module_css_default.customColor,
									title: "自定义颜色",
									children: (0, react_jsx_runtime.jsx)("input", {
										type: "color",
										value: settings.buttonFill ?? "#07c160",
										onChange: (e) => {
											update({ buttonFill: e.target.value });
										}
									})
								})]
							})]
						}),
						(0, react_jsx_runtime.jsxs)("section", {
							className: DiyPanel_module_css_default.section,
							children: [(0, react_jsx_runtime.jsx)("h3", {
								className: DiyPanel_module_css_default.sectionTitle,
								children: "字体颜色（聊天区）"
							}), (0, react_jsx_runtime.jsxs)("div", {
								className: DiyPanel_module_css_default.swatches,
								children: [
									(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: clsx(DiyPanel_module_css_default.swatch, DiyPanel_module_css_default.themeSwatch, settings.textColor === void 0 && DiyPanel_module_css_default.swatchActive),
										"aria-label": "跟随主题",
										title: "跟随主题",
										onClick: clearTextColor
									}),
									TEXT_PRESETS.map((color) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: clsx(DiyPanel_module_css_default.swatch, settings.textColor === color && DiyPanel_module_css_default.swatchActive),
										style: { background: color },
										"aria-label": `字体颜色 ${color}`,
										onClick: () => {
											update({ textColor: color });
										}
									}, color)),
									(0, react_jsx_runtime.jsx)("label", {
										className: DiyPanel_module_css_default.customColor,
										title: "自定义颜色",
										children: (0, react_jsx_runtime.jsx)("input", {
											type: "color",
											value: settings.textColor ?? "#1a1a1a",
											onChange: (e) => {
												update({ textColor: e.target.value });
											}
										})
									})
								]
							})]
						}),
						(0, react_jsx_runtime.jsxs)("section", {
							className: DiyPanel_module_css_default.section,
							children: [
								(0, react_jsx_runtime.jsx)("h3", {
									className: DiyPanel_module_css_default.sectionTitle,
									children: "聊天壁纸（壁纸集）"
								}),
								(0, react_jsx_runtime.jsx)("p", {
									className: DiyPanel_module_css_default.wallpaperHint,
									children: "推荐分辨率 1920×1080（16:9 横图）或更高；每个 agent 可配多张，对话区右下角可手动/自动切换"
								}),
								(0, react_jsx_runtime.jsxs)("label", {
									className: DiyPanel_module_css_default.targetRow,
									children: [(0, react_jsx_runtime.jsx)("span", {
										className: DiyPanel_module_css_default.targetLabel,
										children: "应用给"
									}), (0, react_jsx_runtime.jsxs)("select", {
										className: DiyPanel_module_css_default.targetSelect,
										value: target,
										onChange: (e) => {
											onTargetChange(e.target.value);
										},
										children: [(0, react_jsx_runtime.jsx)("option", {
											value: "default",
											children: "默认壁纸（所有 agent）"
										}), roster.status === "ready" && roster.presets.map((preset) => (0, react_jsx_runtime.jsx)("option", {
											value: preset.id,
											children: preset.name ?? preset.id
										}, preset.id))]
									})]
								}),
								list.length > 0 && (0, react_jsx_runtime.jsx)("div", {
									className: DiyPanel_module_css_default.setList,
									children: list.map((wallpaper, index) => (0, react_jsx_runtime.jsxs)("div", {
										className: DiyPanel_module_css_default.setItem,
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												className: DiyPanel_module_css_default.setThumb,
												style: wallpaper.startsWith("linear-gradient") ? { background: wallpaper } : {
													backgroundImage: `url("${wallpaper}")`,
													backgroundSize: "cover",
													backgroundPosition: "center"
												}
											}),
											(0, react_jsx_runtime.jsx)("span", {
												className: DiyPanel_module_css_default.setIndex,
												children: index + 1
											}),
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: DiyPanel_module_css_default.setRemove,
												"aria-label": `删除第 ${index + 1} 张`,
												onClick: () => {
													removeWallpaperAt(index);
												},
												children: "✕"
											})
										]
									}, index))
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: DiyPanel_module_css_default.wallpapers,
									children: WALLPAPER_PRESETS.map((preset) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: DiyPanel_module_css_default.wallpaper,
										style: preset.value === "" ? void 0 : { background: preset.value },
										"aria-label": preset.label,
										title: preset.label,
										onClick: () => {
											if (preset.value === "") clearWallpapers();
											else addWallpaper(preset.value);
										},
										children: preset.value === "" && (0, react_jsx_runtime.jsx)("span", {
											className: DiyPanel_module_css_default.wallpaperNone,
											children: "无"
										})
									}, preset.id))
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: DiyPanel_module_css_default.urlRow,
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											className: DiyPanel_module_css_default.urlLabel,
											children: "添加图片 URL"
										}),
										(0, react_jsx_runtime.jsx)("input", {
											type: "text",
											className: DiyPanel_module_css_default.urlInput,
											placeholder: "https://example.com/bg.png",
											value: draftUrl,
											onChange: (e) => {
												setDraftUrl(e.target.value);
											},
											onKeyDown: (e) => {
												if (e.key !== "Enter") return;
												const value = draftUrl.trim();
												if (value === "") return;
												addWallpaper(`url("${value}")`);
												setDraftUrl("");
											}
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: DiyPanel_module_css_default.localBtn,
											onClick: () => {
												const value = draftUrl.trim();
												if (value === "") return;
												addWallpaper(`url("${value}")`);
												setDraftUrl("");
											},
											children: "添加"
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: DiyPanel_module_css_default.localRow,
									children: [
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: DiyPanel_module_css_default.localBtn,
											onClick: () => {
												fileRef.current?.click();
											},
											children: "添加本地图片…"
										}),
										(0, react_jsx_runtime.jsx)("input", {
											ref: fileRef,
											type: "file",
											accept: "image/*",
											multiple: true,
											hidden: true,
											onChange: (e) => {
												onFilesPicked(e);
											}
										}),
										localError !== null && (0, react_jsx_runtime.jsx)("span", {
											className: DiyPanel_module_css_default.localError,
											children: localError
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("label", {
									className: DiyPanel_module_css_default.intervalRow,
									children: [
										(0, react_jsx_runtime.jsx)("span", { children: "自动切换间隔（秒）" }),
										(0, react_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											step: 5,
											className: DiyPanel_module_css_default.intervalInput,
											value: intervalSec,
											onChange: (e) => {
												setIntervalSec(Number(e.target.value));
											}
										}),
										(0, react_jsx_runtime.jsx)("span", {
											className: DiyPanel_module_css_default.intervalHint,
											children: "0 = 手动"
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("label", {
									className: DiyPanel_module_css_default.immersive,
									children: [(0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.immersive === true,
										onChange: (e) => {
											update({ immersive: e.target.checked });
										}
									}), (0, react_jsx_runtime.jsx)("span", { children: "沉浸模式（气泡半透明，壁纸透出）" })]
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:src/client/DiyButton.module.css.mjs
		const css$1 = ".Vtef6a_action{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:8px;justify-content:center;align-items:center;gap:6px;padding:6px 10px;font-size:13px;line-height:1;display:inline-flex}.Vtef6a_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Vtef6a_railAction{width:36px;height:36px;color:var(--dsw-alias-label-primary);border-radius:50%;padding:0}.Vtef6a_label{white-space:nowrap}";
		const tagId$1 = "dsh-chat-customizer/DiyButton.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var DiyButton_module_css_default = {
			"railAction": "Vtef6a_railAction",
			"action": "Vtef6a_action",
			"label": "Vtef6a_label"
		};
		//#endregion
		//#region lib/types/client/DiyButton.js
		/**
		* DIY settings entry: a footer action that opens the DIY panel. Renders as a
		* labeled row when the sidebar is wide and an icon-only control on the rail.
		*/
		/**
		* Render the DIY footer action and its modal panel.
		* @param props - the footer-action owner share plus the roster hook.
		* @returns the action button plus the (portal) panel.
		*/
		function DiyButton({ wide, useRoster }) {
			const [open, setOpen] = (0, react.useState)(false);
			const roster = useRoster((snapshot) => snapshot);
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: clsx(DiyButton_module_css_default.action, !wide && DiyButton_module_css_default.railAction),
				"aria-label": "DIY 设置",
				title: "DIY 设置",
				onClick: () => {
					setOpen(true);
				},
				children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, { size: wide ? 16 : 18 }), wide && (0, react_jsx_runtime.jsx)("span", {
					className: DiyButton_module_css_default.label,
					children: "DIY"
				})]
			}), (0, react_jsx_runtime.jsx)(DiyPanel, {
				open,
				onClose: () => {
					setOpen(false);
				},
				roster
			})] });
		}
		//#endregion
		//#region \0dsh-css:src/client/WallpaperControls.module.css.mjs
		const css = ".ze8B-W_bar{background:color-mix(in srgb, var(--dsw-alias-bg-base) 82%, transparent);border:1px solid var(--dsw-alias-border-l2);pointer-events:auto;z-index:60;border-radius:999px;align-items:center;gap:4px;padding:4px 6px;display:flex;position:fixed;bottom:96px;right:16px;box-shadow:0 4px 16px #0000002e}.ze8B-W_btn{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;padding:6px 8px;font-size:12px;line-height:1}.ze8B-W_btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.ze8B-W_count{color:var(--dsw-alias-label-tertiary);text-align:center;user-select:none;min-width:44px;font-size:11px}.ze8B-W_autoBtn{font-size:11px}.ze8B-W_autoOn{color:#07c160;background:#07c16024}";
		const tagId = "dsh-chat-customizer/WallpaperControls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-chat-customizer";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var WallpaperControls_module_css_default = {
			"count": "ze8B-W_count",
			"autoOn": "ze8B-W_autoOn",
			"btn": "ze8B-W_btn",
			"autoBtn": "ze8B-W_autoBtn",
			"bar": "ze8B-W_bar"
		};
		//#endregion
		//#region lib/types/client/WallpaperControls.js
		/**
		* Floating wallpaper controls: a small bar on the frame-wide overlay seat,
		* shown only while the current agent owns a wallpaper set (≥2 images). Offers
		* manual prev/next plus an auto-advance toggle (interval from DIY settings).
		*/
		/** Default auto-advance interval (seconds) when toggled on. */
		const AUTO_INTERVAL_SEC = 30;
		/**
		* Render the floating wallpaper controls.
		* @param props - the overlay seat's standard props (useSessions included).
		* @returns the control bar, or null when the current agent has no set.
		*/
		function WallpaperControls(props) {
			(0, react.useSyncExternalStore)(subscribeWallpaperCursor, wallpaperCursorVersion);
			const { useSessions } = props;
			const sessions = useSessions((snapshot) => snapshot);
			const preset = (sessions.current !== void 0 ? sessions.byId[sessions.current] : void 0)?.agentPreset;
			const settings = loadSettings();
			const cursor = wallpaperCursor();
			const activePreset = cursor.preset ?? preset;
			const list = activePreset !== void 0 ? agentWallpapers(settings, activePreset) : [];
			if (list.length < 2) return null;
			const index = cursor.index % list.length;
			const autoOn = (settings.wallpaperInterval ?? 0) > 0;
			const toggleAuto = () => {
				const next = { ...settings };
				if (autoOn) delete next.wallpaperInterval;
				else next.wallpaperInterval = AUTO_INTERVAL_SEC;
				localStorage.setItem("dsh.diy.settings", JSON.stringify(next));
				syncWallpaperTimer();
				advanceWallpaper(0);
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: WallpaperControls_module_css_default.bar,
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: WallpaperControls_module_css_default.btn,
						"aria-label": "上一张壁纸",
						onClick: () => {
							advanceWallpaper(-1);
						},
						children: "◀"
					}),
					(0, react_jsx_runtime.jsxs)("span", {
						className: WallpaperControls_module_css_default.count,
						children: [
							index + 1,
							" / ",
							list.length
						]
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: WallpaperControls_module_css_default.btn,
						"aria-label": "下一张壁纸",
						onClick: () => {
							advanceWallpaper(1);
						},
						children: "▶"
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clsx(WallpaperControls_module_css_default.btn, WallpaperControls_module_css_default.autoBtn, autoOn && WallpaperControls_module_css_default.autoOn),
						"aria-label": autoOn ? "关闭自动切换" : "开启自动切换",
						title: autoOn ? "自动切换中" : "自动切换",
						onClick: toggleAuto,
						children: autoOn ? "⏸" : "▶▶"
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/index.js
		/**
		* Contacts-mode sidebar plugin, browser half: registers the dual-mode shell
		* into the layout-owned `sidebar` slot, re-declaring the workspace/settings/
		* footer child seats so the default session tree keeps rendering in sessions
		* mode. ui-sidebar is disabled by this package's cordis patch, so the child
		* declarations collide with nothing.
		*/
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"layout",
			"sessions",
			"workspaces",
			"connection"
		];
		/**
		* Replace the sidebar with the dual-mode shell.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const { api } = ctx.get("connection");
			const contacts = new ContactsController(api);
			contacts.load();
			ensureWallpaperCss();
			applySettings(loadSettings());
			bindWallpaperCursor((preset, index) => applySettings(loadSettings(), preset, index));
			let diyPreset;
			ctx.effect(() => ctx.sessions.list.subscribe(() => {
				const state = ctx.sessions.list.getSnapshot();
				const preset = (state.current !== void 0 ? state.byId[state.current] : void 0)?.agentPreset;
				if (preset === diyPreset) return;
				diyPreset = preset;
				setWallpaperPreset(preset);
				applySettings(loadSettings(), preset, 0);
				syncWallpaperTimer();
			}), "ui-contacts: diy per-agent wallpaper");
			ctx.effect(() => ctx.on("theme/change", () => applySettings(loadSettings(), diyPreset, 0)), "ui-contacts: diy theme replay");
			ctx.slots.inject("sidebar", () => ctx.slots.register({
				name: "sidebar",
				priority: -1,
				children: {
					"sidebar.workspaces": {
						kind: "single",
						scope: "root"
					},
					"sidebar.settings": {
						kind: "single",
						scope: "root"
					},
					"sidebar.footer.action": {
						kind: "list",
						scope: "root"
					}
				},
				inject: () => ({
					startSession: (workspaceId) => {
						ctx.workspaces.startSession(workspaceId);
					},
					toggleSidebar: () => {
						ctx.layout.toggleSidebar();
					},
					openSession: (sessionId) => {
						ctx.sessions.open(sessionId);
					},
					startWithPreset: (presetId) => {
						startWithPreset(ctx, api, presetId);
					},
					hooks: { roster: contacts.store }
				})
			}, SidebarShell));
			ctx.slots.inject("sidebar.workspaces.row.agent", () => ctx.slots.register({
				name: "sidebar.workspaces.row.agent",
				inject: () => ({ hooks: { roster: contacts.store } })
			}, AgentRowTag));
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "diy",
				order: 10,
				inject: () => ({ hooks: { roster: contacts.store } })
			}, DiyButton));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "wallpaper-controls",
				order: 100
			}, WallpaperControls));
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
		function startWithPreset(ctx, api, presetId) {
			const before = ctx.sessions.list.getSnapshot();
			const existing = Object.values(before.byId).find((summary) => summary.agentPreset === presetId);
			if (existing !== void 0) {
				ctx.sessions.open(existing.id);
				return;
			}
			const workspaceState = ctx.workspaces.list.getSnapshot();
			const currentWorkspaceId = before.current !== void 0 ? workspaceState.items.find((item) => item.sessionIds.includes(before.current))?.workspaceId : void 0;
			let settled = false;
			const stop = ctx.sessions.list.subscribe(() => {
				if (settled) return;
				const next = ctx.sessions.list.getSnapshot();
				const fresh = Object.values(next.byId).find((summary) => !(summary.id in before.byId));
				if (fresh === void 0) return;
				settled = true;
				stop();
				(async () => {
					try {
						const response = await api.agentPresets.select({
							sessionId: fresh.id,
							agentPreset: presetId
						});
						if (response.result.ok) ctx.sessions.noteAgentPreset(fresh.id, response.result.value.agentPreset);
					} catch {}
					ctx.sessions.open(fresh.id);
				})();
			});
			window.setTimeout(() => {
				if (settled) return;
				settled = true;
				stop();
			}, 1e4);
			ctx.workspaces.startSession(currentWorkspaceId);
		}
		//#endregion
		exports.AgentRowTag = AgentRowTag;
		exports.ContactsPanel = ContactsPanel;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map