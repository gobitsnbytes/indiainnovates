/**
 * Build-time script: converts II2026_Invite_List.xlsx → data/results.json
 * Run: node convert_data.cjs
 */
const path = require('path');
const fs = require('fs');

// Try local xlsx, fallback to tmp install
let XLSX;
try { XLSX = require('xlsx'); } catch {
  XLSX = require(path.join('/tmp/xlsx_temp/node_modules/xlsx'));
}

const DOMAIN_MAP = {
  '1': 'Urban Solutions',
  '2': 'Digital Democracy',
  '3': 'Open Innovation',
  '': 'Open Innovation',
};

const wb = XLSX.readFile(path.join(__dirname, 'II2026_Invite_List.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Group rows by team (Rank column). Multiple candidates per team share same rank+team name.
const teamMap = new Map();

for (let i = 1; i < raw.length; i++) {
  const row = raw[i];
  if (!row || !row[0]) continue;

  const rank = Number(row[0]);
  const teamName = String(row[1] || '').trim();
  const leaderEmail = String(row[2] || '').trim();
  const org = String(row[5] || '').trim();
  const domain = String(row[6] || '').trim();
  const score = Number(row[7] || 0);

  const key = `${rank}_${teamName}`;
  if (!teamMap.has(key)) {
    teamMap.set(key, {
      r: rank,
      t: teamName,
      l: Buffer.from(leaderEmail).toString('base64'),
      o: org,
      d: DOMAIN_MAP[domain] || 'Open Innovation',
      s: score,
    });
  }
}

const teams = Array.from(teamMap.values()).sort((a, b) => a.r - b.r);

// Ensure data/ directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(
  path.join(dataDir, 'results.json'),
  JSON.stringify(teams),
  'utf-8'
);

console.log(`✅ Wrote ${teams.length} teams to data/results.json`);
