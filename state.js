// ═════════════════════════════════════════════════════════════════════════════
//  state.js - Application State Management
//  Manages navigation state between pages
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Get current application state
 * @returns {Object} Current state: { year, subject, chapter }
 */
function getState() {
  try {
    const state = sessionStorage.getItem('ss_state');
    return state ? JSON.parse(state) : { year: null, subject: null, chapter: null };
  } catch (e) {
    console.error('Error reading state:', e);
    return { year: null, subject: null, chapter: null };
  }
}

/**
 * Update application state (merge with existing)
 * @param {Object} patch - Partial state to merge
 * @returns {Object} Updated state
 */
function setState(patch) {
  const current = getState();
  const updated = { ...current, ...patch };
  try {
    sessionStorage.setItem('ss_state', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving state:', e);
    return updated;
  }
}

/**
 * Clear all state (logout or reset)
 */
function clearState() {
  try {
    sessionStorage.removeItem('ss_state');
  } catch (e) {
    console.error('Error clearing state:', e);
  }
}

/**
 * Get selected year
 */
function getSelectedYear() {
  return getState().year;
}

/**
 * Get selected subject
 */
function getSelectedSubject() {
  return getState().subject;
}

/**
 * Get selected chapter
 */
function getSelectedChapter() {
  return getState().chapter;
}

/**
 * Set year (for class selection)
 */
function setYear(year) {
  setState({ year, subject: null, chapter: null });
}

/**
 * Set subject (for subject selection)
 */
function setSubject(subject) {
  setState({ subject, chapter: null });
}

/**
 * Set chapter (for chapter selection)
 */
function setChapter(chapter) {
  setState({ chapter });
}

/**
 * Check if state is complete for learning
 */
function isReadyForLearning() {
  const state = getState();
  return !!(state.year && state.subject && state.chapter);
}
