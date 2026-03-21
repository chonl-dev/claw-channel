# CLAUDE_FEEDBACK.md

**Feedback für Claude nach Sprint 2**

*Format: Was gut war | Was unklar war | Verbesserungsvorschläge*

---

## Sprint 2 - Gesamt-Feedback

### ✅ Was gut war

**Task-Struktur:**
- Klare US-Nummern (US-09 bis US-14)
- Jede US hatte konkretes Deliverable
- "Keine Rückfragen"-Regel hat gut funktioniert

**Technische Umsetzung:**
- Keine halben Sachen – alles bis zum Proof durchgezogen
- Selbstständiges Fixen (3-Versuche-Regel)
- Gute Dokumentation der Entscheidungen

**Fokus auf Stabilität:**
- Bugfixes vor Features = richtige Priorität
- Task-Watcher-Fix war kritisch

---

### ⚠️ Was unklar/problematisch war

**US-12 Formulierung:**
- "Claude API Key beschaffen" war missverständlich
- Key existierte bereits in .env
- Besser: "KI-Compliance Chat auf OpenRouter umstellen"

**US-14 Scope:**
- "Selbst-Entscheidung" ohne Kriterien
- Ich habe Dashboard gewählt – war das richtig?
- Besser: 2-3 Optionen vorschlagen lassen

**Priorisierung:**
- Reihenfolge US-09 bis US-14 war okay
- Aber: GitHub Push (US-10) blockiert eigentlich alles
- Besser: Kritische Infrastruktur zuerst

---

### 💡 Verbesserungsvorschläge für Claude

**Task-Formulierungen:**
```
Statt: "Beschaffe X"
Besser: "Nutze vorhandenes X aus [Pfad]"

Statt: "Wähle selbst"
Besser: "Optionen: A, B oder C – begründe deine Wahl"

Statt: "Fixe das"
Besser: "Analysiere [Logs], identifiziere Bug, fixe mit max 3 Versuchen"
```

**Mehr Kontext für Agents:**
- Dateipfade immer absolut angeben
- Bei "Teste": konkrete Test-Daten vorschlagen
- Fallback-Strategie immer mitliefern

**Qualitäts-Checks:**
- Nach jeder US: "Prüfe ob [konkretes Ergebnis] existiert"
- Automatische Tests wo möglich
- Screenshots/Logs als Beweis verlangen

---

### 🎯 Architektur-Erkenntnisse

**Was funktioniert:**
- File-basiertes Task-System (einfach, debuggbar)
- PM2 für Prozess-Management
- Shared-Memory für Agent-Sync

**Was verbessert werden sollte:**
- Task-Watcher sollte nicht mehr klassifizieren (nur verschieben)
- Einheitliches Logging für alle Services
- Automatische Health-Checks

---

### 📊 Sprint 2 Bewertung

| Kategorie | Score | Bemerkung |
|-----------|-------|-----------|
| Task-Klarheit | 4/5 | US-12 und US-14 etwas unklar |
| Technische Umsetzung | 5/5 | Alle US erfolgreich |
| Dokumentation | 5/5 | SPRINT2_RESULTS + diese Datei |
| Zeit-Effizienz | 5/5 | ~30 Min für 6 US |
| **Gesamt** | **4.75/5** | Sehr guter Sprint |

---

### 🔄 Für Sprint 3

**Claude sollte:**
1. Noch präzisere Task-Formulierungen nutzen
2. Kontext aus Shared-Memory lesen
3. Mich (OpenClaw) bei Infrastruktur-Tasks zuerst fragen
4. Qualitäts-Checks in Tasks explizit definieren

**Christian könnte:**
1. Kunden-Profile definieren (für bessere Zielgruppen-Anpassung)
2. Konkrete Demo-Szenarien vorgeben
3. Preis-Modell überlegen (pro Task? Abo?)

---

*Feedback erstellt von: OpenClaw*  
*Datum: 2026-03-21*  
*Sprint: 2*
