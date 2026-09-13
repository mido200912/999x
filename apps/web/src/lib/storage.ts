/**
 * lib/storage.ts — طبقة LocalStorage الموحدة
 * كل الصفحات تحفظ وتقرأ من هنا، لا تستخدم localStorage مباشرة
 * المفتاح يبدأ بـ 999x_ لمنع التعارض
 */

const PREFIX = '999x_';

export const storage = {
  /** قراءة */
  get<T>(key: string, fallback: T | null = null): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  /** كتابة */
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {}
  },
  /** إضافة لعنصر مصفوفة */
  push<T>(key: string, value: T) {
    const arr = this.get<T[]>(key, []) || [];
    arr.push(value);
    this.set(key, arr);
    return arr;
  },
  /** حذف */
  remove(key: string) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {}
  },
  /** كل المفاتيح الخاصة بنا */
  keys() {
    return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
  },
};

// اختصارات للاستخدام السريع
export const LS_KEYS = {
  LANG: 'lang',
  PULSE: 'pulse',
  CLIENT: 'client',
  CLIENTS: 'clients',
  WIZARD: 'wizard',
  LEADS: 'leads',
  KANBAN: 'kanban_tasks',
} as const;
