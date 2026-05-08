// ═════════════════════════════════════════════════════════════════════════════
//  chapters.js - Chapter Management & Utilities
//  Chapter-specific logic and helpers
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Get all chapters for a year and subject
 * @param {number} year - Class (6, 7, 8)
 * @param {string} subject - Subject name
 * @param {boolean} onlyPublished - Only show published chapters
 * @returns {Array} Array of chapters
 */
function getChaptersForYearSubject(year, subject, onlyPublished = true) {
  const chapters = getStore('ss_chapters');
  return Object.values(chapters).filter(ch => {
    const matchYear = ch.class === year;
    const matchSubject = ch.subject === subject;
    const matchStatus = onlyPublished ? ch.status === 'published' : true;
    return matchYear && matchSubject && matchStatus;
  }).sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/**
 * Get chapter by ID
 * @param {string} chapterId - Chapter ID
 * @returns {Object} Chapter object
 */
function getChapterById(chapterId) {
  return getFromStore('ss_chapters', chapterId);
}

/**
 * Get chapter progress for student
 * @param {string} userId - User ID
 * @param {string} chapterId - Chapter ID
 * @returns {Object} Progress object with score, accuracy, etc.
 */
function getChapterProgress(userId, chapterId) {
  const progress = getUserProgress(userId);
  if (!progress) return null;
  return progress.chapters_progress[chapterId] || null;
}

/**
 * Get best score for chapter
 * @param {string} userId - User ID
 * @param {string} chapterId - Chapter ID
 * @returns {number} Best points earned
 */
function getChapterScore(userId, chapterId) {
  const progress = getChapterProgress(userId, chapterId);
  return progress ? (progress.points_earned || 0) : 0;
}

/**
 * Get chapter accuracy percentage
 * @param {string} userId - User ID
 * @param {string} chapterId - Chapter ID
 * @returns {number} Accuracy percentage
 */
function getChapterAccuracy(userId, chapterId) {
  const progress = getChapterProgress(userId, chapterId);
  return progress ? (progress.accuracy_pct || 0) : 0;
}

/**
 * Check if chapter is completed by student
 * @param {string} userId - User ID
 * @param {string} chapterId - Chapter ID
 * @returns {boolean} True if all questions answered correctly
 */
function isChapterCompleted(userId, chapterId) {
  const progress = getChapterProgress(userId, chapterId);
  return progress ? (progress.status === 'completed') : false;
}

/**
 * Get chapters by status
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @param {string} status - 'draft' | 'submitted' | 'published'
 * @returns {Array} Chapters matching status
 */
function getChaptersByStatus(year, subject, status) {
  const chapters = getStore('ss_chapters');
  return Object.values(chapters).filter(ch =>
    ch.class === year && ch.subject === subject && ch.status === status
  );
}

/**
 * Get chapter flashcards
 * @param {string} chapterId - Chapter ID
 * @returns {Array} Flashcard objects
 */
function getChapterFlashcards(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];
  
  return (chapter.flashcard_ids || [])
    .map(fcId => getFromStore('ss_flashcards', fcId))
    .filter(Boolean);
}

/**
 * Get chapter questions
 * @param {string} chapterId - Chapter ID
 * @returns {Array} Question objects
 */
function getChapterQuestions(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];
  
  return (chapter.question_ids || [])
    .map(qId => getFromStore('ss_question_bank', qId))
    .filter(Boolean);
}

/**
 * Get chapter version history
 * @param {string} chapterId - Chapter ID
 * @returns {Array} Version snapshots
 */
function getChapterVersions(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter || !chapter.versions) return [];
  return chapter.versions;
}

/**
 * Get chapter metadata
 * @param {string} chapterId - Chapter ID
 * @returns {Object} Metadata object
 */
function getChapterMetadata(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) return null;
  
  return {
    title: chapter.title,
    description: chapter.description,
    class: chapter.class,
    subject: chapter.subject,
    status: chapter.status,
    created_by: chapter.created_by,
    created_at: chapter.created_at,
    approved_by: chapter.approved_by,
    approved_at: chapter.approved_at,
    flashcards_count: (chapter.flashcard_ids || []).length,
    questions_count: (chapter.question_ids || []).length
  };
}

/**
 * Get completion percentage for student
 * @param {string} userId - User ID
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @returns {number} Percentage (0-100)
 */
function getSubjectCompletionPercentage(userId, year, subject) {
  const chapters = getChaptersForYearSubject(year, subject);
  if (chapters.length === 0) return 0;
  
  const completed = chapters.filter(ch => isChapterCompleted(userId, ch.chapter_id)).length;
  return Math.round((completed / chapters.length) * 100);
}

/**
 * Get average accuracy for subject
 * @param {string} userId - User ID
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @returns {number} Average accuracy percentage
 */
function getSubjectAverageAccuracy(userId, year, subject) {
  const chapters = getChaptersForYearSubject(year, subject);
  if (chapters.length === 0) return 0;
  
  const accuracies = chapters
    .map(ch => getChapterAccuracy(userId, ch.chapter_id))
    .filter(acc => acc > 0);
  
  if (accuracies.length === 0) return 0;
  return Math.round(accuracies.reduce((a, b) => a + b) / accuracies.length);
}

/**
 * Get total points for subject
 * @param {string} userId - User ID
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @returns {number} Total points earned
 */
function getSubjectTotalPoints(userId, year, subject) {
  const chapters = getChaptersForYearSubject(year, subject);
  return chapters.reduce((total, ch) => total + getChapterScore(userId, ch.chapter_id), 0);
}

/**
 * Get weak chapters (low accuracy)
 * @param {string} userId - User ID
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @param {number} threshold - Accuracy threshold (0-100)
 * @returns {Array} Chapters with accuracy below threshold
 */
function getWeakChapters(userId, year, subject, threshold = 60) {
  const chapters = getChaptersForYearSubject(year, subject);
  return chapters.filter(ch => {
    const accuracy = getChapterAccuracy(userId, ch.chapter_id);
    return accuracy > 0 && accuracy < threshold;
  });
}

/**
 * Get strong chapters (high accuracy)
 * @param {string} userId - User ID
 * @param {number} year - Class
 * @param {string} subject - Subject
 * @param {number} threshold - Accuracy threshold (0-100)
 * @returns {Array} Chapters with accuracy above threshold
 */
function getStrongChapters(userId, year, subject, threshold = 80) {
  const chapters = getChaptersForYearSubject(year, subject);
  return chapters.filter(ch => {
    const accuracy = getChapterAccuracy(userId, ch.chapter_id);
    return accuracy >= threshold;
  });
}
