// ============================================================
// STORAGE — localStorage wrapper with namespaced keys
// ============================================================
const NS = 'mor_aps_';

export const storage = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  },
  remove: (key) => localStorage.removeItem(NS + key),
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .forEach(k => localStorage.removeItem(k));
  },
};

export const STORE_KEYS = {
  USERS: 'users',
  PLANS: 'plans',
  CASES: 'cases',
  SEEDED: 'seeded_v5',
};
