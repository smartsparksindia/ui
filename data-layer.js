// ═════════════════════════════════════════════════════════════════════════════
//  SmartSpark Data Layer - Content Management + Analytics
//  - Versioned content system
//  - Question bank (reusable)
//  - User progress tracking
//  - Analytics events
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────
const STORE = {
  CHAPTERS: 'ss_chapters',
  QUESTION_BANK: 'ss_question_bank',
  FLASHCARDS: 'ss_flashcards',
  USER_PROGRESS: 'ss_user_progress',
  ANALYTICS_EVENTS: 'ss_analytics_events',
  USERS: 'ss_users',
  CMS_DRAFTS: 'ss_cms_drafts',
  CONFIG: 'ss_config'
};

// Toggle demo data creation in dev setups. Set to `true` to auto-create demo accounts/content.
// WARNING: demo content writes to localStorage and is intended for local development only.
const ENABLE_DEMO_ACCOUNTS = false;
const ENABLE_DEMO_CONTENT = false;
// Enable syncing published content to a central server (set true and run the server)
const ENABLE_REMOTE_SYNC = false;
const REMOTE_API_BASE = 'http://localhost:4000/api';

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  // Try to propagate to remote store (non-blocking)
  if (ENABLE_REMOTE_SYNC) {
    try {
      remotePutStore(key, data).catch(e => console.warn('Remote sync failed:', e));
    } catch (e) {
      console.warn('Remote sync initiation failed:', e);
    }
  }
}

function addToStore(key, id, item) {
  const store = getStore(key);
  store[id] = item;
  setStore(key, store);
  return item;
}

// Remote helpers (best-effort, non-blocking)
async function remotePutStore(key, data) {
  try {
    const url = `${REMOTE_API_BASE}/${key}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    throw e;
  }
}

async function remoteGetStore(key) {
  try {
    const url = `${REMOTE_API_BASE}/${key}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Remote fetch failed');
    return await res.json();
  } catch (e) {
    throw e;
  }
}

function getFromStore(key, id) {
  return getStore(key)[id];
}

function deleteFromStore(key, id) {
  const store = getStore(key);
  delete store[id];
  setStore(key, store);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER MANAGEMENT (Versioned)
// ─────────────────────────────────────────────────────────────────────────────

function createChapter(class_no, subject, subject_area, title, description, chapter_num = null, unit_num = null, unit_name = null) {
  const chapter_id = `ch_${class_no}_${subject.toLowerCase()}_${Date.now()}`;
  const chapter = {
    chapter_id,
    class: class_no,
    subject,
    subject_area,
    chapter: chapter_num,
    unit: unit_num,
    unit_name,
    title,
    description,
    learning_objectives: [],
    estimated_time_minutes: 45,
    current_version: 0,
    versions: [],
    status: 'draft', // draft, submitted, approved, published
    created_by: getCurrentUserId(),
    created_at: new Date().toISOString(),
    submitted_at: null,
    approved_at: null,
    approved_by: null
  };
  return addToStore(STORE.CHAPTERS, chapter_id, chapter);
}

function deleteChapter(chapter_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter) return false;
  
  // Delete all flashcards linked to this chapter
  if (chapter.flashcard_ids && chapter.flashcard_ids.length > 0) {
    chapter.flashcard_ids.forEach(flashcard_id => {
      deleteFromStore(STORE.FLASHCARDS, flashcard_id);
    });
  }
  
  // Delete all questions linked to this chapter
  if (chapter.question_ids && chapter.question_ids.length > 0) {
    chapter.question_ids.forEach(question_id => {
      deleteFromStore(STORE.QUESTION_BANK, question_id);
    });
  }
  
  // Delete the chapter itself
  deleteFromStore(STORE.CHAPTERS, chapter_id);
  
  return true;
}

function addFlashcardToChapter(chapter_id, term, definition, chapter_num = null, unit_num = null, image_url = null, subject_area = null, unit_name = null) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter) return null;
  
  const flashcard_id = `fc_${chapter_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const flashcard = {
    flashcard_id,
    chapter_id,
    class: chapter.class,
    subject: chapter.subject,
    subject_area: subject_area || chapter.subject_area,
    chapter: chapter_num,
    unit: unit_num,
    unit_name: unit_name,
    version: 0, // Will be set when published
    term,
    definition,
    image_url,
    created_by: getCurrentUserId(),
    created_at: new Date().toISOString()
  };
  
  if (!chapter.flashcard_ids) chapter.flashcard_ids = [];
  chapter.flashcard_ids.push(flashcard_id);
  
  addToStore(STORE.CHAPTERS, chapter_id, chapter);
  return addToStore(STORE.FLASHCARDS, flashcard_id, flashcard);
}

function publishChapter(chapter_id, approver_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter || chapter.status !== 'submitted') return null;
  
  // Create immutable published version
  const new_version = (chapter.current_version || 0) + 1;
  const published_snapshot = {
    version: new_version,
    status: 'published',
    published_at: new Date().toISOString(),
    created_by: chapter.created_by,
    approved_by: approver_id,
    flashcard_ids: [...(chapter.flashcard_ids || [])],
    question_ids: [...(chapter.question_ids || [])],
    content_hash: generateHash(chapter)
  };
  
  if (!chapter.versions) chapter.versions = [];
  chapter.versions.push(published_snapshot);
  chapter.current_version = new_version;
  chapter.status = 'published';
  chapter.approved_at = new Date().toISOString();
  chapter.approved_by = approver_id;
  
  return addToStore(STORE.CHAPTERS, chapter_id, chapter);
}

function getPublishedChapter(chapter_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter || chapter.status !== 'published') return null;
  
  // Return only published version's data
  return {
    ...chapter,
    version: chapter.current_version
  };
}

function getAllChapters(class_no, subject, onlyPublished = true) {
  const chapters = getStore(STORE.CHAPTERS);
  return Object.values(chapters).filter(ch => {
    const matchClass = class_no ? ch.class === class_no : true;
    const matchSubject = subject ? ch.subject === subject : true;
    const matchStatus = onlyPublished ? ch.status === 'published' : true;
    return matchClass && matchSubject && matchStatus;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK (Reusable Questions)
// ─────────────────────────────────────────────────────────────────────────────

function createQuestion(class_no, subject, subject_area, topic, question_text, options, correct_option_index, explanation, chapter_num = null, unit_num = null, unit_name = null) {
  const question_id = `q_${subject.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const question = {
    question_id,
    class: class_no,
    subject,
    subject_area,
    topic,
    chapter: chapter_num,
    unit: unit_num,
    unit_name: unit_name,
    difficulty: 'medium', // easy, medium, hard
    question_text,
    options, // Array of 4 strings
    correct_option_index,
    explanation,
    image_url: null,
    tags: [],
    status: 'published',
    version: 1,
    created_by: getCurrentUserId(),
    created_at: new Date().toISOString(),
    used_in_chapters: [], // Array of {chapter_id, version}
    analytics: {
      total_attempts: 0,
      correct_count: 0,
      accuracy_pct: 0
    }
  };
  return addToStore(STORE.QUESTION_BANK, question_id, question);
}

function linkQuestionToChapter(question_id, chapter_id) {
  const question = getFromStore(STORE.QUESTION_BANK, question_id);
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  
  if (!question || !chapter) return null;
  
  if (!chapter.question_ids) chapter.question_ids = [];
  chapter.question_ids.push(question_id);
  
  question.used_in_chapters.push({
    chapter_id,
    version: chapter.current_version + 1 // Will be this version when published
  });
  
  addToStore(STORE.QUESTION_BANK, question_id, question);
  return addToStore(STORE.CHAPTERS, chapter_id, chapter);
}

function getQuestionsForChapter(chapter_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter) return [];
  
  return (chapter.question_ids || []).map(qid => getFromStore(STORE.QUESTION_BANK, qid)).filter(Boolean);
}

function updateQuestionAnalytics(question_id, was_correct) {
  const question = getFromStore(STORE.QUESTION_BANK, question_id);
  if (!question) return null;
  
  question.analytics.total_attempts += 1;
  if (was_correct) question.analytics.correct_count += 1;
  question.analytics.accuracy_pct = Math.round(
    (question.analytics.correct_count / question.analytics.total_attempts) * 100
  );
  
  return addToStore(STORE.QUESTION_BANK, question_id, question);
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROGRESS TRACKING
// ─────────────────────────────────────────────────────────────────────────────

function initUserProgress(user_id, user_name, class_no) {
  const progress = {
    user_id,
    user_name,
    class: class_no,
    created_at: new Date().toISOString(),
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    chapters_progress: {}, // {chapter_id: {status, score, etc}}
    question_attempts: {} // {question_id: {attempts, correct_count, etc}}
  };
  return addToStore(STORE.USER_PROGRESS, user_id, progress);
}

function recordFlashcardView(user_id, chapter_id) {
  const progress = getFromStore(STORE.USER_PROGRESS, user_id);
  if (!progress) return null;
  
  if (!progress.chapters_progress[chapter_id]) {
    progress.chapters_progress[chapter_id] = {
      status: 'in_progress',
      flashcards_viewed: 0,
      quiz_attempts: 0,
      best_score: 0,
      accuracy_pct: 0,
      points_earned: 0,
      revision_before_quiz: false
    };
  }
  
  progress.chapters_progress[chapter_id].flashcards_viewed += 1;
  progress.total_points += 5; // 5 pts per flashcard
  updateStreak(user_id);
  
  return addToStore(STORE.USER_PROGRESS, user_id, progress);
}

function recordQuizAttempt(user_id, chapter_id, question_id, was_correct, revision_used) {
  const progress = getFromStore(STORE.USER_PROGRESS, user_id);
  if (!progress) return null;
  
  // Update chapter progress
  if (!progress.chapters_progress[chapter_id]) {
    progress.chapters_progress[chapter_id] = {
      status: 'in_progress',
      flashcards_viewed: 0,
      quiz_attempts: 0,
      best_score: 0,
      accuracy_pct: 0,
      points_earned: 0,
      revision_before_quiz: false
    };
  }
  
  const ch_prog = progress.chapters_progress[chapter_id];
  ch_prog.quiz_attempts += 1;
  ch_prog.revision_before_quiz = revision_used;
  
  if (was_correct) {
    const pts = revision_used ? 40 : 50; // 50 pts without revision, 40 with
    ch_prog.points_earned += pts;
    progress.total_points += pts;
  }
  
  // Update question attempts
  if (!progress.question_attempts[question_id]) {
    progress.question_attempts[question_id] = {
      attempts: 0,
      correct_count: 0,
      incorrect_count: 0
    };
  }
  
  const q_att = progress.question_attempts[question_id];
  q_att.attempts += 1;
  if (was_correct) {
    q_att.correct_count += 1;
  } else {
    q_att.incorrect_count += 1;
  }
  
  updateStreak(user_id);
  recordAnalyticsEvent(user_id, 'question_answered', {
    chapter_id,
    question_id,
    was_correct,
    revision_used,
    points_awarded: was_correct ? (revision_used ? 40 : 50) : 0
  });
  
  return addToStore(STORE.USER_PROGRESS, user_id, progress);
}

function markChapterComplete(user_id, chapter_id) {
  const progress = getFromStore(STORE.USER_PROGRESS, user_id);
  if (!progress) return null;
  
  if (progress.chapters_progress[chapter_id]) {
    progress.chapters_progress[chapter_id].status = 'completed';
    progress.total_points += 100; // Bonus for completing chapter
  }
  
  return addToStore(STORE.USER_PROGRESS, user_id, progress);
}

function updateStreak(user_id) {
  const progress = getFromStore(STORE.USER_PROGRESS, user_id);
  if (!progress) return;
  
  const today = new Date().toDateString();
  const lastActivityDate = progress.last_activity_date || '';
  
  if (lastActivityDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastActivityDate === yesterday) {
      progress.current_streak += 1;
      progress.longest_streak = Math.max(progress.current_streak, progress.longest_streak);
    } else if (lastActivityDate !== today) {
      progress.current_streak = 1;
    }
    
    progress.last_activity_date = today;
  }
  
  addToStore(STORE.USER_PROGRESS, user_id, progress);
}

function getUserProgress(user_id) {
  return getFromStore(STORE.USER_PROGRESS, user_id);
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS EVENTS
// ─────────────────────────────────────────────────────────────────────────────

function recordAnalyticsEvent(user_id, event_type, data = {}) {
  const event = {
    event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id,
    event_type,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    data
  };
  
  const events = getStore(STORE.ANALYTICS_EVENTS);
  events[event.event_id] = event;
  setStore(STORE.ANALYTICS_EVENTS, events);
  
  return event;
}

function getAnalyticsEvents(filters = {}) {
  const events = getStore(STORE.ANALYTICS_EVENTS);
  return Object.values(events).filter(evt => {
    if (filters.user_id && evt.user_id !== filters.user_id) return false;
    if (filters.event_type && evt.event_type !== filters.event_type) return false;
    if (filters.since && new Date(evt.timestamp) < new Date(filters.since)) return false;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS: DRAFT & SUBMISSION WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

function submitChapterForReview(chapter_id, contributor_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter) return null;
  
  chapter.status = 'submitted';
  chapter.submitted_at = new Date().toISOString();
  
  recordAnalyticsEvent(contributor_id, 'chapter_submitted', {
    chapter_id,
    title: chapter.title
  });
  
  return addToStore(STORE.CHAPTERS, chapter_id, chapter);
}

function rejectChapter(chapter_id, admin_id, feedback) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter) return null;
  
  chapter.status = 'draft';
  chapter.rejection_feedback = feedback;
  chapter.rejection_date = new Date().toISOString();
  chapter.rejected_by = admin_id;
  
  recordAnalyticsEvent(admin_id, 'chapter_rejected', {
    chapter_id,
    feedback
  });
  
  return addToStore(STORE.CHAPTERS, chapter_id, chapter);
}

function getPendingApprovals() {
  const chapters = getStore(STORE.CHAPTERS);
  return Object.values(chapters).filter(ch => ch.status === 'submitted');
}

function getChapterHistory(chapter_id) {
  const chapter = getFromStore(STORE.CHAPTERS, chapter_id);
  if (!chapter || !chapter.versions) return [];
  
  return chapter.versions.map(v => ({
    version: v.version,
    status: v.status,
    published_at: v.published_at,
    created_by: v.created_by,
    approved_by: v.approved_by
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT & BACKUP
// ─────────────────────────────────────────────────────────────────────────────

function exportAllContent() {
  const backup = {
    exported_at: new Date().toISOString(),
    version: '1.0',
    chapters: getStore(STORE.CHAPTERS),
    question_bank: getStore(STORE.QUESTION_BANK),
    flashcards: getStore(STORE.FLASHCARDS),
    config: getStore(STORE.CONFIG)
  };
  return backup;
}

function downloadBackup() {
  const backup = exportAllContent();
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartspark_backup_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importBackup(jsonData) {
  try {
    const backup = JSON.parse(jsonData);
    setStore(STORE.CHAPTERS, backup.chapters);
    setStore(STORE.QUESTION_BANK, backup.question_bank);
    setStore(STORE.FLASHCARDS, backup.flashcards);
    return { success: true, message: 'Backup imported successfully' };
  } catch (e) {
    return { success: false, message: 'Invalid backup format: ' + e.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// USER AUTHENTICATION (Basic - Phase 1)
// ─────────────────────────────────────────────────────────────────────────────

function registerUser(username, email, password, role = 'student', class_no = null) {
  const user = {
    user_id: `user_${Date.now()}`,
    username,
    email,
    password_hash: btoa(password), // NOT secure - Phase 2 use proper auth
    role, // student, contributor, admin
    class: class_no,
    created_at: new Date().toISOString(),
    is_active: true
  };
  
  const users = getStore(STORE.USERS);
  users[user.user_id] = user;
  setStore(STORE.USERS, users);
  
  if (role === 'student') {
    initUserProgress(user.user_id, username, class_no);
  }
  
  return user;
}

function loginUser(email, password) {
  const users = getStore(STORE.USERS);
  const user = Object.values(users).find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  // Check password (demo accounts use plaintext, others use btoa hash)
  const passwordMatch = user.password === password || btoa(password) === user.password_hash;
  
  if (!passwordMatch) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  sessionStorage.setItem('ss_current_user', JSON.stringify(user));
  console.log('✅ Login successful:', email);
  return { success: true, user };
}

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem('ss_current_user'));
  } catch {
    return null;
  }
}

function getCurrentUserId() {
  const user = getCurrentUser();
  return user?.user_id || 'anonymous';
}

function getUserRole() {
  const user = getCurrentUser();
  return user?.role || 'student';
}

function logoutUser() {
  sessionStorage.removeItem('ss_current_user');
}

function isAdmin() {
  return getUserRole() === 'admin';
}

function isContributor() {
  return ['admin', 'contributor'].includes(getUserRole());
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function generateHash(obj) {
  return btoa(JSON.stringify(obj)).slice(0, 16);
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('ss_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ss_session_id', sessionId);
  }
  return sessionId;
}

function initializeSystem() {
  // Set default config
  const config = getStore(STORE.CONFIG);
  if (!config.initialized) {
    config.initialized = true;
    config.version = '1.0';
    config.created_at = new Date().toISOString();
    setStore(STORE.CONFIG, config);
  }
}

// Initialize system and create demo accounts
// ─────────────────────────────────────────────────────────────────────────────
// DEMO ACCOUNTS INITIALIZATION (COMMENTED OUT - Phase 2 clean migration)
// ─────────────────────────────────────────────────────────────────────────────

function initializeSystemWithDemoAccounts() {
  // Set default config
  const config = getStore(STORE.CONFIG);
  if (!config.initialized) {
    config.initialized = true;
    config.version = '1.0';
    config.created_at = new Date().toISOString();
    setStore(STORE.CONFIG, config);
  }
  
  // Hardcode demo accounts
  const users = getStore(STORE.USERS);
  
  // Only create if they don't exist
  if (Object.keys(users).length === 0) {
    console.log('Creating hardcoded demo accounts...');
    
    // Admin user
    const admin = {
      user_id: 'admin_demo_001',
      username: 'Admin',
      email: 'admin@smartspark.in',
      password: 'admin123',  // Stored plaintext for MVP demo
      role: 'admin',
      class: null,
      created_at: new Date().toISOString(),
      is_active: true
    };
    users[admin.user_id] = admin;
    
    // Contributor user
    const contributor = {
      user_id: 'contributor_demo_001',
      username: 'Contributor',
      email: 'contributor@smartspark.in',
      password: 'contrib123',  // Stored plaintext for MVP demo
      role: 'contributor',
      class: null,
      created_at: new Date().toISOString(),
      is_active: true
    };
    users[contributor.user_id] = contributor;
    
    // Student user
    const student = {
      user_id: 'student_demo_001',
      username: 'Student',
      email: 'student@smartspark.in',
      password: 'student123',  // Stored plaintext for MVP demo
      role: 'student',
      class: 6,
      created_at: new Date().toISOString(),
      is_active: true
    };
    users[student.user_id] = student;
    
    // Save all users
    setStore(STORE.USERS, users);
    console.log('✅ Demo accounts created!');
    console.log('Admin: admin@smartspark.in / admin123');
    console.log('Contributor: contributor@smartspark.in / contrib123');
    console.log('Student: student@smartspark.in / student123');
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// DEMO CONTENT INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

// function initializeSystemWithDemoContent() {
//   const config = getStore(STORE.CONFIG);
  
//   // Only create demo content once
//   if (config.demo_content_created) {
//     return;
//   }
  
//   console.log('Creating demo chapters, questions, and flashcards...');
  
//   const demoChapters = [
//     { class: 6, subject: 'Maths', subject_area: 'Arithmetic', title: 'Chapter 1: Numbers and Operations', desc: 'Learn about numbers, place value, and basic arithmetic operations' },
//     { class: 6, subject: 'Maths', subject_area: 'Arithmetic', title: 'Chapter 2: Fractions and Decimals', desc: 'Understand fractions, decimals, and their applications' },
//     { class: 6, subject: 'Science', subject_area: 'Biology', title: 'Chapter 1: Living World', desc: 'Explore living organisms and their characteristics' },
//     { class: 6, subject: 'Science', subject_area: 'Biology', title: 'Chapter 2: Human Body', desc: 'Learn about human anatomy and body systems' },
//     { class: 6, subject: 'English', subject_area: 'Literature', title: 'Chapter 1: Reading Comprehension', desc: 'Improve reading skills and comprehension' },
//     { class: 6, subject: 'Social Science', subject_area: 'Geography', title: 'Chapter 1: The Earth', desc: 'Learn about our planet and its geography' },
//     { class: 7, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 1: Integers', desc: 'Understand positive and negative integers' },
//     { class: 7, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 2: Fractions', desc: 'Master fractions and rational numbers' },
//     { class: 7, subject: 'Science', subject_area: 'Physics', title: 'Chapter 1: Motion and Forces', desc: 'Learn about motion, speed, and forces' },
//     { class: 7, subject: 'Science', subject_area: 'Physics', title: 'Chapter 2: Heat and Energy', desc: 'Understand temperature, heat transfer, and energy' },
//     { class: 7, subject: 'English', subject_area: 'Literature', title: 'Chapter 1: Poetry Appreciation', desc: 'Explore poems and literary devices' },
//     { class: 7, subject: 'Social Science', subject_area: 'History', title: 'Chapter 1: Ancient India', desc: 'Learn about early Indian civilizations' },
//     { class: 8, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 1: Rational Numbers', desc: 'Understand rational numbers and operations' },
//     { class: 8, subject: 'Maths', subject_area: 'Geometry', title: 'Chapter 2: Squares and Square Roots', desc: 'Master squares, cubes, and roots' },
//     { class: 8, subject: 'Science', subject_area: 'Chemistry', title: 'Chapter 1: Matter in Our Surroundings', desc: 'Learn about states of matter and properties' },
//     { class: 8, subject: 'Science', subject_area: 'Biology', title: 'Chapter 2: Cell Structure and Function', desc: 'Understand cells and living organisms' },
//     { class: 8, subject: 'English', subject_area: 'Literature', title: 'Chapter 1: Prose and Drama', desc: 'Study prose pieces and dramatic works' },
//     { class: 8, subject: 'Social Science', subject_area: 'History', title: 'Chapter 1: Medieval India', desc: 'Explore medieval Indian history' },
//     { class: 9, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 1: Number Systems', desc: 'Deep dive into number systems and real numbers' },
//     { class: 9, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 2: Polynomials', desc: 'Master polynomial expressions and factorization' },
//     { class: 9, subject: 'Science', subject_area: 'Chemistry', title: 'Chapter 1: Matter in Our Surroundings', desc: 'Advanced concepts of matter and properties' },
//     { class: 9, subject: 'Science', subject_area: 'Chemistry', title: 'Chapter 2: Atoms and Molecules', desc: 'Understand atomic structure and bonding' },
//     { class: 9, subject: 'English', subject_area: 'Literature', title: 'Chapter 1: Fiction and Literature', desc: 'Analyze literary texts and narrative techniques' },
//     { class: 9, subject: 'Social Science', subject_area: 'History', title: 'Chapter 1: India and the World', desc: 'Explore India in global context' },
//     { class: 10, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 1: Real Numbers', desc: 'Master real number systems and properties' },
//     { class: 10, subject: 'Maths', subject_area: 'Algebra', title: 'Chapter 2: Polynomials and Division', desc: 'Advanced polynomial operations and theorems' },
//     { class: 10, subject: 'Science', subject_area: 'Chemistry', title: 'Chapter 1: Chemical Reactions', desc: 'Understand chemical reactions and equations' },
//     { class: 10, subject: 'Science', subject_area: 'Chemistry', title: 'Chapter 2: Periodic Table', desc: 'Master periodic table and element properties' },
//     { class: 10, subject: 'English', subject_area: 'Literature', title: 'Chapter 1: Board Exam Preparation', desc: 'Prepare for board exams with comprehensive content' },
//     { class: 10, subject: 'Social Science', subject_area: 'History', title: 'Chapter 1: Modern India', desc: 'Study modern Indian history and governance' }
//   ];
  
//   const chapters = getStore(STORE.CHAPTERS);
//   const questionBank = getStore(STORE.QUESTION_BANK);
//   const flashcards = getStore(STORE.FLASHCARDS);
  
//   demoChapters.forEach((demoChap, idx) => {
//     const chapter_id = `ch_${demoChap.class}_${demoChap.subject.toLowerCase()}_${idx}`;
    
//     // Create chapter in draft status first
//     const chapter = {
//       chapter_id,
//       class: demoChap.class,
//       subject: demoChap.subject,
//       subject_area: demoChap.subject_area,
//       title: demoChap.title,
//       description: demoChap.desc,
//       learning_objectives: [],
//       estimated_time_minutes: 45,
//       current_version: 0,
//       versions: [],
//       status: 'draft',
//       created_by: 'admin_demo_001',
//       created_at: new Date().toISOString(),
//       submitted_at: null,
//       approved_at: null,
//       approved_by: null,
//       question_ids: [],
//       flashcard_ids: []
//     };
    
//     chapters[chapter_id] = chapter;
    
//     // Create 5 sample questions for this chapter
//     for (let q = 0; q < 5; q++) {
//       const question_id = `q_${chapter_id}_${q}`;
//       const question = {
//         question_id,
//         class: demoChap.class,
//         subject: demoChap.subject,
//         subject_area: demoChap.subject_area,
//         topic: demoChap.title,
//         chapter: (idx % 10) + 1,
//         unit: (idx % 5) + 1,
//         difficulty: ['easy', 'medium', 'hard'][q % 3],
//         question_text: `Sample Question ${q + 1} for ${demoChap.title}`,
//         options: ['Option A', 'Option B', 'Option C', 'Option D'],
//         correct_option_index: q % 4,
//         explanation: `This is the correct answer because...`,
//         image_url: null,
//         tags: [],
//         status: 'published',
//         version: 1,
//         created_by: 'admin_demo_001',
//         created_at: new Date().toISOString(),
//         used_in_chapters: [{ chapter_id, version: 1 }],
//         analytics: {
//           total_attempts: 0,
//           correct_count: 0,
//           accuracy_pct: 0
//         }
//       };
      
//       questionBank[question_id] = question;
//       chapter.question_ids.push(question_id);
//     }
    
//     // Create 3 sample flashcards for this chapter
//     for (let f = 0; f < 3; f++) {
//       const flashcard_id = `fc_${chapter_id}_${f}`;
//       const flashcard = {
//         flashcard_id,
//         chapter_id,
//         class: demoChap.class,
//         subject: demoChap.subject,
//         subject_area: demoChap.subject_area,
//         chapter: (idx % 10) + 1,
//         unit: (idx % 5) + 1,
//         version: 1,
//         term: `Term ${f + 1}`,
//         definition: `Definition for term ${f + 1}`,
//         image_url: null,
//         created_by: 'admin_demo_001',
//         created_at: new Date().toISOString()
//       };
      
//       flashcards[flashcard_id] = flashcard;
//       chapter.flashcard_ids.push(flashcard_id);
//     }
    
//     // Publish the chapter
//     chapter.status = 'published';
//     chapter.current_version = 1;
//     chapter.approved_at = new Date().toISOString();
//     chapter.approved_by = 'admin_demo_001';
//     chapter.versions.push({
//       version: 1,
//       status: 'published',
//       published_at: new Date().toISOString(),
//       created_by: 'admin_demo_001',
//       approved_by: 'admin_demo_001',
//       flashcard_ids: [...chapter.flashcard_ids],
//       question_ids: [...chapter.question_ids],
//       content_hash: generateHash(chapter)
//     });
//   });
  
//   // Save all data
//   setStore(STORE.CHAPTERS, chapters);
//   setStore(STORE.QUESTION_BANK, questionBank);
//   setStore(STORE.FLASHCARDS, flashcards);
  
//   // Mark config as initialized
//   config.demo_content_created = true;
//   setStore(STORE.CONFIG, config);
  
//   console.log('✅ Demo content created:', demoChapters.length, 'chapters');
// }

// // Initialize on load (only when explicitly enabled via toggles above)
// if (typeof ENABLE_DEMO_ACCOUNTS !== 'undefined' && ENABLE_DEMO_ACCOUNTS) {
//   initializeSystemWithDemoAccounts();
// }
// if (typeof ENABLE_DEMO_CONTENT !== 'undefined' && ENABLE_DEMO_CONTENT) {
//   initializeSystemWithDemoContent();
// }
// ═════════════════════════════════════════════════════════════════════════════
// PHASE 2 - EXPORT FUNCTIONS (NEW - NO CHANGES TO EXISTING CODE ABOVE)
// ═════════════════════════════════════════════════════════════════════════════

function exportSubjectAsJSON(year, subject, subject_area) {
  const chapters = getStore(STORE.CHAPTERS);
  const flashcards = getStore(STORE.FLASHCARDS);
  const questions = getStore(STORE.QUESTION_BANK);
  
  // Filter published chapters for this year/subject/subject_area
  const relevantChapters = Object.values(chapters).filter(ch => 
    ch.class === year && 
    ch.subject === subject && 
    ch.subject_area === subject_area && 
    ch.status === 'published'
  );
  
  if (relevantChapters.length === 0) {
    console.warn(`No published chapters found for year ${year}, ${subject}, ${subject_area}`);
    return null;
  }
  
  // Build nested structure
  const nestedChapters = [];
  
  relevantChapters.forEach(ch => {
    // Get flashcards for this chapter
    const chapterFlashcards = Object.values(flashcards).filter(fc => 
      fc.chapter_id === ch.chapter_id && fc.status !== 'draft'
    );
    
    // Get questions for this chapter
    const chapterQuestions = Object.values(questions).filter(q => 
      q.used_in_chapters && q.used_in_chapters.some(uc => uc.chapter_id === ch.chapter_id)
    );
    
    // Group flashcards and questions by unit
    const unitMap = {};
    
    chapterFlashcards.forEach(fc => {
      const unitKey = fc.unit || 1;
      if (!unitMap[unitKey]) {
        unitMap[unitKey] = { 
          unit_num: unitKey, 
          unit_name: fc.unit_name || `Unit ${unitKey}`,
          flashcards: [], 
          questions: [] 
        };
      }
      unitMap[unitKey].flashcards.push({
        flashcard_id: fc.flashcard_id,
        term: fc.term,
        definition: fc.definition,
        image_url: fc.image_url
      });
    });
    
    chapterQuestions.forEach(q => {
      const unitKey = q.unit || 1;
      if (!unitMap[unitKey]) {
        unitMap[unitKey] = { 
          unit_num: unitKey, 
          unit_name: q.unit_name || `Unit ${unitKey}`,
          flashcards: [], 
          questions: [] 
        };
      }
      unitMap[unitKey].questions.push({
        question_id: q.question_id,
        question_text: q.question_text,
        options: q.options,
        correct_option_index: q.correct_option_index,
        explanation: q.explanation,
        difficulty: q.difficulty
      });
    });
    
    nestedChapters.push({
      chapter_num: ch.chapter,
      chapter_name: ch.title,
      units: Object.values(unitMap)
    });
  });
  
  // Build final export object
  const exportData = {
    year,
    subject,
    subject_area,
    last_updated: new Date().toISOString(),
    chapters: nestedChapters
  };
  
  return exportData;
}

function getNextVersion(subject_area) {
  const key = `${subject_area.toLowerCase().replace(/\s+/g, '-')}`;
  const existingVersionKey = `exported_version_${key}`;
  const currentVersion = parseInt(localStorage.getItem(existingVersionKey) || '0');
  return currentVersion + 1;
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadCSV(data, filename) {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function generateFlashcardsCSV(year, subject, subject_area) {
  const chapters = getStore(STORE.CHAPTERS);
  const flashcards = getStore(STORE.FLASHCARDS);
  
  const relevantChapters = Object.values(chapters).filter(ch => 
    ch.class === year && 
    ch.subject === subject && 
    ch.subject_area === subject_area && 
    ch.status === 'published'
  );
  
  const relevantFlashcards = Object.values(flashcards).filter(fc => 
    relevantChapters.some(rc => rc.chapter_id === fc.chapter_id)
  );
  
  if (relevantFlashcards.length === 0) return '';
  
  let csv = 'term,definition\n';
  relevantFlashcards.forEach(fc => {
    const term = `"${fc.term.replace(/"/g, '""')}"`;
    const definition = `"${fc.definition.replace(/"/g, '""')}"`;
    csv += `${term},${definition}\n`;
  });
  
  return csv;
}

function generateQuestionsCSV(year, subject, subject_area) {
  const chapters = getStore(STORE.CHAPTERS);
  const questions = getStore(STORE.QUESTION_BANK);
  
  const relevantChapters = Object.values(chapters).filter(ch => 
    ch.class === year && 
    ch.subject === subject && 
    ch.subject_area === subject_area && 
    ch.status === 'published'
  );
  
  const relevantQuestions = Object.values(questions).filter(q => 
    relevantChapters.some(rc => rc.question_ids && rc.question_ids.includes(q.question_id))
  );
  
  if (relevantQuestions.length === 0) return '';
  
  let csv = 'question,option1,option2,option3,option4,correct,explanation\n';
  relevantQuestions.forEach(q => {
    const question = `"${q.question_text.replace(/"/g, '""')}"`;
    const option1 = `"${q.options[0].replace(/"/g, '""')}"`;
    const option2 = `"${q.options[1].replace(/"/g, '""')}"`;
    const option3 = `"${q.options[2].replace(/"/g, '""')}"`;
    const option4 = `"${q.options[3].replace(/"/g, '""')}"`;
    const correct = q.correct_option_index;
    const explanation = `"${q.explanation.replace(/"/g, '""')}"`;
    csv += `${question},${option1},${option2},${option3},${option4},${correct},${explanation}\n`;
  });
  
  return csv;
}

function performPhase2Export(year, subject, subject_area) {
  const jsonData = exportSubjectAsJSON(year, subject, subject_area);
  if (!jsonData) {
    alert('❌ No published chapters found for this selection');
    return;
  }
  
  const version = getNextVersion(subject_area);
  const safeSubject = subject.toLowerCase().replace(/\s+/g, '-');
  const safeSubjectArea = subject_area.toLowerCase().replace(/\s+/g, '-');
  
  // MAIN FILE: Just the subject_area name (e.g., history.json)
  downloadJSON(jsonData, `${safeSubjectArea}.json`);
  
  // VERSION BACKUP: Includes version (e.g., history-v1.json)
  downloadJSON(jsonData, `${safeSubjectArea}-v${version}.json`);
  
  // CSV BACKUPS: Include subject_area in filename (e.g., history-flashcards.csv)
  const flashcardsCSV = generateFlashcardsCSV(year, subject, subject_area);
  if (flashcardsCSV) {
    downloadCSV(flashcardsCSV, `${safeSubjectArea}-flashcards.csv`);
  }
  
  const questionsCSV = generateQuestionsCSV(year, subject, subject_area);
  if (questionsCSV) {
    downloadCSV(questionsCSV, `${safeSubjectArea}-questions.csv`);
  }
  
  const key = `exported_version_${safeSubjectArea}`;
  localStorage.setItem(key, version.toString());
  
  alert(`✅ Exported successfully!\nVersion: ${version}\n\nFiles downloaded:\n- ${safeSubjectArea}.json (main)\n- ${safeSubjectArea}-v${version}.json (backup)\n- ${safeSubjectArea}-flashcards.csv\n- ${safeSubjectArea}-questions.csv\n\nPlace in: content/year-${year}/${safeSubject}/\nThen commit to git.`);
}

// ═════════════════════════════════════════════════════════════════════════════
// PHASE 2 CACHE SYSTEM - 3 Day Expiry
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Cache loaded content data (chapters, flashcards, questions) for 3 days
 * Format: cache_y{year}_{subject}
 * Example: cache_y10_social-science
 */
function setCacheData(cacheKey, data) {
  const cacheEntry = {
    data: data,
    timestamp: Date.now(),
    expiryDays: 0.25
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  console.log(`✅ Cached: ${cacheKey}`);
}

/**
 * Retrieve cached data if still valid (within 3 days)
 * Returns null if cache doesn't exist or has expired
 */
function getCacheData(cacheKey) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) {
      console.log(`ℹ️ Cache miss: ${cacheKey}`);
      return null;
    }
    
    const entry = JSON.parse(cached);
    const ageInDays = (Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24);
    
    if (ageInDays > entry.expiryDays) {
      console.log(`⏰ Cache expired (${ageInDays.toFixed(1)} days): ${cacheKey}`);
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    console.log(`✅ Cache hit: ${cacheKey} (${ageInDays.toFixed(1)} days old)`);
    return entry.data;
  } catch (e) {
    console.error(`Error reading cache ${cacheKey}:`, e);
    return null;
  }
}

/**
 * Clear cache for a specific key
 */
function clearCacheData(cacheKey) {
  localStorage.removeItem(cacheKey);
  console.log(`🗑️ Cleared cache: ${cacheKey}`);
}

/**
 * Clear ALL Phase 2 caches
 */
function clearAllCaches() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('cache_y')) {
      localStorage.removeItem(key);
    }
  });
  console.log('🗑️ Cleared all Phase 2 caches');
}
