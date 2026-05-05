/* =========================
   SmartSpark App Core
   Handles state + navigation
   ========================= */

/* ---------- STATE STORAGE ---------- */
const AppState = {
  year: null,
  subject: null,
  chapter: null,

  set(key, value) {
    this[key] = value;
    localStorage.setItem(`smartSpark_${key}`, value);
  },

  get(key) {
    const urlValue = getURLParam(key);
    if (urlValue) {
      this[key] = urlValue;
      localStorage.setItem(`smartSpark_${key}`, urlValue);
      return urlValue;
    }

    const stored = localStorage.getItem(`smartSpark_${key}`);
    this[key] = stored;
    return stored;
  },

  reset() {
    this.year = null;
    this.subject = null;
    this.chapter = null;
    localStorage.removeItem("smartSpark_year");
    localStorage.removeItem("smartSpark_subject");
    localStorage.removeItem("smartSpark_chapter");
  }
};

/* ---------- URL HELPERS ---------- */
function getURLParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function setURL(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  window.location.href = `${path}${query ? "?" + query : ""}`;
}

/* ---------- NAVIGATION HELPERS ---------- */

/**
 * Step 1: Select Year → go to subjects page
 */
function goToSubjects(year) {
  AppState.set("year", year);
  setURL("subjects.html", { year });
}

/**
 * Step 2: Select Subject → go to chapters page
 */
function goToChapters(subject) {
  AppState.set("subject", subject);
  setURL("chapters.html", {
    year: AppState.year,
    subject
  });
}

/**
 * Step 3: Select Chapter → go to learn page
 */
function goToLearn(chapter) {
  AppState.set("chapter", chapter);
  setURL("learn.html", {
    year: AppState.year,
    subject: AppState.subject,
    chapter
  });
}

/**
 * Back navigation helper
 */
function goBack() {
  window.history.back();
}

/* ---------- INIT STATE ON PAGE LOAD ---------- */
function initAppState() {
  AppState.get("year");
  AppState.get("subject");
  AppState.get("chapter");
}

/* ---------- PAGE DETECTION ---------- */
function getCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("subjects")) return "subjects";
  if (path.includes("chapters")) return "chapters";
  if (path.includes("learn")) return "learn";
  return "index";
}

/* ---------- AUTO INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initAppState();

  console.log("SmartSpark Loaded 🚀");
  console.log("State:", AppState);
  console.log("Page:", getCurrentPage());
});