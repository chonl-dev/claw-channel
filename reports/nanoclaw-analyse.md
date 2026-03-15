# Nanoclaw Analyse

**Repository:** https://github.com/qwibitai/nanoclaw  
**Analyse Datum:** 2026-03-16  
**Analyst:** Claw (OpenClaw V6)

---

## Überblick

Nanoclaw ist ein **leichtgewichtiges Alternativ-Projekt zu OpenClaw**, entwickelt von Qwibit AI. Der Fokus liegt auf:
- **Container-basierter Isolation** (Docker Sandboxes)
- **Minimaler Codebase** (laut README: "one process and a handful of files")
- **Anthropic Agents SDK** als Basis

---

## Kernunterschiede zu OpenClaw

| Aspekt | OpenClaw | Nanoclaw |
|--------|----------|----------|
| **Code-Größe** | ~500k LOC, 53 Config-Files, 70+ Dependencies | "One process, a few source files" |
| **Sicherheit** | Application-Level (Allowlists, Pairing) | OS-Level (Container/VM Isolation) |
| **Architektur** | Monolithischer Node.js Gateway | Micro-Container pro Agent |
| **Plattform** | Linux VPS, Node.js 22 | macOS (Apple Silicon), Windows WSL |
| **Installation** | Gateway + Skills + Config | `claude /setup` (AI-guided) |

---

## Stärken

### ✅ Sicherheit durch Isolation
- Jeder Agent läuft in eigener Linux-Container (Apple Container auf macOS)
- Hypervisor-level Isolation statt nur Permission-Checks
- Filesystem-Isolation: Agents sehen nur explizit gemountete Pfade

### ✅ Einfachheit
- Codebase klein genug für vollständiges Verständnis
- Keine "Configuration Sprawl"
- Bespoke-Ansatz: Fork → Anpassen statt Konfigurieren

### ✅ Docker Sandboxes
- Millisekunden Startup
- Kein komplexes Setup
- Automatische Container-Verwaltung

---

## Schwächen / Limitierungen

### ❌ Linux Support fehlt
- Aktuell nur macOS (Apple Silicon) und Windows (WSL)
- "Linux support coming soon" seit mehreren Monaten
- Für unseren VPS (Ubuntu 24.04) **nicht nutzbar**

### ❌ Weniger Features
- Keine native Multi-User Unterstützung
- Kein integriertes Cron-System wie OpenClaw
- Weniger Messaging-Connectoren (WhatsApp, Telegram, Slack, Discord, Gmail)

### ❌ Kleinere Community
- Weniger Contributions
- Weniger Skills verfügbar
- Abhängigkeit von Anthropic Claude Code

---

## Für uns relevante Aspekte

### 🔍 Container-Isolation
Nanoclaws Docker-Approach könnte für unsere **Sub-Agents** interessant sein:
- Aktuell: Sub-Agents laufen im selben Prozess
- Nanoclaw-Style: Jeder Sub-Agent in isoliertem Container
- Bessere Sicherheit bei unbekanntem Code

### 🔍 Claude Code Skills
Nanoclaw nutzt `/skills` (Claude Code Skills) statt traditioneller CLI:
- `/setup` statt `npm install`
- `/add-whatsapp` statt manueller Config
- Unser Webhook könnte als Skill eingereicht werden

---

## Bewertung: Brauchen wir das?

### Kurzfristig (nein)
- **Linux Support fehlt** → Auf unserem VPS nicht lauffähig
- Migration wäre aufwändig (Cron Jobs, Watcher, Skills)

### Mittelfristig (vielleicht)
- **Container-Isolation für Sub-Agents** sinnvoll
- Könnten Nanoclaws Docker-Approach adaptieren
- Hybride Lösung: OpenClaw Gateway + Nanoclaw-Style Sandboxes

### Langfristig (beobachten)
- Wenn Linux-Support kommt → Evaluation
- Für neue Projekte ohne OpenClaw-legacy interessant

---

## Empfehlung: Webhook-Endpoint als Skill

### Möglicher Commit für Nanoclaw:

**Skill-Name:** `/add-webhook-endpoint`

**Funktion:**
- Erstellt Express.js Server auf Port 3333
- Empfängt Tasks via POST /task
- Speichert in tasks/incoming/
- Triggert automatisch Watcher/Agent

**Unterschied zu unserer Lösung:**
| Aspekt | Unsere Lösung | Nanoclaw-Style |
|--------|---------------|----------------|
| Setup | Manuelles Script | `claude /add-webhook-endpoint` |
| Isolation | PM2 auf Host | Docker Container |
| Security | PAT in ~/.bashrc | Container-seitige Secrets |
| Trigger | Cron alle 10min | Webhook → sofort |

### Konkreter Commit-Vorschlag:

```bash
# In Nanoclaw-Fork:
.claude/skills/add-webhook-endpoint/
├── README.md
├── setup.js          # Container-Setup
├── webhook-server.js # Express Server
└── templates/
    └── .env.webhook  # Secret-Konfig
```

**Nutzen für Nanoclaw-Community:**
- Direkte Integration mit externen Systemen
- Kein GitHub Rate-Limiting
- Echtzeit-Task-Eingang

---

## Fazit

**Nanoclaw ist interessant, aber aktuell nicht für uns produktiv nutzbar** wegen fehlendem Linux-Support.

**Wertvolle Erkenntnisse:**
1. Container-Isolation für Sub-Agents ist sinnvoll
2. Claude Code Skills könnten unseren Workflow vereinfachen
3. Unser Webhook-Ansatz wäre ein guter Nanoclaw-Skill

**Empfohlene Aktion:**
- Nanoclaw beobachten (Star/Fork)
- Linux-Support abwarten
- Unsere Container-Isolation intern verbessern (optional)

---

*Analyse erstellt von Claw via OpenClaw V6 Hybrid Infrastructure*
