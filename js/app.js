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
  STORAGE_VERSION: 4,
  MAX_PROFILES: 12,

  // ── Constantes ──
  ANIMATION_DELAY_PER_CARD: 15,
  ANIMATION_DELAY_MAX: 800,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 150,
  FILE_MAX_SIZE: 1048576, // 1 Mo

  // ── État applicatif (initialisé par state.js) ──
  etat: null,

  // ── Cache DOM des cartes (géré par cards.js) ──
  toutes_cartes: [],
  cartesParId: {},

  // ── Cache DOM fréquemment accédé (initialisé par boot.js) ──
  _dom: {},

  // ── Cache données (initialisé par boot.js) ──
  _idsValides: null,       // Set<number> — IDs valides issus de DATA.pictos
  _pictoParId: null,       // Map<number, Object> — Lookup rapide par ID
  _cachedStatLabels: null, // Object — Labels de stats mis en cache après changement de langue
  _svgTemplates: {},       // Object — SVGs clonables (flag, checkmark)
  _gameplayConfigCache: null, // Object — Config gameplay normalisee (tags/regles)

  // ── État d'accessibilité des modales ──
  _activeModal: null,
  _lastFocusedBeforeModal: null
};
