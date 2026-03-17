/**
 * Build-time script: converts II2026_Invite_List.xlsx → privacy-safe lookup data
 * Run: node convert_data.cjs
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Try local xlsx, fallback to tmp install
let XLSX;
try { XLSX = require('xlsx'); } catch {
  XLSX = require(path.join('/tmp/xlsx_temp/node_modules/xlsx'));
}

const wb = XLSX.readFile(path.join(__dirname, 'II2026_Invite_List.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });

function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

const hashSet = new Set();

for (let i = 1; i < raw.length; i++) {
  const row = raw[i];
  if (!row || !row[0]) continue;

  const leaderEmail = String(row[2] || '').trim().toLowerCase();
  if (!leaderEmail || !leaderEmail.includes('@')) continue;
  hashSet.add(hashEmail(leaderEmail));
}

const lookupEntries = Array.from(hashSet).sort().map((h) => ({ h }));
const payload = JSON.stringify(lookupEntries);

// Ensure data/ directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(
  path.join(dataDir, 'results.json'),
  payload,
  'utf-8'
);

fs.writeFileSync(
  path.join(dataDir, 'results.b64'),
  Buffer.from(payload, 'utf-8').toString('base64'),
  'utf-8'
);

console.log(`✅ Wrote ${lookupEntries.length} hashed emails to data/results.json`);
console.log('✅ Wrote privacy-safe payload to data/results.b64');
