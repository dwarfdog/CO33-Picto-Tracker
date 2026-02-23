/**
 * Script de réconciliation : parse brut-data.html et produit les données
 * manquantes pour skills-data.js (stats vides/? + lumina cost).
 *
 * Usage : node scripts/reconcile.js
 * Produit : scripts/reconcile-output.json
 */
const fs = require('fs');
const path = require('path');

// ── 1. Parser brut-data.html ──────────────────────────────────────
const htmlPath = path.join(__dirname, '..', 'brut-data.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extraire chaque <tr> avec des données
const rowRegex = /<tr[^>]*>\s*<td class="Pictos_cell center">([\s\S]*?)<\/td>\s*<td class="Details_cell">([\s\S]*?)<\/td>\s*<td class="Cost_cell center">([\s\S]*?)<\/td>\s*<\/tr>/gi;

const brutData = {};
let match;
while ((match = rowRegex.exec(html)) !== null) {
  const pictoCell = match[1];
  const detailsCell = match[2];
  const costCell = match[3].trim();

  // Extraire le nom du Picto
  const nameMatch = pictoCell.match(/data-loaded="true">([^<]+)<\/a>/i)
                 || pictoCell.match(/>([^<]+)<\/a>\s*$/i);
  if (!nameMatch) continue;
  const name = nameMatch[1].trim();

  // Extraire le coût Lumina
  const lumina = parseInt(costCell, 10) || 0;

  // Extraire les Bonus Stats
  const stats = {};
  const statsSection = detailsCell.match(/Bonus Stats:<\/b>\s*<br>([\s\S]*?)$/i);
  if (statsSection) {
    const statsText = statsSection[1].replace(/<[^>]+>/g, ' ').trim();

    // Health
    const healthMatch = statsText.match(/([\d,]+)\s*Health/i);
    if (healthMatch) stats.sante = healthMatch[1].replace(/,/g, '');

    // Defense
    const defenseMatch = statsText.match(/([\d,]+)\s*Defense/i);
    if (defenseMatch) stats.defense = defenseMatch[1].replace(/,/g, '');

    // Speed
    const speedMatch = statsText.match(/([\d,]+)\s*Speed/i);
    if (speedMatch) stats.vitesse = speedMatch[1].replace(/,/g, '');

    // Critical Rate
    const critMatch = statsText.match(/([\d.]+)%\s*Crit(?:ical)?\s*Rate/i);
    if (critMatch) {
      const pct = parseFloat(critMatch[1]);
      stats.chances_crit = (pct / 100).toFixed(2);
    }
  }

  brutData[name] = { lumina, stats };
}

console.log(`Parsed ${Object.keys(brutData).length} Pictos from brut-data.html`);

// ── 2. Lire skills-data.js ────────────────────────────────────────
const skillsPath = path.join(__dirname, '..', 'js', 'datas', 'skills-data.js');
const skillsRaw = fs.readFileSync(skillsPath, 'utf-8');

// Extraire le JSON (après "const DATA = ")
const jsonStart = skillsRaw.indexOf('{');
// Trouver la fin: chercher le dernier }; ou }
let jsonStr = skillsRaw.slice(jsonStart);
// Enlever le ; final si présent
if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
if (jsonStr.endsWith(';\n')) jsonStr = jsonStr.slice(0, -2);
// Nettoyer les trailing semicolons
jsonStr = jsonStr.replace(/;\s*$/, '');

const DATA = JSON.parse(jsonStr);
console.log(`Loaded ${DATA.pictos.length} Pictos from skills-data.js`);

// ── 3. Réconcilier ───────────────────────────────────────────────
const report = {
  stats_filled: [],
  stats_still_empty: [],
  question_marks_fixed: [],
  question_marks_still_unknown: [],
  lumina_added: 0,
  lumina_not_found: [],
};

DATA.pictos.forEach(picto => {
  const name = picto.nom_en;
  const brut = brutData[name];

  // Ajouter lumina
  if (brut) {
    picto.lumina = brut.lumina;
    report.lumina_added++;
  } else {
    picto.lumina = 0;
    report.lumina_not_found.push(name);
  }

  // Remplir stats manquantes
  const currentStats = picto.statistiques || {};
  const isEmpty = Object.keys(currentStats).length === 0;
  const hasQuestionMarks = Object.values(currentStats).some(v => v === '?');

  if (isEmpty && brut && Object.keys(brut.stats).length > 0) {
    picto.statistiques = brut.stats;
    report.stats_filled.push(name);
  } else if (isEmpty && (!brut || Object.keys(brut.stats).length === 0)) {
    report.stats_still_empty.push(name);
  }

  if (hasQuestionMarks && brut) {
    const newStats = {};
    for (const [k, v] of Object.entries(currentStats)) {
      if (v === '?' && brut.stats[k]) {
        newStats[k] = brut.stats[k];
        report.question_marks_fixed.push(`${name}.${k}: ? → ${brut.stats[k]}`);
      } else if (v === '?') {
        newStats[k] = v; // keep ?
        report.question_marks_still_unknown.push(`${name}.${k}`);
      } else {
        newStats[k] = v;
      }
    }
    picto.statistiques = newStats;
  }
});

// ── 4. Mettre à jour les métadonnées ─────────────────────────────
DATA.meta.total_pictos = DATA.pictos.length;
// Recompter traductions
let confirmees = 0, derivees = 0;
DATA.pictos.forEach(p => {
  if (p.traduction_confirmee) confirmees++;
  else derivees++;
});
DATA.meta.traductions_confirmees = confirmees;
DATA.meta.traductions_derivees = derivees;

// ── 5. Écrire le rapport ─────────────────────────────────────────
console.log('\n=== RAPPORT DE RÉCONCILIATION ===');
console.log(`Stats remplies (étaient vides) : ${report.stats_filled.length}`);
console.log(`Stats toujours vides (brut-data aussi vide) : ${report.stats_still_empty.length}`);
console.log(`"?" corrigés : ${report.question_marks_fixed.length}`);
console.log(`"?" toujours inconnus : ${report.question_marks_still_unknown.length}`);
console.log(`Lumina ajouté : ${report.lumina_added}/${DATA.pictos.length}`);
console.log(`Lumina non trouvé dans brut-data : ${report.lumina_not_found.length}`);

if (report.stats_filled.length > 0) {
  console.log('\nStats remplies pour :');
  report.stats_filled.forEach(n => console.log('  ✓ ' + n));
}
if (report.stats_still_empty.length > 0) {
  console.log('\nStats toujours vides :');
  report.stats_still_empty.forEach(n => console.log('  ○ ' + n));
}
if (report.question_marks_fixed.length > 0) {
  console.log('\n"?" corrigés :');
  report.question_marks_fixed.forEach(n => console.log('  ✓ ' + n));
}
if (report.question_marks_still_unknown.length > 0) {
  console.log('\n"?" toujours inconnus :');
  report.question_marks_still_unknown.forEach(n => console.log('  ○ ' + n));
}
if (report.lumina_not_found.length > 0) {
  console.log('\nLumina non trouvé :');
  report.lumina_not_found.forEach(n => console.log('  ✗ ' + n));
}

// ── 6. Écrire le fichier skills-data.js mis à jour ──────────────
const header = '// © 2026 DwarfDog — MIT License\n// https://github.com/DwarfDog/CO33-Picto-Tracker\n';
const output = header + 'const DATA = ' + JSON.stringify(DATA, null, 4) + ';\n';
fs.writeFileSync(skillsPath, output, 'utf-8');
console.log('\n✅ skills-data.js mis à jour !');

// Écrire aussi le rapport JSON
const reportPath = path.join(__dirname, 'reconcile-output.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log('📄 Rapport sauvegardé dans scripts/reconcile-output.json');
