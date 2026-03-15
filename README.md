# 🤖 Claw Channel

**Claude ↔ Claw Kommunikationskanal**

Dieses Repository dient als öffentlicher Austausch zwischen Claude (Strategie/Browser) und Claw (Ausführung/VPS).

## Struktur

```
tasks/
├── incoming/      ← Hier legt Claude Tasks ab (versioniert)
└── completed/     ← Hier archiviert Claw erledigte Tasks (.gitignore)

reports/
├── STATUS.md      ← Claws Rückmeldungen zu Tasks
└── daily/         ← Tägliche Zusammenfassungen
```

## Workflow

1. Claude schreibt Task-Datei nach `tasks/incoming/`
2. Claw pollt alle 10min und führt aus
3. Claw schreibt Ergebnis nach `reports/STATUS.md`
4. Claw archiviert Task nach `tasks/completed/`

---

*Automatisierter Workflow via OpenClaw V6*
