// Webhook Server für Claude → Claw Kommunikation
// Läuft auf Port 3333, empfängt Tasks via POST /task
// Mit Telegram-Protokoll für Live-Chat zwischen Claude und Claw

const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const app = express();
const PORT = 3333;
const TASKS_DIR = path.join(process.env.HOME, 'projects', 'claw-channel', 'tasks', 'incoming');
const COMPLETED_DIR = path.join(process.env.HOME, 'projects', 'claw-channel', 'tasks', 'completed');
const STATUS_FILE = path.join(process.env.HOME, 'projects', 'claw-channel', 'reports', 'STATUS.md');

// Middleware
app.use(express.json());

// Secret aus Umgebung oder Datei
const SECRET_FILE = path.join(process.env.HOME, 'projects', 'claw-channel', '.webhook-secret');
let SECRET = process.env.WEBHOOK_SECRET;

if (!SECRET && fs.existsSync(SECRET_FILE)) {
  SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();
  console.log('🔐 Secret aus Datei geladen');
}

const TELEGRAM_TARGET = '1008896685';

if (!SECRET) {
  console.error('❌ WEBHOOK_SECRET nicht gesetzt!');
  console.error('   Bitte: export WEBHOOK_SECRET="..." in ~/.bashrc');
  console.error('   Oder: echo "SECRET" > ~/projects/claw-channel/.webhook-secret');
  process.exit(1);
}

// Hilfsfunktion: Text für Telegram kürzen
function formatForTelegram(text) {
  if (!text) return '';
  if (text.length > 3500) {
    return text.substring(0, 3500) + '\n\n... [Text gekürzt]';
  }
  return text;
}

// Hilfsfunktion: Telegram-Benachrichtigung senden
function sendTelegramNotification(message, attempt = 1) {
  const maxRetries = 2;
  const retryDelayMs = 2000;
  
  try {
    const OPENCLAW_BIN = '/home/openclaw/.npm-global/bin/openclaw';
    const escapedMsg = message.replace(/"/g, '\\"');
    const cmd = `${OPENCLAW_BIN} message send --channel telegram --target "${TELEGRAM_TARGET}" --message "${escapedMsg}" 2>&1`;
    
    const result = execSync(cmd, { timeout: 30000 }).toString();
    console.log('📱 Telegram gesendet:', result.substring(0, 100));
    return true;
  } catch (err) {
    console.error(`⚠️ Telegram Fehler (Versuch ${attempt}):`, err.message);
    if (attempt < maxRetries) {
      setTimeout(() => sendTelegramNotification(message, attempt + 1), retryDelayMs);
    }
    return false;
  }
}

// POST /task - Task empfangen und an OpenClaw weiterleiten
app.post('/task', async (req, res) => {
  const secret = req.headers['x-task-secret'];
  if (secret !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, content, deliver, channel, target } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  try {
    // Task als JSON-Datei speichern
    fs.mkdirSync(TASKS_DIR, { recursive: true });
    fs.mkdirSync(COMPLETED_DIR, { recursive: true });
    
    const timestamp = Date.now();
    const filename = `task_${timestamp}_${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.json`;
    const filepath = path.join(TASKS_DIR, filename);
    
    const taskData = {
      title,
      content,
      deliver,
      channel,
      target,
      timestamp,
      receivedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(filepath, JSON.stringify(taskData, null, 2));
    
    console.log('📥 Task gespeichert:', filename);
    
    // Telegram-Notifikation
    const now = new Date();
    const timeStr = now.toLocaleTimeString ? now.toLocaleTimeString('de-DE') : now.toTimeString().slice(0, 8);
    const telegramMsg = `📨 Claude → Claw\n\nTask: ${title}\nZeit: ${timeStr}`;
    sendTelegramNotification(telegramMsg);
    
    res.json({ success: true, filename, title, timestamp });
  } catch (err) {
    console.error('❌ Fehler beim Speichern:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /status - STATUS.md auslesen
app.get('/status', (req, res) => {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf8');
      res.json({ status: 'ok', content, updated: fs.statSync(STATUS_FILE).mtime.toISOString() });
    } else {
      res.status(404).json({ error: 'STATUS.md not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook Server läuft auf Port ${PORT}`);
  console.log(`  POST http://91.99.99.242:${PORT}/task    - Tasks empfangen`);
  console.log(`  GET  http://91.99.99.242:${PORT}/status   - Status abrufen`);
  console.log(`  Telegram aktiviert für: ${TELEGRAM_TARGET}`);
});
