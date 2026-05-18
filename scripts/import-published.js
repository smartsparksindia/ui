#!/usr/bin/env node
// scripts/import-published.js
// Usage: node import-published.js path/to/export.json "Commit message"

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node import-published.js path/to/export.json [commit message]');
  process.exit(1);
}

const filePath = process.argv[2];
const commitMsg = process.argv[3] || `Import published data ${new Date().toISOString()}`;

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
let payload;
try {
  payload = JSON.parse(raw);
} catch (e) {
  console.error('Invalid JSON:', e.message);
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'data', 'published');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Write separate files
fs.writeFileSync(path.join(outDir, 'chapters.json'), JSON.stringify(payload.chapters || {}, null, 2));
fs.writeFileSync(path.join(outDir, 'flashcards.json'), JSON.stringify(payload.flashcards || {}, null, 2));
fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(payload.questions || {}, null, 2));

console.log('Wrote published data to', outDir);

try {
  execSync(`git add ${outDir}/*`, { stdio: 'inherit' });
  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
  console.log('Committed published data to git. Push when ready.');
} catch (e) {
  console.warn('Git commit failed (you may need to commit manually):', e.message);
}
