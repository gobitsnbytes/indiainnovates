/**
 * merge_domains.cjs
 *
 * Pulls domain info from "II2026_Invite_List copy.xlsx" and
 * merges it into the convert_data.cjs pipeline by reading
 * both files and building the final results.json directly.
 *
 * Column layout:
 *   copy.xlsx  → [Rank, Team Name, Leader Email, Candidate Name, Candidate Email, Organisation, Domain, ...]
 *   invite.xlsx → [team_name, Leader Email, Candidate Name, Candidate Email, Organisation]
 *
 * Match key: team_name (case-insensitive trim)
 * Run: node merge_domains.cjs
 */
const path = require('path');
const fs   = require('fs');

let XLSX;
try { XLSX = require('xlsx'); } catch {
  XLSX = require(path.join('/tmp/xlsx_temp/node_modules/xlsx'));
}

// ─── Domain map (same as convert_data.cjs) ────────────────────────────────
const DOMAIN_MAP = {
  '1': 'Urban Solutions',
  '2': 'Digital Democracy',
  '3': 'Open Innovation',
  '':  'Open Innovation',
};

// ─── Load both workbooks ──────────────────────────────────────────────────
const inviteFile = path.join(__dirname, 'II2026_Invite_List.xlsx');
const copyFile   = path.join(__dirname, 'II2026_Invite_List copy.xlsx');

const rawInvite = XLSX.utils.sheet_to_json(
  XLSX.readFile(inviteFile).Sheets[XLSX.readFile(inviteFile).SheetNames[0]],
  { header: 1 }
);

const wbCopy = XLSX.readFile(copyFile);
const rawCopy = XLSX.utils.sheet_to_json(
  wbCopy.Sheets[wbCopy.SheetNames[0]],
  { header: 1 }
);

// ─── Build domain lookup from copy.xlsx ──────────────────────────────────
// copy.xlsx columns: [0]=Rank [1]=TeamName [2]=LeaderEmail [3]=CandName
//                    [4]=CandEmail [5]=Org [6]=Domain [7]=Score...
const domainByTeam = new Map(); // teamName.toLowerCase() → domain string ('1'|'2'|'3')

for (let i = 1; i < rawCopy.length; i++) {
  const row = rawCopy[i];
  if (!row || !row[1]) continue;
  const teamName = String(row[1]).trim().toLowerCase();
  const domain   = String(row[6] ?? '').trim();
  if (!domainByTeam.has(teamName)) {
    domainByTeam.set(teamName, domain);
  }
}

console.log(`✅ Loaded ${domainByTeam.size} domain entries from copy.xlsx`);

// ─── Process invite list ──────────────────────────────────────────────────
// invite.xlsx columns: [0]=team_name [1]=LeaderEmail [2]=CandName
//                      [3]=CandEmail [4]=Org
const teamMap = new Map(); // key → team object

let matched = 0, unmatched = 0;

for (let i = 1; i < rawInvite.length; i++) {
  const row = rawInvite[i];
  if (!row || !row[0]) continue;

  const teamName    = String(row[0]).trim();
  const leaderEmail = String(row[1] || '').trim();
  const org         = String(row[4] || '').trim();

  // Look up domain from copy.xlsx
  const domainCode = domainByTeam.get(teamName.toLowerCase()) ?? '';
  const domainLabel = DOMAIN_MAP[domainCode] || 'Open Innovation';

  if (domainByTeam.has(teamName.toLowerCase())) {
    matched++;
  } else {
    unmatched++;
  }

  const key = teamName.toLowerCase();
  if (!teamMap.has(key)) {
    teamMap.set(key, {
      r: teamMap.size + 1,   // serial number (1-based)
      t: teamName,
      l: Buffer.from(leaderEmail).toString('base64'),
      o: org,
      d: domainLabel
    });
  }
}

const teams = Array.from(teamMap.values());

console.log(`✅ Processed ${teams.length} unique teams`);
console.log(`   Matched domain: ${matched} rows`);
console.log(`   No domain (→ Open Innovation): ${unmatched} rows`);

// ─── Write results.json ───────────────────────────────────────────────────
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(
  path.join(dataDir, 'results.json'),
  JSON.stringify(teams),
  'utf-8'
);

console.log(`✅ Wrote ${teams.length} teams to data/results.json`);
