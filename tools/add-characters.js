#!/usr/bin/env node
// Adds characters and synergies to DATA.meta
'use strict';

var fs = require('fs');
var path = require('path');

var DATA_PATH = path.join(__dirname, '..', 'js', 'datas', 'skills-data.js');

var src = fs.readFileSync(DATA_PATH, 'utf8');
var jsonStart = src.indexOf('{');
var jsonEnd = src.lastIndexOf('}');
var jsonStr = src.substring(jsonStart, jsonEnd + 1);
jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

var DATA;
try {
  DATA = JSON.parse(jsonStr);
} catch (e) {
  console.error('[add-characters] Failed to parse:', e.message);
  process.exit(1);
}

DATA.meta.characters = [
  {
    id: 'gustave',
    nom_en: 'Gustave',
    nom_fr: 'Gustave',
    role_en: 'Charged AoE / Lightning',
    role_fr: 'AoE charg\u00e9 / Foudre',
    affinities: ['break', 'base_attack', 'buff_debuff'],
    max_pictos: 3
  },
  {
    id: 'lune',
    nom_en: 'Lune',
    nom_fr: 'Lune',
    role_en: 'Versatile Utility',
    role_fr: 'Utilitaire polyvalent',
    affinities: ['burn', 'survival', 'buff_debuff'],
    max_pictos: 3
  },
  {
    id: 'maelle',
    nom_en: 'Ma\u00eblle',
    nom_fr: 'Ma\u00eblle',
    role_en: 'Primary DPS / Fire',
    role_fr: 'DPS principal / Feu',
    affinities: ['burn', 'crit', 'base_attack'],
    max_pictos: 3
  },
  {
    id: 'sciel',
    nom_en: 'Sciel',
    nom_fr: 'Sciel',
    role_en: 'Fortune / Dual mechanic',
    role_fr: 'Fortune / Double m\u00e9canique',
    affinities: ['crit', 'ap', 'buff_debuff'],
    max_pictos: 3
  },
  {
    id: 'verso',
    nom_en: 'Verso',
    nom_fr: 'Verso',
    role_en: 'Burn enabler / Perfection',
    role_fr: 'Applicateur Br\u00fblure / Perfection',
    affinities: ['burn', 'free_aim', 'mark'],
    max_pictos: 3
  },
  {
    id: 'monoco',
    nom_en: 'Monoco',
    nom_fr: 'Monoco',
    role_en: 'Shapeshifter / Break',
    role_fr: 'M\u00e9tamorphe / Fracture',
    affinities: ['break', 'survival', 'base_attack'],
    max_pictos: 3
  }
];

DATA.meta.synergies = [
  {
    id: 'burn_crit',
    label_en: 'Burn + Critical',
    label_fr: 'Br\u00fblure + Critique',
    required_tags: ['burn', 'crit'],
    description_en: 'Maximize critical damage on burning targets',
    description_fr: 'Maximiser les d\u00e9g\u00e2ts critiques sur cibles en br\u00fblure'
  },
  {
    id: 'break_attack',
    label_en: 'Break + Attack',
    label_fr: 'Fracture + Attaque',
    required_tags: ['break', 'base_attack'],
    description_en: 'Stack break damage with base attack bonuses',
    description_fr: 'Cumuler les d\u00e9g\u00e2ts de fracture avec les bonus d\'attaque de base'
  },
  {
    id: 'ap_survival',
    label_en: 'AP + Survival',
    label_fr: 'PA + Survie',
    required_tags: ['ap', 'survival'],
    description_en: 'Sustain AP economy while maintaining team health',
    description_fr: '\u00c9conomie de PA avec maintien de la sant\u00e9 de l\'\u00e9quipe'
  },
  {
    id: 'mark_burn',
    label_en: 'Mark + Burn',
    label_fr: 'Marque + Br\u00fblure',
    required_tags: ['mark', 'burn'],
    description_en: 'Exploit marked targets with burn damage over time',
    description_fr: 'Exploiter les cibles marqu\u00e9es avec les br\u00fblures'
  },
  {
    id: 'buff_crit',
    label_en: 'Buff + Critical',
    label_fr: 'Buff + Critique',
    required_tags: ['buff_debuff', 'crit'],
    description_en: 'Amplify critical output through status buffs',
    description_fr: 'Amplifier les critiques via les buffs de statut'
  }
];

var header = '// \u00a9 2026 DwarfDog \u2014 MIT License\n// https://github.com/DwarfDog/CO33-Picto-Tracker\n';
var output = header + 'var DATA = ' + JSON.stringify(DATA, null, 4) + ';\n';
fs.writeFileSync(DATA_PATH, output, 'utf8');
console.log('[add-characters] OK — ' + DATA.meta.characters.length + ' characters, ' + DATA.meta.synergies.length + ' synergies added.');
