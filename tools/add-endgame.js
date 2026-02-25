#!/usr/bin/env node
// © 2026 DwarfDog — MIT License
// Enrichit skills-data.js avec source_endgame et source_boss
// Usage: node tools/add-endgame.js [--dry-run]

var fs = require('fs');
var path = require('path');
var dryRun = process.argv.includes('--dry-run');

var filePath = path.join(__dirname, '..', 'js', 'datas', 'skills-data.js');
var src = fs.readFileSync(filePath, 'utf-8');
eval(src.replace('var DATA', 'global.DATA'));

// Endgame zones (post-game / very late game)
var ENDGAME_ZONES = ['Endless Tower', "Verso's Drafts"];

// Boss name extraction patterns
var BOSS_PATTERNS = [
  { re: /[Dd]efeat(?:ing)?\s+(?:the\s+)?(?:boss\s+)?([A-Z][A-Za-zé\s'-]+?)(?:\s+boss|\s+at|\s+in|\s+found|\.|,|\s+after|\s+to)/,  group: 1 },
  { re: /[Bb]eat(?:ing)?\s+(?:the\s+)?([A-Z][A-Za-zé\s'-]+?)(?:\s+boss|\s+at|\s+in|\s+found|\.|,|\s+after|\s+to|\s+that)/,  group: 1 },
  { re: /boss[,:]?\s+([A-Z][A-Za-zé\s'-]+?)(?:\.|,|\s+at|\s+in)/,  group: 1 },
  { re: /defeating\s+([A-Z][A-Za-zé\s'-]+?)(?:\s+in|\s+at|\.|,)/, group: 1 },
];

// Known boss names for exact matching
var KNOWN_BOSSES = {
  6: 'Eveque',
  21: 'Ultimate Sakapatate',
  45: 'Lampmaster',
  58: 'Sprong',
  60: 'Eveque',
  65: 'Serpenphare',
  75: null, // generic boss
  89: 'Axon (Visages)',
  96: 'Tisseur',
  101: 'Sirene',
  138: 'Lampmaster',
  147: 'Clea',
  188: 'Steel Chevalieres',
  200: 'Licornapieds',
  202: 'Clea Unleashed',
  204: 'Barbacusette',
  205: 'Chromatic Lampmaster',
};

var stats = { endgame: 0, boss: 0, total: 0 };

DATA.pictos.forEach(function(p) {
  // source_endgame
  var zoneEn = p.zone_en || '';
  var isEndgame = ENDGAME_ZONES.indexOf(zoneEn) !== -1;
  // Also check obtention text for Endless Tower
  var obt = (p.obtention_en || '').toLowerCase();
  if (obt.indexOf('endless tower') !== -1) isEndgame = true;

  if (isEndgame) stats.endgame++;

  // source_boss (only for obtention_type === 'boss')
  var bossName = null;
  if (p.obtention_type === 'boss') {
    if (KNOWN_BOSSES[p.id] !== undefined) {
      bossName = KNOWN_BOSSES[p.id];
    }
    if (!bossName && p.obtention_en) {
      for (var i = 0; i < BOSS_PATTERNS.length; i++) {
        var match = p.obtention_en.match(BOSS_PATTERNS[i].re);
        if (match) {
          bossName = match[BOSS_PATTERNS[i].group].trim();
          break;
        }
      }
    }
    if (bossName) stats.boss++;
  }

  p._endgame = isEndgame;
  p._boss = bossName;
  stats.total++;
});

console.log('[add-endgame] Stats:');
console.log('  Endgame: ' + stats.endgame + '/' + stats.total);
console.log('  Boss drops: ' + stats.boss + '/' + stats.total);

if (dryRun) {
  console.log('\n[DRY RUN] Endgame pictos:');
  DATA.pictos.forEach(function(p) {
    if (p._endgame) console.log('  #' + p.id + ' ' + p.nom_en);
  });
  console.log('\n[DRY RUN] Boss drop pictos:');
  DATA.pictos.forEach(function(p) {
    if (p._boss) console.log('  #' + p.id + ' ' + p.nom_en + ' -> ' + p._boss);
  });
  process.exit(0);
}

// Apply to source file
var modified = src;

DATA.pictos.forEach(function(p) {
  // Match this picto's block in the source
  var idPattern = new RegExp('"id":\\s*' + p.id + ',');
  var match = idPattern.exec(modified);
  if (!match) return;

  // Find the end of "obtention_type" line for this picto
  var searchStart = match.index;
  var obtTypeRe = /"obtention_type":\s*"[^"]*"/g;
  obtTypeRe.lastIndex = searchStart;
  var obtMatch = obtTypeRe.exec(modified);
  if (!obtMatch || obtMatch.index - searchStart > 2000) return;

  var insertPos = obtMatch.index + obtMatch[0].length;
  var additions = '';

  if (p._endgame) {
    additions += ', "source_endgame": true';
  }
  if (p._boss) {
    additions += ', "source_boss": "' + p._boss.replace(/"/g, '\\"') + '"';
  }

  if (additions) {
    modified = modified.substring(0, insertPos) + additions + modified.substring(insertPos);
  }
});

fs.writeFileSync(filePath, modified, 'utf-8');
console.log('[add-endgame] Written to ' + filePath);
