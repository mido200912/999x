/**
 * hooks/useLang.ts — Simplified to English only
 * Previously handled ar/en toggle + localStorage + html dir.
 * Now always returns 'en' and ltr, no toggle needed.
 * Kept for compatibility so components using useLang still work.
 */
import { dict } from '../lib/i18n';

export function useLang() {
  const lang = 'en' as const;
  // Ensure html is English ltr (runs once per mount)
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }
  const t = (key: keyof typeof dict) => dict[key] || key;
  return { lang, setLang: (_: string) => {}, t, isAr: false };
}
