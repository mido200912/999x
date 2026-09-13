/**
 * lib/i18n.ts — English only (Arabic removed per request)
 * All UI text is now English. This file keeps a single dictionary for consistency
 * and for future i18n if needed. No more bilingual toggle.
 */

export const dict = {
  // Header
  nav_pulse: 'Diagnostic',
  nav_modules: 'Four Engines',
  nav_roadmap: 'Roadmap',
  nav_warroom: 'War Room',
  btn_client: 'Client Hub',
  btn_start: 'Start Free Diagnostic',
  // Hero
  hero_title1: 'Autonomous Ops.',
  hero_title2: 'Disciplined HR.',
  hero_title3: 'Infinite Sponsors.',
  hero_desc:
    'Re-engineer HR & sponsor pipeline in 48 hours — instant AI diagnosis, verified RACI, ready-to-send pitch decks.',
  hero_cta: 'Start Free Diagnostic',
  hero_demo: 'View Live Client Hub',
  // Pulse
  pulse_title: 'Diagnose Your Org in 20 Seconds',
  pulse_desc: 'Pick your team type & friction — let the engine score health instantly.',
  // Common
  loading: 'Loading...',
  empty: 'No data yet',
} as const;

// For backward compatibility with old useLang hook — now always 'en'
export type Lang = 'en';
export type DictKey = keyof typeof dict;
