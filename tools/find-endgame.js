#!/usr/bin/env node
// Quick script to identify endgame pictos
var fs = require('fs');
var src = fs.readFileSync('js/datas/skills-data.js', 'utf-8');
eval(src.replace('var DATA', 'global.DATA'));

console.log('=== Endless Tower / Unleashed pictos ===');
DATA.pictos.forEach(function(p) {
  var obt = (p.obtention_en || '').toLowerCase();
  if (obt.indexOf('endless tower') !== -1 || obt.indexOf('unleashed') !== -1) {
    console.log('#' + p.id + ' | ' + p.nom_en + ' | ' + (p.obtention_en || 'N/A').substring(0, 120));
  }
});

console.log('\n=== Verso\'s Drafts pictos ===');
DATA.pictos.forEach(function(p) {
  var obt = (p.obtention_en || '').toLowerCase();
  if (obt.indexOf("verso's drafts") !== -1 || obt.indexOf('verso') !== -1) {
    console.log('#' + p.id + ' | ' + p.nom_en + ' | zone=' + (p.zone_en || '?'));
  }
});

console.log('\n=== Zone list ===');
var zones = {};
DATA.pictos.forEach(function(p) {
  var z = p.zone_en || '(none)';
  if (!zones[z]) zones[z] = 0;
  zones[z]++;
});
Object.keys(zones).sort().forEach(function(z) {
  console.log('  ' + z + ': ' + zones[z]);
});
