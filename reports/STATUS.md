# DEVCYCLE Status Report

## Aktive Konfiguration

## Top 15 Claude Repositories (nach Stars)

| # | Repository | Stars | Usecase | Summary |
|---|------------|-------|---------|---------|
| 1 | [prompts.chat](https://github.com/f/prompts.chat) | 152,844 | tools | prompts.chat is the world's largest open-source prompt libra... |
| 2 | [system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) | 131,495 | tools | This repository, 'system-prompts-and-models-of-ai-tools', is... |
| 3 | [NextChat](https://github.com/ChatGPTNextWeb/NextChat) | 87,515 | tools | NextChat is a light and fast AI assistant that supports a wi... |
| 4 | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 79,774 | devcycle | Everything Claude Code is a comprehensive performance optimi... |
| 5 | [claude-code](https://github.com/anthropics/claude-code) | 78,640 | devcycle | Claude Code ist ein agentenbasiertes Codierungstool, das im ... |
| 6 | [lobehub](https://github.com/lobehub/lobehub) | 73,760 | skill | LobeHub is an advanced platform designed for building, colla... |
| 7 | [Pake](https://github.com/tw93/Pake) | 46,674 | tools | Pake is a tool that allows users to convert any webpage into... |
| 8 | [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 44,678 | tools | Das Repository "Awesome Claude Skills" bietet eine kuratiert... |
| 9 | [LocalAI](https://github.com/mudler/LocalAI) | 43,708 | tools | LocalAI is an open-source, self-hosted alternative to commer... |
| 10 | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 42,697 | skill | UI UX Pro Max is an AI skill designed to provide comprehensi... |
| 11 | [chatgpt-on-wechat](https://github.com/zhayujie/chatgpt-on-wechat) | 42,241 | skill | CowAgent ist ein auf großen Sprachmodellen basierender KI-As... |
| 12 | [cherry-studio](https://github.com/CherryHQ/cherry-studio) | 41,585 | skill | Cherry Studio ist ein plattformübergreifender Desktop-Client... |
| 13 | [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) | 40,484 | devcycle | Oh My OpenCode (omo) is an advanced, open-source agent harne... |
| 14 | [chatbox](https://github.com/chatboxai/chatbox) | 38,984 | tools | Chatbox is an open-source desktop client for various Large L... |
| 15 | [GPT_API_free](https://github.com/chatanywhere/GPT_API_free) | 36,692 | tools | GPT_API_free is a project offering free and paid API access ... |


### Webhook Secret
**Aktuelles Secret:** `be4889d5f57f4c6d63fe3e8174407d40f17a72f9d37d42ed6218657f97af3154`

**Verwendung:**
```bash
curl -H "X-Webhook-Secret: be4889d5f57f4c6d63fe3e8174407d40f17a72f9d37d42ed6218657f97af3154" http://localhost:3333/task
```

**Location:** ~/.bashrc (nicht im Git!)

---

## Agent Communication Scan - 2026-03-16

### Überblick
- **Repos analysiert:** 98
- **Useful gefunden:** 90 (usecase != none)
- **Scan Datei:** [agent_comm_scan.json](./agent_comm_scan.json)

### Top 15 nach Kommunikations-Pattern

#### MCP (Model Context Protocol)
| Repo | Stars | Usecase | Insights |
|------|-------|---------|----------|
| [mcp-chrome](https://github.com/hangwin/mcp-chrome) | 10.8k | claude_to_claw | Chrome Extension MCP Server für Claude |
| [mcp-use](https://github.com/mcp-use/mcp-use) | 9.4k | both | MCP Framework für LLMs |
| [hexstrike-ai](https://github.com/0x4m4/hexstrike-ai) | 7.5k | both | Multi-Agent Orchestration Hub |
| [Awesome-MCP-ZH](https://github.com/yzfly/Awesome-MCP-ZH) | 6.5k | both | Kuratierte MCP Ressourcen |
| [firecrawl-mcp](https://github.com/firecrawl/firecrawl-mcp-server) | 5.8k | claude_to_claw | Web Scraping via MCP |
| [DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP) | 5.7k | claude_to_claw | Desktop Control für Claude |

#### Direct Communication
| Repo | Stars | Usecase | Insights |
|------|-------|---------|----------|
| [Microverse](https://github.com/KsanaDock/Microverse) | 2.2k | both | AI-Agent Dialogue System |
| [walkie](https://github.com/walkie) | 236 | both | P2P Agent Communication via Hyperswarm |
| [ccpocket](https://github.com/ccpocket) | 153 | both | Mobile ↔ Agent Bridge |
| [agentic-voice](https://github.com/agentic-voice) | 109 | both | Voice/Text AI Middleware |
| [agent-ws](https://github.com/agent-ws) | 29 | both | WebSocket Bridge für Claude/Codex |

#### Webhook
| Repo | Stars | Usecase | Insights |
|------|-------|---------|----------|
| [Claude-to-IM-skill](https://github.com/op7418/Claude-to-IM-skill) | 1.2k | claude_to_claw | Claude → Instant Messaging |

### Empfehlung für DEVCYCLE

**Primär:** MCP Protocol (Anthropic Standard)
- Vorteil: Breite Adoption, standardisierte Schnittstelle
- Usecase: Claude → Tools/Daten (unser Scoring Gate, Deliverable Builder)

**Sekundär:** Direct/WebSocket
- Vorteil: Echtzeit, geringe Latenz
- Usecase: Claude ↔ Claw bidirektionale Kommunikation

**Tertiär:** Webhook
- Vorteil: Einfach, asynchron
- Usecase: Externe Triggers (Upwork, GitHub Webhooks)


## Top 15 Claude Agent Automation Repos

Gefiltert: KEINE UI-Clients, KEINE Prompt-Listen  
Nur: devcycle, communication, automation, orchestration

| # | Repository | Stars | Usecase | Summary |
|---|------------|-------|---------|---------|
| 1 | [awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 102,360 | automation | Das Repository 'awesome-llm-apps' ist eine kuratie... |
| 2 | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 79,820 | automation | Everything Claude Code is a comprehensive performa... |
| 3 | [claude-code](https://github.com/anthropics/claude-code) | 78,649 | devcycle | Claude Code ist ein agentisches Codierungstool, da... |
| 4 | [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 44,682 | automation | Das Repository 'Awesome Claude Skills' bietet eine... |
| 5 | [claude-mem](https://github.com/thedotmack/claude-mem) | 36,459 | automation | Claude-Mem ist ein Plugin für Claude Code, das ein... |
| 6 | [LibreChat](https://github.com/danny-avila/LibreChat) | 34,687 | automation | LibreChat ist eine selbst gehostete KI-Chat-Plattf... |
| 7 | [khoj](https://github.com/khoj-ai/khoj) | 33,428 | automation | Khoj is an AI second brain that allows users to cr... |
| 8 | [agents](https://github.com/wshobson/agents) | 31,407 | devcycle | Das Repository 'wshobson/agents' bietet ein umfass... |
| 9 | [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) | 29,165 | automation | Das Repository 'learn-claude-code' ist ein Lernpro... |
| 10 | [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 28,534 | devcycle | Das Repository 'hesreallyhim/awesome-claude-code' ... |
| 11 | [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | 24,885 | automation | Das Repository 'antigravity-awesome-skills' ist ei... |
| 12 | [nanoclaw](https://github.com/qwibitai/nanoclaw) | 23,465 | automation | NanoClaw ist ein leichtgewichtiger, sicherer und a... |
| 13 | [vibe-kanban](https://github.com/BloopAI/vibe-kanban) | 23,272 | devcycle | Vibe Kanban ist eine Plattform, die darauf abzielt... |
| 14 | [ruflo](https://github.com/ruvnet/ruflo) | 21,326 | orchestration | Ruflo (formerly Claude Flow) is an enterprise-grad... |
| 15 | [promptfoo](https://github.com/promptfoo/promptfoo) | 16,746 | devcycle | Promptfoo ist ein CLI- und Bibliotheks-Tool, das s... |


---

*Letztes Update: 2026-03-16 14:15 UTC*
*Generated by OpenClaw Agent*

2026-03-16 | CONNECTION_TEST | Verarbeitet 0KB | ✅

2026-03-16 | REPO_SCAN_CLAUDE | Verarbeitet 0KB | ✅

2026-03-16 | START_REPO_SCANNER | Verarbeitet 0KB | ✅

2026-03-16 | UPDATE_STATUS | Verarbeitet 0KB | ✅

2026-03-16 | PROAKTIV_REGEL | Verarbeitet 0KB | ✅

2026-03-16 | SEND_SCAN_NOW | Verarbeitet 0KB | ✅

2026-03-16 | REPO_SCAN_CLAUDE_V2 | Verarbeitet 0KB | ✅
