/* =========================
   SmartSpark Global State
   Central Memory Store
   ========================= */

const AppState = {
  year: null,
  subject: null,
  chapter: null,

  /* ---------- SET VALUE ---------- */
  set(key, value) {
    if (!["year", "subject", "chapter"].includes(key)) {
      console.warn(`Invalid state key: ${key}`);
      return;
    }

    this[key] = value;

    try {
      localStorage.setItem(`smartSpark_${key}`, value);
    } catch (e) {
      console.warn("LocalStorage not available:", e);
    }
  },

  /* ---------- GET VALUE ---------- */
  get(key) {
    if (!["year", "subject", "chapter"].includes(key)) {
      console.warn(`Invalid state key: ${key}`);
      return null;
    }

    // 1. Check memory first
    if (this[key]) return this[key];

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem(`smartSpark_${key}`);
      if (stored) {
        this[key] = stored;
        return stored;
      }
    } catch (e) {
      console.warn("LocalStorage not available:", e);
    }

    return null;
  },

  /* ---------- RESET ALL ---------- */
  reset() {
    this.year = null;
    this.subject = null;
    this.chapter = null;

    try {
      localStorage.removeItem("smartSpark_year");
      localStorage.removeItem("smartSpark_subject");
      localStorage.removeItem("smartSpark_chapter");
    } catch (e) {
      console.warn("LocalStorage not available:", e);
    }
  },

  /* ---------- DEBUG ---------- */
  print() {
    console.log("📦 AppState:");
    console.log({
      year: this.year,
      subject: this.subject,
      chapter: this.chapter
    });
  }
};

/* ---------- OPTIONAL: AUTO LOAD ON START ---------- */
(function initStateFromStorage() {
  AppState.year = localStorage.getItem("smartSpark_year");
  AppState.subject = localStorage.getItem("smartSpark_subject");
  AppState.chapter = localStorage.getItem("smartSpark_chapter");
})();