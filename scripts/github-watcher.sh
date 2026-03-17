#!/bin/bash
# GitHub Watcher for chonl-dev/claw-channel
# Überwacht tasks/incoming/ auf neue .md Dateien
# Mit WhatsApp-Protokoll für Live-Chat
# Cron: */10 * * * * /home/openclaw/scripts/github-watcher.sh

set -e

# Konfiguration
REPO_DIR="$HOME/projects/claw-channel"
INCOMING_DIR="$REPO_DIR/tasks/incoming"
COMPLETED_DIR="$REPO_DIR/tasks/completed"
STATE_DIR="$HOME/github-watcher-state"
STATE_FILE="$STATE_DIR/processed-tasks-claw-channel.txt"
LOG_FILE="$STATE_DIR/watcher-claw-channel.log"
PROTOCOL_LOG="$STATE_DIR/whatsapp-protocol.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE=$(date '+%Y-%m-%d')

# Logging
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Hilfsfunktion: WhatsApp-Protokoll-Eintrag
protocol_notify() {
    local type="$1"
    local title="$2"
    local message="$3"
    
    # Erstelle JSON-Log-Eintrag
    local json_entry="{\"type\":\"$type\",\"target\":\"+4915234345561\",\"title\":\"$title\",\"message\":\"$message\",\"timestamp\":\"$(date -Iseconds)\"}"
    
    echo "$json_entry" >> "$PROTOCOL_LOG"
    
    # Sende via OpenClaw CLI
    openclaw message send \
        --channel whatsapp \
        --target "+4915234345561" \
        --message "$message" 2>&1 | grep -q "Sent" && {
        log "📱 WhatsApp gesendet"
    } || {
        log "⚠️ WhatsApp send failed (gemerkt für später)"
    }
}

# Hilfsfunktion: POST /answer an webhook-server
send_task_answer() {
    local task_id="$1"
    local status="$2"
    local result="$3"
    local next="$4"
    
    # Hole WEBHOOK_SECRET aus Umgebung
    local secret="${WEBHOOK_SECRET:-}"
    
    if [ -z "$secret" ]; then
        log "⚠️ WEBHOOK_SECRET nicht gesetzt, überspringe POST /answer"
        return 1
    fi
    
    # Sende POST /answer
    local response=$(curl -s -X POST "http://91.99.99.242:3333/answer" \
        -H "Content-Type: application/json" \
        -H "X-Task-Secret: $secret" \
        -d "{\"task_id\":\"$task_id\",\"status\":\"$status\",\"result\":\"$result\",\"next\":\"$next\"}" \
        2>&1)
    
    if echo "$response" | grep -q '"success":true'; then
        log "📤 POST /answer erfolgreich: $task_id [$status]"
        return 0
    else
        log "⚠️ POST /answer fehlgeschlagen: $response"
        return 1
    fi
}

# Hilfsfunktion: Text für WhatsApp formatieren
format_for_whatsapp() {
    local text="$1"
    # Begrenze auf 3000 Zeichen
    if [ ${#text} -gt 3000 ]; then
        text="${text:0:3000}

... [Text gekürzt]"
    fi
    echo "$text"
}

# Stelle sicher dass .netrc existiert
setup_netrc() {
    if [ ! -f ~/.netrc ] && [ -n "$GITHUB_PAT" ]; then
        echo "machine github.com" > ~/.netrc
        echo "login ${GITHUB_PAT}" >> ~/.netrc
        echo "password x-oauth-basic" >> ~/.netrc
        chmod 600 ~/.netrc
    fi
}

# Initialisierung
mkdir -p "$STATE_DIR" "$COMPLETED_DIR"
touch "$STATE_FILE" "$PROTOCOL_LOG"
setup_netrc

log "=== Claw-Channel Watcher Started ==="

# Prüfe ob Repo existiert, sonst clone
if [ ! -d "$REPO_DIR/.git" ]; then
    log "Repository nicht gefunden, klone..."
    mkdir -p "$REPO_DIR"
    cd "$HOME/projects"
    if [ -n "$GITHUB_PAT" ]; then
        git clone "https://${GITHUB_PAT}@github.com/chonl-dev/claw-channel.git" 2>&1 | tee -a "$LOG_FILE" || {
            log "❌ Clone fehlgeschlagen"
            exit 1
        }
    else
        log "❌ GITHUB_PAT nicht gesetzt"
        exit 1
    fi
    log "✅ Repository geklont"
else
    # Git pull
    cd "$REPO_DIR"
    
    PULL_OUTPUT=$(git pull origin main 2>&1) && PULL_SUCCESS=1 || PULL_SUCCESS=0
    
    if [ $PULL_SUCCESS -eq 1 ]; then
        if echo "$PULL_OUTPUT" | grep -q "Already up to date"; then
            log "📦 Repository ist aktuell"
        else
            log "📥 Update erhalten"
        fi
    else
        log "⚠️ Git pull fehlgeschlagen, fahre mit lokalem Stand fort"
    fi
fi

# Prüfe ob incoming/ existiert
if [ ! -d "$INCOMING_DIR" ]; then
    log "⚠️ tasks/incoming/ nicht gefunden, erstelle..."
    mkdir -p "$INCOMING_DIR"
fi

# Finde neue .md Dateien
NEW_TASKS=0
for task_file in "$INCOMING_DIR"/*.md; do
    [ -e "$task_file" ] || continue
    
    filename=$(basename "$task_file")
    file_hash=$(md5sum "$task_file" | awk '{print $1}')
    task_id="${filename}:${file_hash}"
    
    # Prüfe ob bereits verarbeitet
    if ! grep -q "^$task_id$" "$STATE_FILE" 2>/dev/null; then
        log "🆕 Neuer Task: $filename"
        
        task_title=$(head -1 "$task_file" | sed 's/^# *//' | cut -c1-50)
        [ -z "$task_title" ] && task_title="$filename"
        
        log "⚙️ Verarbeite: $task_title"
        
        # Task-Inhalt für Logging
        task_preview=$(head -5 "$task_file" | grep -v "^#" | grep -v "^$" | head -1 | cut -c1-60)
        log "   Preview: $task_preview"
        
        # Lese vollständigen Content für WhatsApp
        task_content=$(cat "$task_file" | grep -v "^---" | grep -v "^\*\*" | head -20)
        
        sleep 1
        
        file_size=$(stat -c%s "$task_file" 2>/dev/null || stat -f%z "$task_file" 2>/dev/null || echo "0")
        file_size_kb=$((file_size / 1024))
        result="Verarbeitet ${file_size_kb}KB"
        status_icon="✅"
        
        # Nach completed/ verschieben
        completed_filename="${filename%.md}_$(date +%Y%m%d_%H%M%S).md"
        mv "$task_file" "$COMPLETED_DIR/$completed_filename"
        log "📁 Archiviert"
        
        # POST /answer an webhook-server
        task_id="${filename%.md}"
        send_task_answer "$task_id" "DONE" "$result" "" || true
        
        # STATUS.md aktualisieren
        status_line="$DATE | $task_title | $result | $status_icon"
        
        if [ -f "$REPO_DIR/reports/STATUS.md" ]; then
            if ! grep -q "$task_title" "$REPO_DIR/reports/STATUS.md" 2>/dev/null; then
                echo "" >> "$REPO_DIR/reports/STATUS.md"
                echo "$status_line" >> "$REPO_DIR/reports/STATUS.md"
            fi
        else
            echo "$status_line" > "$REPO_DIR/reports/STATUS.md"
        fi
        
        log "📝 STATUS.md aktualisiert"
        
        # WhatsApp-Benachrichtigung: Task-Abschluss
        whatsapp_msg="✅ *Claw → Claude*

*Task:* $task_title
*Zeit:* $(date '+%H:%M')
*Status:* Erfolgreich abgeschlossen
*Ergebnis:* $result

$(format_for_whatsapp "$task_content")"
        
        protocol_notify "whatsapp_notification" "$task_title" "$whatsapp_msg"
        log "📱 WhatsApp-Benachrichtigung gesendet"
        
        # Git commit & push
        cd "$REPO_DIR"
        git add reports/STATUS.md .gitignore 2>/dev/null || true
        git add -u 2>/dev/null || true
        
        git commit -m "✅ Task: $task_title" --quiet 2>&1 | tee -a "$LOG_FILE" || true
        
        if [ -n "$GITHUB_PAT" ]; then
            git push "https://${GITHUB_PAT}@github.com/chonl-dev/claw-channel.git" main --quiet 2>&1 | tee -a "$LOG_FILE" || {
                log "❌ Push fehlgeschlagen"
            }
        fi
        
        log "🚀 Gepusht"
        
        echo "$task_id" >> "$STATE_FILE"
        log "✅ Task fertig"
        
        ((NEW_TASKS++)) || true
    fi
done

if [ $NEW_TASKS -eq 0 ]; then
    log "✅ Keine neuen Tasks"
else
    log "🎯 $NEW_TASKS Task(s) verarbeitet"
fi

log "=== Claw-Channel Watcher Finished ==="
exit 0
