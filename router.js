// ═════════════════════════════════════════════════════════════════════════════
//  router.js - Application Router & Navigation
//  Handles page navigation and state-based routing
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Navigate to year selection page
 */
function goHome() {
  clearState();
  window.location.href = 'index.html';
}

/**
 * Navigate to subjects page (requires year selected)
 */
function goToSubjects(year) {
  if (!year) {
    alert('Please select a year first');
    return;
  }
  setYear(year);
  window.location.href = 'subjects.html';
}

/**
 * Navigate to chapters page (requires year + subject)
 */
function goToChapters(subject) {
  const state = getState();
  if (!state.year) {
    alert('Please select a year first');
    window.location.href = 'index.html';
    return;
  }
  if (!subject) {
    alert('Please select a subject first');
    return;
  }
  setSubject(subject);
  window.location.href = 'chapters.html';
}

/**
 * Navigate to learning page (requires year + subject + chapter)
 */
function goToLearn(chapterId) {
  const state = getState();
  if (!state.year || !state.subject) {
    alert('Invalid state. Please start from home.');
    window.location.href = 'index.html';
    return;
  }
  if (!chapterId) {
    alert('Please select a chapter first');
    return;
  }
  setChapter(chapterId);
  window.location.href = 'learn.html';
}

/**
 * Navigate to progress page
 */
function goToProgress() {
  window.location.href = 'progress.html';
}

/**
 * Navigate to CMS login
 */
function goToCMS() {
  window.location.href = 'cms-login.html';
}

/**
 * Navigate to CMS dashboard
 */
function goToCMSDashboard() {
  window.location.href = 'cms-dashboard.html';
}

/**
 * Validate state before loading page
 * @param {string} requiredLevel - 'year' | 'subject' | 'chapter'
 * @returns {boolean} True if state is valid
 */
function validateState(requiredLevel) {
  const state = getState();
  
  switch (requiredLevel) {
    case 'year':
      return !!state.year;
    case 'subject':
      return !!(state.year && state.subject);
    case 'chapter':
      return !!(state.year && state.subject && state.chapter);
    default:
      return false;
  }
}

/**
 * Redirect to home if state invalid
 * @param {string} requiredLevel - 'year' | 'subject' | 'chapter'
 */
function ensureState(requiredLevel) {
  if (!validateState(requiredLevel)) {
    console.warn(`Invalid state for level: ${requiredLevel}. Redirecting to home.`);
    window.location.href = 'index.html';
  }
}

/**
 * Go back to previous page (smart back)
 */
function goBack() {
  const state = getState();
  
  if (state.chapter) {
    // From learn → chapters
    goToChapters(state.subject);
  } else if (state.subject) {
    // From chapters → subjects
    goToSubjects(state.year);
  } else if (state.year) {
    // From subjects → home
    goHome();
  } else {
    // Already home
    window.history.back();
  }
}

/**
 * Handle logout
 */
function logout() {
  logoutUser();
  clearState();
  window.location.href = 'index.html';
}

/**
 * Check if on CMS or student app
 * @returns {string} 'cms' | 'student'
 */
function getCurrentApp() {
  const path = window.location.pathname;
  return path.includes('cms-') ? 'cms' : 'student';
}
