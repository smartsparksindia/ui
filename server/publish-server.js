#!/usr/bin/env node
const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const REPO_ROOT = process.env.REPO_ROOT || path.join(__dirname, '..');
const PUBLISH_SECRET = process.env.PUBLISH_SECRET || null; // optional shared secret
const PUSH_ON_PUBLISH = (process.env.PUSH_ON_PUBLISH || 'false').toLowerCase() === 'true';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function safeWrite(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data || {}, null, 2));
}

app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.post('/publish', (req, res) => {
  try {
    if (PUBLISH_SECRET) {
      const incoming = req.headers['x-publish-secret'] || req.query.secret;
      if (!incoming || incoming !== PUBLISH_SECRET) {
        return res.status(401).json({ error: 'invalid secret' });
      }
    }

    const payload = req.body;
    if (!payload) return res.status(400).json({ error: 'missing payload' });

    const outDir = path.join(REPO_ROOT, 'data', 'published');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    safeWrite(path.join(outDir, 'chapters.json'), payload.chapters || payload.chapters || []);
    safeWrite(path.join(outDir, 'flashcards.json'), payload.flashcards || payload.flashcards || []);
    safeWrite(path.join(outDir, 'questions.json'), payload.questions || payload.questions || []);

    // Git commit
    try {
      execSync(`git add ${outDir}/*`, { cwd: REPO_ROOT, stdio: 'inherit' });
      const msg = `Publish: ${new Date().toISOString()}`;
      execSync(`git commit -m "${msg}"`, { cwd: REPO_ROOT, stdio: 'inherit' });
      if (PUSH_ON_PUBLISH) {
        execSync('git push', { cwd: REPO_ROOT, stdio: 'inherit' });
      }
    } catch (e) {
      console.warn('Git commit/push failed:', e.message);
    }

    res.json({ ok: true, message: 'Published and written to data/published' });
  } catch (e) {
    console.error('Publish error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Publish server listening on http://localhost:${PORT}`);
  if (PUBLISH_SECRET) console.log('PUBLISH_SECRET is set - using authentication');
  if (PUSH_ON_PUBLISH) console.log('PUSH_ON_PUBLISH enabled - will attempt git push after commit');
});

// EOF
