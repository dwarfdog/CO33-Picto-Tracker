#!/usr/bin/env node
// ══════════════════════════════════════════════════════
//  ENRICH-DATA — Auto-classify pictos with categorie & obtention_type
//  Usage: node tools/enrich-data.js [--dry-run]
// ══════════════════════════════════════════════════════
'use strict';

var fs = require('fs');
var path = require('path');

var DATA_PATH = path.join(__dirname, '..', 'js', 'datas', 'skills-data.js');
var DRY_RUN = process.argv.includes('--dry-run');

// ── Load DATA ──
var src = fs.readFileSync(DATA_PATH, 'utf8');
// Extract just the object literal (strip "var DATA = " prefix and trailing ";")
var jsonStart = src.indexOf('{');
var jsonEnd = src.lastIndexOf('}');
var jsonStr = src.substring(jsonStart, jsonEnd + 1);

// Fix trailing commas for JSON parsing
jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

var DATA;
try {
  DATA = JSON.parse(jsonStr);
} catch (e) {
  console.error('[enrich-data] Failed to parse DATA:', e.message);
  process.exit(1);
}

// ══════════════════════════════════════════════════════
//  CATEGORY CLASSIFICATION (offensive / defensive / support)
// ══════════════════════════════════════════════════════

function classifyCategory(picto) {
  var effect = (picto.effet_en || '').toLowerCase();

  // ── Defensive keywords (check first — more specific) ──
  var defensivePatterns = [
    /take \d+% less damage/,
    /damage reduction/,
    /reduce.* damage/,
    /immune to/,
    /immunity/,
    /apply shell/,
    /gain shell/,
    /shell for/,
    /carapace/,
    /barrier/,
    /revive/,
    /play when/,
    /recover.*health/,
    /restore.*health/,
    /heal.*self/,
    /healing tint/,
    /healing.*remove/,
    /remove.*status effect/,
    /remove.*negative/,
    /dispel/,
    /protect/,
    /can.t (?:drop|fall) below/,
    /prevent.*death/,
    /parry.*heal/,
    /heal.*parry/,
    /below \d+% health/,
    /damage.*received/,
  ];

  // ── Offensive keywords ──
  var offensivePatterns = [
    /increased.*damage/,
    /increase.*damage/,
    /more damage/,
    /deal \d+%/,
    /\d+% (?:increased )?(?:base )?attack/,
    /burn/,
    /burning/,
    /break damage/,
    /stagger/,
    /critical/,
    / crit /,
    /apply mark/,
    /mark.*target/,
    /marked enem/,
    /defenceless/,
    /defenseless/,
    /powerful for/,
    /gain powerful/,
    /vulnerability/,
    /free aim.*damage/,
    /aim shot.*damage/,
    /execute/,
    /instant kill/,
    /bonus damage/,
  ];

  // ── Support keywords ──
  var supportPatterns = [
    /\+\d+ ap/,
    /gain \d+ ap/,
    /ap to all/,
    /allies/,
    /ally/,
    /team/,
    /heal.*ally/,
    /healing.*ally/,
    /when healing/,
    /action point/,
    /start.*turn.*with/,
    /start of combat/,
    /start of turn/,
    /first turn/,
    /once per turn/i,
    /speed/,
  ];

  var defScore = 0;
  var offScore = 0;
  var supScore = 0;

  defensivePatterns.forEach(function (p) { if (p.test(effect)) defScore++; });
  offensivePatterns.forEach(function (p) { if (p.test(effect)) offScore++; });
  supportPatterns.forEach(function (p) { if (p.test(effect)) supScore++; });

  // Tiebreaker: if equally offensive and support → offensive (damage output)
  if (offScore > defScore && offScore >= supScore) return 'offensive';
  if (defScore > offScore && defScore >= supScore) return 'defensive';
  if (supScore > offScore && supScore > defScore) return 'support';

  // If tied, use stats as hint
  var stats = picto.statistiques || {};
  if (stats.sante || stats.defense) return 'defensive';
  if (stats.chances_crit) return 'offensive';

  // Default
  return 'support';
}

// ══════════════════════════════════════════════════════
//  OBTENTION TYPE CLASSIFICATION
// ══════════════════════════════════════════════════════

function classifyObtention(picto) {
  var text = (picto.obtention_en || '').toLowerCase();
  var textFr = (picto.obtention_fr || '').toLowerCase();

  // Paint Cage
  if (/paint(?:ed)? cage/i.test(text) || /cage de peinture/i.test(textFr)) {
    return 'paint_cage';
  }

  // Merchant
  if (/\b(?:buy|purchase|merchant|chroma|shop|store|wares|price|exchanging|from najabla)\b/i.test(text)) {
    return 'merchant';
  }

  // Boss (fight/defeat a named boss or boss entity)
  if (/\bboss\b/i.test(text) || /\bunleashed\b/i.test(text)) {
    return 'boss';
  }
  // Named boss defeat patterns
  if (/defeat.*(?:eveque|simon|clea|nebula|ombre|champion|roi|queen|king)/i.test(text)) {
    return 'boss';
  }

  // Quest
  if (/\bquest\b/i.test(text) || /\bside quest\b/i.test(text)) {
    return 'quest';
  }

  // Story (automatic/story progression)
  if (/\b(?:automatic|story|after.*joins|portier)\b/i.test(text) ||
      /automatique/i.test(textFr)) {
    return 'story';
  }

  // Default: exploration
  return 'exploration';
}

// ══════════════════════════════════════════════════════
//  ENRICH ALL PICTOS
// ══════════════════════════════════════════════════════

var stats = { offensive: 0, defensive: 0, support: 0 };
var obtStats = { exploration: 0, paint_cage: 0, boss: 0, merchant: 0, quest: 0, story: 0 };

DATA.pictos.forEach(function (picto) {
  var cat = classifyCategory(picto);
  var obt = classifyObtention(picto);
  picto.categorie = cat;
  picto.obtention_type = obt;
  stats[cat] = (stats[cat] || 0) + 1;
  obtStats[obt] = (obtStats[obt] || 0) + 1;
});

// Add meta definitions
DATA.meta.categories = [
  { id: 'offensive', label_en: 'Offensive', label_fr: 'Offensif' },
  { id: 'defensive', label_en: 'Defensive', label_fr: 'D\u00e9fensif' },
  { id: 'support', label_en: 'Support', label_fr: 'Support' }
];

DATA.meta.obtention_types = [
  { id: 'exploration', label_en: 'Exploration', label_fr: 'Exploration' },
  { id: 'paint_cage', label_en: 'Paint Cage', label_fr: 'Cage de Peinture' },
  { id: 'quest', label_en: 'Quest', label_fr: 'Qu\u00eate' },
  { id: 'boss', label_en: 'Boss', label_fr: 'Boss' },
  { id: 'merchant', label_en: 'Merchant', label_fr: 'Marchand' },
  { id: 'story', label_en: 'Story', label_fr: 'Histoire' }
];

console.log('[enrich-data] Category distribution:', JSON.stringify(stats));
console.log('[enrich-data] Obtention distribution:', JSON.stringify(obtStats));

if (DRY_RUN) {
  console.log('[enrich-data] DRY RUN — no file modified.');
  // Print a few samples
  [1, 50, 100, 150, 200].forEach(function (id) {
    var p = DATA.pictos.find(function (x) { return x.id === id; });
    if (p) console.log('  ID ' + id + ' (' + p.nom_en + '): categorie=' + p.categorie + ', obtention_type=' + p.obtention_type);
  });
  process.exit(0);
}

// ── Write back ──
var header = '// \u00a9 2026 DwarfDog \u2014 MIT License\n// https://github.com/DwarfDog/CO33-Picto-Tracker\n';
var output = header + 'var DATA = ' + JSON.stringify(DATA, null, 4) + ';\n';
fs.writeFileSync(DATA_PATH, output, 'utf8');
console.log('[enrich-data] OK — skills-data.js updated with categorie & obtention_type fields.');
