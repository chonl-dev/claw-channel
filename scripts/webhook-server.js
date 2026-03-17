// Webhook Server für Claude → Claw Kommunikation
// Läuft auf Port 3333, empfängt Tasks via POST /task
// Mit WhatsApp-Protokoll für Live-Chat zwischen Claude und Claw

const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { execSync } = require('child_process');

const app = express();
const PORT = 3333;
const TASKS_DIR = path.join(process.env.HOME, 'projects', 'claw-channel', 'tasks', 'incoming');
const COMPLETED_DIR = path.join(process.env.HOME, 'projects', 'claw-channel', 'tasks', 'completed');

// Middleware
app.use(express.json());

// Secret aus Umgebung (nicht hardcoded!)
const SECRET = process.env.WEBHOOK_SECRET;
const WHATSAPP_TARGET = '+4915234345561'; // Deine WhatsApp-Nummer

if (!SECRET) {
    console.error('❌ WEBHOOK_SECRET nicht gesetzt!');
    console.error('   Bitte: export WEBHOOK_SECRET="..." in ~/.bashrc');
    process.exit(1);
}

// Hilfsfunktion: Code-Blöcke kürzen
function formatForWhatsApp(text) {
    if (!text) return '';
    
    // Ersetze Code-Blöcke (```...```)
    let formatted = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        const lines = code.split('\n').filter(line => line.trim());
        if (lines.length > 10) {
            return '```' + lines[0] + '\n... [' + lines.length + ' Zeilen Code]\n```';
        }
        return match;
    });
    
    // Ersetze Inline-Code (`...`)
    formatted = formatted.replace(/`([^`]+)`/g, '"$1"');
    
    // Begrenze Länge (WhatsApp max ~4000 Zeichen für eine Nachricht)
    if (formatted.length > 3500) {
        formatted = formatted.substring(0, 3500) + '\n\n... [Text gekürzt]';
    }
    
    return formatted;
}

// Hilfsfunktion: WhatsApp-Nachricht senden mit Retry-Logik (Issue #47874)
function sendWhatsAppNotification(message, attempt = 1) {
    const maxRetries = 2;
    const retryDelayMs = 2000;
    
    try {
        // Verwende OpenClaw CLI mit korrekter Syntax
        const cmd = `openclaw message send --channel whatsapp --target "${WHATSAPP_TARGET}" --message "${message.replace(/"/g, '\\"')}" 2>&1`;
        exec(cmd, (error, stdout, stderr) => {
            const failed = error || (!stdout.includes('Sent') && !stdout.includes('success'));
            
            if (failed && attempt < maxRetries) {
                console.log(`⚠️ WhatsApp send failed (Versuch ${attempt}), retry in ${retryDelayMs}ms...`);
                setTimeout(() => {
                    sendWhatsAppNotification(message, attempt + 1);
                }, retryDelayMs);
            } else if (failed) {
                console.error(`❌ WhatsApp send failed after ${attempt} attempts:`, error?.message || stdout);
            } else {
                console.log('✅ WhatsApp notification sent');
            }
        });
    } catch (err) {
        console.error('WhatsApp send error:', err.message);
        if (attempt < maxRetries) {
            setTimeout(() => {
                sendWhatsAppNotification(message, attempt + 1);
            }, retryDelayMs);
        }
    }
}

// Alternative: Via Gateway API mit Retry-Logik (Issue #47874)
async function sendWhatsAppViaGateway(message, attempt = 1) {
    const maxRetries = 2;
    const retryDelayMs = 2000;
    
    try {
        // Schreibe in eine Log-Datei die vom OpenClaw Gateway gelesen werden kann
        const logEntry = {
            type: 'whatsapp_notification',
            target: WHATSAPP_TARGET,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        const logFile = path.join(process.env.HOME, 'github-watcher-state', 'whatsapp-protocol.log');
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        
        // Versuche direkten Aufruf wenn möglich
        const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3000';
        const cmd = `curl -s -X POST "${gatewayUrl}/api/v1/messages/send" \
            -H "Content-Type: application/json" \
            -d '{"channel":"whatsapp","to":"${WHATSAPP_TARGET}","text":"${message.replace(/'/g, "'\\''")}"}' 2>/dev/null || true`;
        
        exec(cmd, (error, stdout, stderr) => {
            const failed = error || (stdout && stdout.includes('error'));
            
            if (failed && attempt < maxRetries) {
                console.log(`⚠️ Gateway-Fehler (Versuch ${attempt}), retry in ${retryDelayMs}ms...`);
                setTimeout(() => {
                    sendWhatsAppViaGateway(message, attempt + 1);
                }, retryDelayMs);
            } else if (failed) {
                console.error(`❌ Gateway-Fehler nach ${attempt} Versuchen:`, error?.message || stdout);
            } else {
                console.log('📱 WhatsApp protocol entry created');
            }
        });
    } catch (err) {
        console.error('WhatsApp protocol error:', err.message);
        if (attempt < maxRetries) {
            console.log(`🔄 Retry ${attempt + 1}/${maxRetries} in ${retryDelayMs}ms...`);
            setTimeout(() => {
                sendWhatsAppViaGateway(message, attempt + 1);
            }, retryDelayMs);
        }
    }
}

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Task Endpoint - leitet direkt an OpenClaw hooks weiter
app.post('/task', async (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    // Secret validieren
    if (receivedSecret !== SECRET) {
        console.log(`❌ Ungültiges Secret von ${req.ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { title, content, priority = 'normal' } = req.body;
    
    // Validierung
    if (!title || !content) {
        return res.status(400).json({ error: 'Missing title or content' });
    }
    
    // WhatsApp-Benachrichtigung: Task-Eingang (SOFORT SENDEN)
    const whatsappMsg = `📨 Claude → Claw

Task: ${title}
Priorität: ${priority}
Zeit: ${new Date().toLocaleTimeString('de-DE')}

${formatForWhatsApp(content)}`;
    
    // SOFORT senden, nicht nur loggen
    sendWhatsAppNotification(whatsappMsg);
    sendWhatsAppViaGateway(whatsappMsg);
    
    // Leite Task direkt an OpenClaw hooks weiter
    try {
        const hookToken = process.env.WEBHOOK_SECRET;
        const messageContent = `[${title}] ${content}`;
        
        const curlCmd = `curl -s -X POST http://127.0.0.1:18789/hooks/agent \
            -H "x-openclaw-token: ${hookToken}" \
            -H "Content-Type: application/json" \
            -d '{"message":${JSON.stringify(messageContent)},"deliver":true,"channel":"whatsapp","to":"+4915234345561"}' 2>&1`;
        
        exec(curlCmd, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Hook Weiterleitung fehlgeschlagen:', error.message);
            } else {
                console.log('✅ Hook Weiterleitung:', stdout);
            }
        });
        
        res.json({ 
            success: true, 
            message: 'Task an OpenClaw Hook weitergeleitet',
            hookForwarded: true
        });
        
    } catch (err) {
        console.error('❌ Fehler bei Hook-Weiterleitung:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Status-Update Endpoint (für Abschluss-Benachrichtigungen)
app.post('/status', (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    if (receivedSecret !== SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { title, result, status = 'success' } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Missing title' });
    }
    
    const statusIcon = status === 'success' ? '✅' : '❌';
    
    // WhatsApp-Benachrichtigung: Task-Abschluss
    const whatsappMsg = `${statusIcon} *Claw → Claude*

*Task:* ${title}
*Zeit:* ${new Date().toLocaleTimeString('de-DE')}
*Status:* ${status === 'success' ? 'Erfolgreich' : 'Fehlgeschlagen'}

${formatForWhatsApp(result || 'Task abgeschlossen')}`;
    
    sendWhatsAppViaGateway(whatsappMsg);
    
    res.json({ success: true, message: 'Status update sent' });
});

// Protokoll-Abfrage Endpoint
app.get('/protocol', (req, res) => {
    try {
        const logFile = path.join(process.env.HOME, 'github-watcher-state', 'whatsapp-protocol.log');
        if (fs.existsSync(logFile)) {
            const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n').slice(-20);
            const entries = lines.map(line => JSON.parse(line));
            res.json({ entries });
        } else {
            res.json({ entries: [] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// STATUS.md Endpoint (read-only, no secret required)
app.get('/status', (req, res) => {
    try {
        const statusFile = path.join(process.env.HOME, 'projects', 'claw-channel', 'reports', 'STATUS.md');
        
        if (fs.existsSync(statusFile)) {
            const content = fs.readFileSync(statusFile, 'utf8');
            
            // Parse markdown content
            const lines = content.split('\n');
            const title = lines[0]?.replace('# ', '') || 'Task Status';
            
            // Extract entries - look for lines starting with dates (YYYY-MM-DD)
            const entries = [];
            const entryRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/;
            
            for (const line of lines) {
                const match = line.match(entryRegex);
                if (match) {
                    entries.push({
                        date: match[1].trim(),
                        task: match[2].trim(),
                        result: match[3].trim(),
                        status: match[4].trim()
                    });
                }
            }
            
            res.json({
                title,
                content,
                entries,
                count: entries.length,
                updated: fs.statSync(statusFile).mtime.toISOString(),
                source: 'chonl-dev/claw-channel/reports/STATUS.md'
            });
        } else {
            res.status(404).json({ 
                error: 'STATUS.md not found',
                message: 'No status file available yet'
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// QUESTION Endpoints - Claw → Claude Kommunikation
const QUESTIONS_DIR = path.join(process.env.HOME, 'claw-questions');

// TASK ANSWER Endpoints - Claw → Claude Task Rückmeldung
const TASK_ANSWERS_DIR = path.join(process.env.HOME, 'claw-task-answers');

// Hilfsfunktion: Task-Antwort speichern
function saveTaskAnswer(task_id, status, result, next) {
    const timestamp = new Date().toISOString();
    const answerFile = path.join(TASK_ANSWERS_DIR, `${task_id}.json`);
    
    const data = {
        task_id,
        status,
        result,
        next,
        timestamp,
        read: false
    };
    
    fs.mkdirSync(TASK_ANSWERS_DIR, { recursive: true });
    fs.writeFileSync(answerFile, JSON.stringify(data, null, 2));
    
    return data;
}

// Hilfsfunktion: Alle Task-Antworten laden
function loadTaskAnswers(unreadOnly = false) {
    if (!fs.existsSync(TASK_ANSWERS_DIR)) {
        return [];
    }
    
    const files = fs.readdirSync(TASK_ANSWERS_DIR).filter(f => f.endsWith('.json'));
    const answers = [];
    
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(TASK_ANSWERS_DIR, file), 'utf8'));
            if (!unreadOnly || !data.read) {
                answers.push(data);
            }
        } catch (e) {
            console.error(`Fehler beim Lesen von ${file}:`, e.message);
        }
    }
    
    return answers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Hilfsfunktion: Frage speichern
function saveQuestion(question, context = '') {
    const id = `q-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const questionFile = path.join(QUESTIONS_DIR, `${id}.json`);
    
    const data = {
        id,
        question,
        context,
        timestamp,
        answered: false,
        answer: null,
        answeredAt: null
    };
    
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
    fs.writeFileSync(questionFile, JSON.stringify(data, null, 2));
    
    return data;
}

// Hilfsfunktion: Alle offenen Fragen laden
function loadPendingQuestions() {
    if (!fs.existsSync(QUESTIONS_DIR)) {
        return [];
    }
    
    const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json'));
    const questions = [];
    
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
            if (!data.answered) {
                questions.push(data);
            }
        } catch (e) {
            console.error(`Fehler beim Lesen von ${file}:`, e.message);
        }
    }
    
    return questions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// GET /question - Offene Fragen UND Task-Antworten abrufen (für Claude)
app.get('/question', (req, res) => {
    const pending = loadPendingQuestions();
    const taskAnswers = loadTaskAnswers(true); // unread only
    
    // BUGFIX: NICHT mehr automatisch als gelesen markieren!
    // Claude muss explizit DELETE /answer/{task_id} aufrufen
    
    res.json({ 
        pending,
        taskAnswers,
        pendingCount: pending.length,
        taskAnswerCount: taskAnswers.length,
        timestamp: new Date().toISOString()
    });
});

// DELETE /answer/{task_id} - Task-Antwort als gelesen markieren/löschen (von Claude)
app.delete('/answer/:task_id', (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    if (receivedSecret !== SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { task_id } = req.params;
    const answerFile = path.join(TASK_ANSWERS_DIR, `${task_id}.json`);
    
    if (!fs.existsSync(answerFile)) {
        return res.status(404).json({ error: 'Task answer not found' });
    }
    
    try {
        // Lösche die Datei (oder markiere als gelesen)
        fs.unlinkSync(answerFile);
        console.log(`🗑️ Task-Antwort gelöscht: ${task_id}`);
        
        res.json({ 
            success: true, 
            task_id,
            message: 'Task-Antwort gelöscht'
        });
    } catch (err) {
        console.error(`Fehler beim Löschen: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /answer - Task-Antwort speichern (von Claw → Claude)
app.post('/answer', (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    if (receivedSecret !== SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { task_id, status, result, next } = req.body;
    
    if (!task_id || !status) {
        return res.status(400).json({ error: 'Missing task_id or status' });
    }
    
    // Validierung: Status muss erlaubt sein
    const validStatuses = ['DONE', 'BLOCKED', 'NEEDS_CONTEXT', 'DONE_WITH_CONCERNS'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    
    // Speichere Antwort
    const data = saveTaskAnswer(task_id, status, result || '', next || '');
    
    console.log(`📤 Task-Antwort gespeichert: ${task_id} [${status}]`);
    
    res.json({ 
        success: true, 
        task_id,
        status,
        message: 'Task-Antwort gespeichert'
    });
});

// POST /question - Neue Frage stellen (von Claw)
app.post('/question', (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    if (receivedSecret !== SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { question, context = '' } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: 'Missing question' });
    }
    
    // Frage speichern
    const data = saveQuestion(question, context);
    
    // WhatsApp an Christian
    const whatsappMsg = `❓ *Claw hat eine Frage*

*Frage:* ${question}

${context ? `*Kontext:* ${context}` : ''}

*ID:* ${data.id}
*Zeit:* ${new Date().toLocaleTimeString('de-DE')}

Claude wird automatisch benachrichtigt.`;
    
    sendWhatsAppNotification(whatsappMsg);
    
    console.log(`❓ Frage gestellt: ${data.id}`);
    
    res.json({ 
        success: true, 
        id: data.id,
        message: 'Frage gespeichert und Claude wird benachrichtigt'
    });
});

// POST /answer - Frage beantworten (von Claude)
app.post('/answer', (req, res) => {
    const receivedSecret = req.headers['x-task-secret'];
    
    if (receivedSecret !== SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id, answer } = req.body;
    
    if (!id || !answer) {
        return res.status(400).json({ error: 'Missing id or answer' });
    }
    
    const questionFile = path.join(QUESTIONS_DIR, `${id}.json`);
    
    if (!fs.existsSync(questionFile)) {
        return res.status(404).json({ error: 'Question not found' });
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(questionFile, 'utf8'));
        
        data.answered = true;
        data.answer = answer;
        data.answeredAt = new Date().toISOString();
        
        fs.writeFileSync(questionFile, JSON.stringify(data, null, 2));
        
        // WhatsApp-Benachrichtigung
        const whatsappMsg = `✅ *Frage beantwortet*

*Frage:* ${data.question}
*Antwort:* ${answer}

Claw arbeitet weiter...`;
        
        sendWhatsAppNotification(whatsappMsg);
        
        console.log(`✅ Frage beantwortet: ${id}`);
        
        res.json({ 
            success: true, 
            id,
            message: 'Antwort gespeichert'
        });
        
    } catch (err) {
        console.error('Fehler beim Speichern der Antwort:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Webhook Server läuft auf Port ${PORT}`);
    console.log(`   POST http://91.99.99.242:${PORT}/task     - Neue Tasks`);
    console.log(`   POST http://91.99.99.242:${PORT}/status   - Status Updates`);
    console.log(`   GET  http://91.99.99.242:${PORT}/question - Offene Fragen + Task-Antworten (Claw → Claude)`);
    console.log(`   POST http://91.99.99.242:${PORT}/question - Frage stellen`);
    console.log(`   POST http://91.99.99.242:${PORT}/answer    - Task-Antwort speichern (Claw → Claude)`);
    console.log(`   DELETE http://91.99.99.242:${PORT}/answer/{task_id} - Task-Antwort löschen (nach Lesen)`);
    console.log(`   Health: http://91.99.99.242:${PORT}/health`);
    console.log(`   Tasks werden gespeichert in: ${TASKS_DIR}`);
    console.log(`   Fragen werden gespeichert in: ${QUESTIONS_DIR}`);
    console.log(`   Task-Antworten werden gespeichert in: ${TASK_ANSWERS_DIR}`);
    console.log(`   WhatsApp Protokoll aktiviert für: ${WHATSAPP_TARGET}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
