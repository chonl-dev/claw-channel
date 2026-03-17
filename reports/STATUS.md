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

2026-03-16 | ANALYSE_MAESTRO | Verarbeitet 0KB | ✅

## Maestro Analysis - 3 Ideen für Claude↔Claw Kanal

**Quelle:** https://github.com/Doriandarko/maestro  
**Datum:** 2026-03-16

### Idee 1: Hierarchische Aufgabenzerlegung
Claude als Orchestrator zerlegt komplexe Anfragen in Sub-tasks, die Claw ausführt.
- Claude generiert task_list → Claw führt aus → Claude verfeinert
- JSON-basiertes Protokoll für sequentielle Ausführung

### Idee 2: Dynamische Model-Switches
Claude wählt je nach Aufgabe das optimale Modell (lokal/extern):
- Komplexe Analyse → Claude (Opus/Sonnet)
- Einfache Tasks → Kimi/Gemini via OpenRouter
- Claw als Wrapper für externe Modelle

### Idee 3: Progressives Debugging mit Feedback-Loop
Iterative Verfeinerung durch Fehler-Rückmeldung:
- Claw sendet Fehler/Logs an Claude
- Claude analysiert und generiert korrigierte Anweisung
- Wiederholung bis Erfolg oder Unlösbarkeit festgestellt

**Implementation:** Siehe comm_upgrade_plan.json für Details

## Top 20 Agent Orchestration Repositories

Gescannt: 150+ Repos | Gefiltert: UI/Chat/Desktop | Analysiert: 147

| # | Repository | ⭐ | Type | Pattern | Usecase | Integration |
|---|------------|---|------|---------|---------|-------------|
| 1 | [langflow](https://github.com/langflow-ai/langflow) | 145,726 | tool | workflow | workflow | high |
| 2 | [dify](https://github.com/langgenius/dify) | 133,061 | framework | workflow | workflow | high |
| 3 | [awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 102,368 | tool | other | multi-agen | medium |
| 4 | [gemini-cli](https://github.com/google-gemini/gemini-cli) | 97,969 | tool | workflow | devops | high |
| 5 | [markitdown](https://github.com/microsoft/markitdown) | 90,826 | library | workflow | research | high |
| 6 | [superpowers](https://github.com/obra/superpowers) | 88,175 | framework | workflow | devops | high |
| 7 | [browser-use](https://github.com/browser-use/browser-use) | 80,963 | library | workflow | automation | high |
| 8 | [claude-code](https://github.com/anthropics/claude-code) | 78,669 | tool | workflow | devops | high |
| 9 | [lobehub](https://github.com/lobehub/lobehub) | 73,762 | tool | multi-agent | multi-agen | high |
| 10 | [Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | 71,729 | tool | other | research | medium |
| 11 | [MetaGPT](https://github.com/FoundationAgents/MetaGPT) | 65,284 | framework | hierarchical | multi-agen | high |
| 12 | [OpenBB](https://github.com/OpenBB-finance/OpenBB) | 63,182 | library | workflow | research | high |
| 13 | [MinerU](https://github.com/opendatalab/MinerU) | 56,309 | library | workflow | workflow | high |
| 14 | [autogen](https://github.com/microsoft/autogen) | 55,702 | framework | workflow | multi-agen | high |
| 15 | [ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) | 54,160 | framework | workflow | workflow | low |
| 16 | [Flowise](https://github.com/FlowiseAI/Flowise) | 50,800 | tool | workflow | workflow | high |
| 17 | [mem0](https://github.com/mem0ai/mem0) | 50,058 | library | other | automation | high |
| 18 | [agency-agents](https://github.com/msitarzewski/agency-agents) | 48,801 | tool | other | multi-agen | high |
| 19 | [crewAI](https://github.com/crewAIInc/crewAI) | 46,240 | framework | workflow | automation | high |
| 20 | [chatgpt-on-wechat](https://github.com/zhayujie/chatgpt-on-wechat) | 42,241 | framework | workflow | automation | high |


2026-03-16 | DEEP_ANALYSE_TOP20 | Verarbeitet 0KB | ✅

2026-03-16 | KOMMUNIKATIONSKANAL_UPGRADE | Verarbeitet 0KB | ✅

## Kommunikationskanal Upgrade - Claw → Claude Rückkanal

**Datum:** 2026-03-16

### Implementiert

1. **POST /answer Endpoint** (webhook-server.js)
   - Speichert Task-Ergebnisse: `{task_id, status, result, next}`
   - Status: DONE, BLOCKED, NEEDS_CONTEXT, DONE_WITH_CONCERNS
   - Speicherort: `~/claw-task-answers/`

2. **github-watcher.sh Erweiterung**
   - Automatischer POST /answer nach jedem Task
   - Funktion: `send_task_answer()`
   - Integration ohne WhatsApp-Umweg

3. **GET /question erweitert**
   - Gibt jetzt auch `taskAnswers` zurück
   - Markiert Antworten automatisch als `read`
   - Claude kann pollen: `GET /question`

### API Endpoints

```
POST /answer              - Task-Antwort speichern (Claw → Claude)
GET  /question            - Offene Fragen + Task-Antworten abrufen
```

### Test Ergebnis

```bash
# POST /answer
✅ success: true
   task_id: TEST_TASK_001
   status: DONE

# GET /question  
✅ taskAnswers: [{task_id, status, result, next, timestamp}]
   taskAnswerCount: 1
```

**Status:** ✅ Funktioniert! Claude kann jetzt direkt Task-Status abrufen.


## Bugfix: GET /question Task-Answers Persistence

**Problem:** Task-Answers wurden sofort als gelesen markiert und verschwanden.

**Lösung:** 
- GET /question markiert NICHT mehr automatisch als gelesen
- DELETE /answer/{task_id} für explizites Löschen

**API Flow:**
```
1. Claw: POST /answer {task_id, status, result}
2. Claude: GET /question → sieht taskAnswers (bleibt erhalten!)
3. Claude: DELETE /answer/{task_id} → löscht nach Verarbeitung
```

**Test Ergebnis:**
- POST BUGFIX_TEST: ✅ gespeichert
- GET /question (1. Mal): ✅ 1 Antwort
- GET /question (2. Mal): ✅ 1 Antwort (nicht verschwunden!)
- DELETE /answer/BUGFIX_TEST: ✅ gelöscht
- GET /question (nach DELETE): ✅ 0 Antworten

**Status:** ✅ Fix funktioniert!


2026-03-17 | KANAL_TEST | Verarbeitet 0KB | ✅
