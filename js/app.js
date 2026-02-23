// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  APP — Namespace central
//  Tous les modules s'enregistrent sur cet objet.
// ══════════════════════════════════════════════════════
var App = {
  // ── Registre des langues (rempli par lang/*.js) ──
  langs: {},
  SUPPORTED_LANGS: [],
  DEFAULT_LANG: 'en',
  LANG: null,

  // ── Configuration ──
  STORAGE_KEY: 'ce33_pictos_possedes',
  LANG_STORAGE_KEY: 'ce33_langue',

  // ── Constantes ──
  ANIMATION_DELAY_PER_CARD: 15,
  ANIMATION_DELAY_MAX: 800,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 150,

  // ── État applicatif (initialisé par state.js) ──
  etat: null,

  // ── Cache DOM des cartes (géré par cards.js) ──
  toutes_cartes: [],
  cartesParId: {}
};
