/**
 * Build-time script: converts ii2026_final_1000_fixed.csv → privacy-safe lookup data
 * Run: node convert_data.cjs
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const SOURCE_CSV = path.join(__dirname, 'ii2026_final_1000_fixed.csv');

function splitCsvLine(line) {
  const cols = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cols.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }

  cols.push(cur);
  return cols;
}

function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

const hashSet = new Set();

const csv = fs.readFileSync(SOURCE_CSV, 'utf-8');
const lines = csv.split(/\r?\n/).filter(Boolean);

for (let i = 1; i < lines.length; i++) {
  const row = splitCsvLine(lines[i]);
  if (!row || !row[0]) continue;

  // CSV layout: [id, rank, team, leaderEmail, leaderName, candidateEmail, ...]
  const leaderEmail = String(row[3] || '').trim().toLowerCase();
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
