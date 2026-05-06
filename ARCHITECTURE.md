╔════════════════════════════════════════════════════════════════════════════════╗
║                        SMARTSPARK PLATFORM ARCHITECTURE                       ║
║                    CBSE Learning System for Class 6-8 India                    ║
╚════════════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════════
#  SYSTEM DESIGN - 3-LAYER ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════════════════

## LAYER 1: LEARNING APP (Student Interface)
   └─ Purpose: Student learns, practices, and tracks progress
   └─ Tech: HTML + JavaScript (Offline-first, localStorage)
   └─ Files:
      - index.html (home + year/subject/chapter selection)
      - chapters.html (chapter list + description)
      - learn.html (unified flashcard + quiz engine)
      - progress.html (dashboard + streak + performance)

## LAYER 2: CMS (Content Management System)
   └─ Purpose: Admin/Contributors create, edit, review, publish content
   └─ Tech: HTML + JavaScript (Admin dashboard)
   └─ Access Control:
      - Admin: full CRUD + approval + export
      - Contributor: create/edit drafts only
   └─ Files:
      - cms-login.html (role-based auth)
      - cms-dashboard.html (overview + stats)
      - cms-content-editor.html (form-based editor)
      - cms-question-bank.html (reusable questions)
      - cms-chapter-manager.html (chapter CRUD)
      - cms-approval-queue.html (review system)
      - cms-analytics.html (performance tracking)

## LAYER 3: DATA LAYER
   └─ Purpose: Store all content, user progress, analytics
   └─ Storage Mechanism: JSON files in localStorage + IndexedDB (for scale)
   └─ Future: Backend API (Firebase/Supabase)
   └─ Data Models:
      - Content Schema (chapters, flashcards, questions)
      - User Progress (attempts, scores, revisions)
      - Content Versioning (snapshots, rollback)
      - Analytics Events (user interactions)

# ═══════════════════════════════════════════════════════════════════════════════
#  CONTENT STRUCTURE (SCALABLE)
# ═══════════════════════════════════════════════════════════════════════════════

DATA HIERARCHY:
  Class (6, 7, 8)
    └─ Subject (Science, Maths, English, Social Science)
       └─ Chapter (e.g., "Photosynthesis", "Quadratic Equations")
          ├─ Flashcard 1 (Term + Definition)
          ├─ Flashcard 2
          ├─ Quiz Question 1 (references Question Bank ID)
          ├─ Quiz Question 2
          └─ Metadata (status, version, published_at, contributor, approver)

CONTENT LIFECYCLE:
  1. Draft      → Contributor creates content
  2. Submitted  → Contributor submits for review
  3. In Review  → Admin reviews
  4. Approved   → Content published (snapshot created)
  5. Published  → Visible to students (immutable version)
  6. Deprecated → Old version (students see new one)

# ═══════════════════════════════════════════════════════════════════════════════
#  CONTENT VERSIONING (CRITICAL)
# ═══════════════════════════════════════════════════════════════════════════════

PROBLEM: If chapter is edited while student is in session, it breaks their quiz.

SOLUTION:
  - Every published chapter gets a version number: v1, v2, v3
  - Student quiz is tied to specific version
  - Editing creates new unpublished draft
  - Admin approves → creates new published version
  - Old versions remain accessible for analytics + archival

STRUCTURE:
{
  "chapter_id": "ch_6_sci_01",
  "current_version": 2,
  "versions": [
    {
      "version": 1,
      "status": "published",
      "published_at": "2024-01-15T10:00:00Z",
      "content": {...},
      "created_by": "contributor_1",
      "approved_by": "admin_1"
    },
    {
      "version": 2,
      "status": "published",
      "published_at": "2024-02-20T14:30:00Z",
      "content": {...},
      "changes_from_v1": ["updated_flashcard_3", "replaced_question_2"]
    }
  ]
}

# ═══════════════════════════════════════════════════════════════════════════════
#  QUESTION BANK SYSTEM (AVOID DUPLICATION)
# ═══════════════════════════════════════════════════════════════════════════════

PRINCIPLE: Questions are stored once, referenced many times.

STRUCTURE:
{
  "question_id": "q_maths_001",
  "class": 6,
  "subject": "Maths",
  "topic": "Fractions",
  "difficulty": "easy",
  "type": "mcq",
  "question_text": "What is 1/2 + 1/4?",
  "options": ["3/4", "1/6", "2/6", "1"],
  "correct_option": 0,
  "explanation": "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
  "tags": ["fractions", "addition", "cbse_important"],
  "created_by": "contributor_1",
  "version": 1,
  "status": "published",
  "used_in_chapters": [
    {"chapter_id": "ch_6_math_02", "version": 1}
  ]
}

BENEFITS:
  ✓ Avoid duplicate content
  ✓ Update question once, used everywhere
  ✓ Track which chapters use which questions
  ✓ Analyze performance by question across chapters
  ✓ Enable reuse across years/subjects

# ═══════════════════════════════════════════════════════════════════════════════
#  GAMIFICATION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

POINT ALLOCATION:
  Flashcard viewed → +5 pts per card (max 50 per chapter)
  Quiz started → 0 pts (just engagement)
  Quiz answered (correct) → +50 pts (without revision)
                          → +40 pts (after revision)
  Quiz answered (wrong) → 0 pts + explanation shown
  Chapter completed → +100 bonus pts (all Q's answered)
  Perfect score streak (5 chapters) → +200 bonus pts

TRACKING:
  - revision_before_quiz: boolean flag
  - quiz_attempt_time: timestamp
  - time_since_flashcard: seconds (if used same session)

MOTIVATION SYSTEM:
  - Daily streak: "Keep your learning streak alive!"
  - Milestone badges: 500pts, 1000pts, 5000pts
  - Subject mastery: "You've mastered Fractions!"
  - Improvement message: "You improved by 30% from last attempt"

# ═══════════════════════════════════════════════════════════════════════════════
#  ANALYTICS & PROGRESS TRACKING
# ═══════════════════════════════════════════════════════════════════════════════

EVENTS TRACKED:
  ✓ flashcard_viewed (timestamp, chapter_id, user_id)
  ✓ quiz_started (timestamp, chapter_id, version, user_id)
  ✓ question_answered (q_id, attempt, correct, time_taken, revision_status)
  ✓ quiz_completed (chapter_id, score, accuracy_pct, total_time, revision_used)
  ✓ chapter_mastered (when all Q's answered correctly)

METRICS FOR STUDENTS:
  - Accuracy % (correct/total attempts)
  - Chapters completed (status)
  - Current streak (days)
  - Total points
  - Performance by subject (%)
  - Time spent per chapter
  - Weak topics (questions with <60% accuracy)

METRICS FOR ADMINS/TEACHERS (Phase 2+):
  - Most difficult questions (low accuracy across students)
  - Content gaps (chapters with low completion)
  - Student performance trends
  - Question effectiveness (discrimination index)
  - Content contributor performance

# ═══════════════════════════════════════════════════════════════════════════════
#  CMS WORKFLOW (Content Lifecycle)
# ═══════════════════════════════════════════════════════════════════════════════

CONTRIBUTOR WORKFLOW:
  1. Login → Dashboard
  2. Select Class → Subject → Chapter → "Create New Chapter"
  3. Fill form:
     - Chapter title
     - Chapter description
     - Learning objectives
     - Estimated time
  4. Add Flashcards (form-based):
     - Term | Definition | [Image upload]
     - Save each flashcard
  5. Add Quiz Questions (can select from Question Bank OR create new):
     - Question text
     - 4 options
     - Mark correct answer
     - Explanation
     - [Image upload]
     - Difficulty tag
  6. Save as Draft
  7. Submit for Review → Status: "Pending Approval"
  8. Receive feedback → Revise → Resubmit
  9. Approved → Published (v1 created)

ADMIN WORKFLOW:
  1. Dashboard shows:
     - Pending approvals (queue)
     - Published chapters (count)
     - Contributors (active)
     - Recent activity feed
  2. Click "Review Queue" → See all drafts submitted
  3. View chapter preview (flashcards + questions)
  4. Approve → Mark as published (create immutable version)
  5. Reject with feedback → Sent back to contributor
  6. Edit published content → Creates new draft (maintains v1 for students)
  7. Can view version history + rollback if needed
  8. Export all content (JSON backup)

# ═══════════════════════════════════════════════════════════════════════════════
#  DATA MODELS (COMPLETE SCHEMA)
# ═══════════════════════════════════════════════════════════════════════════════

### MODEL 1: CHAPTER (Versionable)
{
  "chapter_id": "ch_6_sci_01_photo",
  "class": 6,
  "subject": "Science",
  "title": "Photosynthesis",
  "description": "Understanding how plants make their own food",
  "learning_objectives": ["Define photosynthesis", "Identify reactants", "Explain products"],
  "estimated_time_minutes": 45,
  "current_version": 2,
  "versions": [
    {
      "version": 1,
      "status": "published",
      "published_at": "2024-01-15T10:00:00Z",
      "created_by": "contributor_user_id",
      "approved_by": "admin_user_id",
      "flashcard_ids": ["fc_1", "fc_2", "fc_3"],
      "question_ids": ["q_photo_01", "q_photo_02", "q_photo_03"],
      "content_hash": "abc123..." // for integrity check
    },
    {
      "version": 2,
      "status": "published",
      "published_at": "2024-02-20T14:30:00Z",
      "changes_made": "Updated flashcard definitions for clarity",
      "flashcard_ids": ["fc_1", "fc_2_updated", "fc_3"],
      "question_ids": ["q_photo_01", "q_photo_02", "q_photo_03_revised"]
    }
  ]
}

### MODEL 2: FLASHCARD (Immutable per version)
{
  "flashcard_id": "fc_photo_01",
  "chapter_id": "ch_6_sci_01_photo",
  "version": 1,
  "term": "Photosynthesis",
  "definition": "Process by which plants convert sunlight, water, and CO₂ into glucose and oxygen.",
  "image_url": "https://cdn.smartspark.in/fc_photo_01.jpg",
  "created_by": "contributor_1",
  "created_at": "2024-01-15T10:00:00Z"
}

### MODEL 3: QUESTION (From Question Bank)
{
  "question_id": "q_photo_01",
  "bank_type": "reusable", // or "chapter_specific"
  "class": 6,
  "subject": "Science",
  "topic": "Photosynthesis",
  "difficulty": "easy",
  "question_text": "Which gas do plants release during photosynthesis?",
  "options": [
    "Carbon dioxide",
    "Oxygen",
    "Nitrogen",
    "Hydrogen"
  ],
  "correct_option_index": 1,
  "explanation": "Plants absorb CO₂ and release O₂ as a byproduct of photosynthesis.",
  "image_url": null,
  "tags": ["photosynthesis", "gases", "cbse_important"],
  "status": "published",
  "version": 1,
  "created_by": "contributor_1",
  "created_at": "2024-01-15T10:00:00Z",
  "used_in_chapters": [
    {"chapter_id": "ch_6_sci_01_photo", "version": 1},
    {"chapter_id": "ch_6_sci_02_respiration", "version": 1}
  ],
  "analytics": {
    "total_attempts": 1250,
    "correct_count": 980,
    "accuracy_pct": 78.4
  }
}

### MODEL 4: USER PROGRESS (Per student)
{
  "user_id": "student_xyz_123",
  "user_name": "Raj Kumar",
  "class": 6,
  "created_at": "2024-01-01T00:00:00Z",
  "total_points": 2450,
  "current_streak": 8, // days
  "longest_streak": 15,
  "chapters_progress": {
    "ch_6_sci_01_photo": {
      "chapter_version": 1,
      "status": "completed",
      "flashcards_viewed": 3,
      "quiz_attempts": 2,
      "best_score": 85,
      "accuracy_pct": 85,
      "points_earned": 185,
      "last_attempted": "2024-01-20T14:30:00Z",
      "time_spent_minutes": 25,
      "revision_before_quiz": true
    }
  },
  "question_attempts": {
    "q_photo_01": {
      "attempts": 2,
      "correct_count": 2,
      "incorrect_count": 0,
      "first_attempt": "2024-01-19T10:00:00Z",
      "last_attempt": "2024-01-20T14:30:00Z"
    }
  }
}

### MODEL 5: ANALYTICS EVENT
{
  "event_id": "evt_12345",
  "user_id": "student_xyz_123",
  "event_type": "quiz_answered", // flashcard_viewed, quiz_started, etc.
  "timestamp": "2024-01-20T14:30:45Z",
  "session_id": "sess_abc123",
  "data": {
    "chapter_id": "ch_6_sci_01_photo",
    "chapter_version": 1,
    "question_id": "q_photo_01",
    "selected_option": 1,
    "correct_option": 1,
    "time_taken_seconds": 15,
    "revision_viewed_before": true,
    "points_awarded": 40
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
#  ROLE-BASED ACCESS CONTROL (RBAC)
# ═══════════════════════════════════════════════════════════════════════════════

STUDENT:
  ✓ View published chapters
  ✓ View/flip flashcards
  ✓ Attempt quizzes
  ✓ View own progress
  ✓ View own points/streaks
  ✗ Cannot edit content
  ✗ Cannot see draft content
  ✗ Cannot approve/reject

CONTRIBUTOR:
  ✓ All STUDENT permissions
  ✓ Create new chapters (as draft)
  ✓ Edit own draft chapters
  ✓ Submit draft for review
  ✓ Create/edit flashcards
  ✓ Add questions to question bank
  ✓ View own submission history
  ✗ Cannot approve other's content
  ✗ Cannot edit published content (must create new draft)
  ✗ Cannot delete published content
  ✗ Cannot view other contributor's drafts

ADMIN:
  ✓ All permissions
  ✓ View all chapters (all statuses)
  ✓ Approve/reject submissions
  ✓ Edit published content (creates new version)
  ✓ Manage contributors
  ✓ View analytics
  ✓ Export all content
  ✓ Manage question bank
  ✓ Configure system settings

# ═══════════════════════════════════════════════════════════════════════════════
#  EXPORT & PORTABILITY (CRITICAL)
# ═══════════════════════════════════════════════════════════════════════════════

EXPORT FORMAT: JSON

CONTENT EXPORT INCLUDES:
  1. All chapters (all versions)
  2. All flashcards
  3. Question bank (complete)
  4. Metadata (creation dates, contributors, approvals)
  5. Version history
  6. Analytics aggregates (not per-student data)

BACKUP STRATEGY:
  - Auto-backup to localStorage (browser storage)
  - Admin can trigger full export at any time
  - Export includes timestamp + version number
  - Can import previously exported data

PORTABILITY:
  - Prevents vendor lock-in
  - Can migrate to another platform
  - Allows offline-first backup

# ═══════════════════════════════════════════════════════════════════════════════
#  PHASE 1 FEATURES (MVP)
# ═══════════════════════════════════════════════════════════════════════════════

✓ Learning App:
  - Year/Subject/Chapter selection
  - Flashcard viewer (flip animation)
  - Quiz engine with feedback
  - Progress dashboard
  - Point tracking

✓ CMS:
  - Contributor dashboard
  - Form-based content editor
  - Admin approval queue
  - Question bank (basic)
  - Content versioning (basic)

✓ Data:
  - localStorage-based storage
  - JSON schema
  - User progress tracking
  - Basic analytics events

✓ Design:
  - Light, pastel, warm theme
  - Responsive design
  - Offline-first

# ═══════════════════════════════════════════════════════════════════════════════
#  PHASE 2+ ROADMAP (DO NOT BUILD YET)
# ═══════════════════════════════════════════════════════════════════════════════

PHASE 2: Content Intelligence
  □ Difficulty tagging + weighting
  □ CBSE pattern tagging
  □ Question performance dashboard
  □ Weak topic detection
  □ Recommended practice sets

PHASE 3: Student Intelligence
  □ Adaptive learning paths
  □ Spaced repetition system
  □ Personalized recommendations
  □ Performance trends
  □ Predictive analytics (weak topics)

PHASE 4: Collaborative
  □ Teacher assignment mode
  □ Class progress tracking
  □ Student comparison (optional)
  □ Parent dashboard
  □ Assignment management

PHASE 5: Backend + Scale
  □ Move to Firebase/Supabase
  □ Real API instead of localStorage
  □ Multi-device sync
  □ Cloud backup
  □ Analytics dashboard (advanced)

# ═══════════════════════════════════════════════════════════════════════════════
#  TECH STACK (PHASE 1)
# ═══════════════════════════════════════════════════════════════════════════════

FRONTEND:
  - HTML5 (semantic)
  - CSS3 (light, pastel theme)
  - Vanilla JavaScript (no frameworks initially)
  - localStorage (offline-first)
  - IndexedDB (for larger data)

STORAGE:
  - Browser localStorage (JSON)
  - Can export/import JSON files

DESIGN:
  - Pastel + soft color palette
  - Rounded cards, soft shadows
  - Academic but approachable tone

DEPLOYMENT:
  - GitHub Pages (for MVP)
  - Can migrate to Vercel/Netlify later

# ═══════════════════════════════════════════════════════════════════════════════
#  SUCCESS METRICS (Phase 1 MVP)
# ═══════════════════════════════════════════════════════════════════════════════

✓ 3+ chapters published per subject
✓ Admin can manage content workflow
✓ Students can learn + practice
✓ Progress is tracked
✓ System is portable (can export)
✓ Designed for future scale (versioning, question bank)

END OF ARCHITECTURE DOCUMENT
