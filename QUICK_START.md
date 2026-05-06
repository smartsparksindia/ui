# SmartSpark Platform — Quick Start Guide

## 🎯 What You've Built

A **professional CBSE learning platform** with:
- 📚 Student learning app (flashcards + quizzes)
- 📝 CMS for content management (admin + contributors)
- 💾 Versioned content system (never breaks live quizzes)
- 🏦 Question bank (reusable questions)
- 📊 Progress & analytics tracking
- 🔐 Role-based access control

---

## 📦 File Structure

```
smartspark-platform/
├── ARCHITECTURE.md                 # Complete system design doc
├── QUICK_START.md                 # This file
│
├── [LEARNING APP FILES]
├── index.html                     # Home + year/subject selection
├── subjects.html                  # Subject picker
├── chapters.html                  # Chapter list
├── learn.html                     # Unified flashcard + quiz engine
├── progress.html                  # Student dashboard
│
├── [CMS FILES]
├── cms-login.html                 # Authentication (admin/contributor/student)
├── cms-dashboard.html             # CMS hub (analytics, pending approvals)
├── cms-editor.html                # Form-based content editor
├── cms-my-drafts.html             # Contributor's draft management
├── cms-approval-queue.html        # Admin review system
├── cms-question-bank.html         # Manage reusable questions
├── cms-analytics.html             # Performance tracking
├── cms-export.html                # Backup & portability
│
├── [CORE DATA LAYER]
└── data-layer.js                  # All data management (storage, versioning, analytics)
```

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Extract Files
Unzip the `smartspark-platform.zip` and place all files in one folder.

### Step 2: Upload to GitHub Pages
1. Create a new GitHub repo: `smartspark-platform`
2. Upload all files to root of repo
3. Go to Settings → Pages → Enable GitHub Pages
4. Your site will be live at: `https://YOUR-USERNAME.github.io/smartspark-platform/`

### Step 3: Access the Platform
- **Students**: Go to home page, select year → subject → chapter
- **Contributors**: Go to `cms-login.html`, register as "Contributor"
- **Admins**: Use admin account to approve chapters

---

## 👥 Demo Accounts (Pre-created)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@smartspark.in` | `admin123` |
| Contributor | `contributor@smartspark.in` | `contrib123` |
| Student | `student@smartspark.in` | `student123` |

---

## 🧠 How the System Works

### For Students

1. **Access Learning App**
   - Go to `index.html`
   - Select Class → Subject → Chapter
   - Choose: "Review Flashcards" OR "Practice Quiz"

2. **Learn Phase**
   - Flip flashcards to learn concepts
   - +5 pts per flashcard viewed

3. **Quiz Phase**
   - Answer multiple choice questions
   - Get instant feedback + explanation
   - +50 pts (no revision) or +40 pts (after revision)

4. **Track Progress**
   - View progress.html for dashboard
   - See points, streaks, chapter completion

### For Contributors (Content Creators)

1. **Login** → `cms-login.html`
2. **Create Chapter** → `cms-dashboard.html` → "Create New Chapter"
3. **Fill Form**:
   - Chapter title, description
   - Add flashcards (term + definition)
   - Add quiz questions (or select from question bank)
4. **Save as Draft** → Can edit anytime
5. **Submit for Review** → Status: "submitted"
6. **Wait for Admin Approval** → Status: "published" (v1 created)

### For Admins

1. **Login** with admin account
2. **Dashboard** shows:
   - Published chapters
   - Pending approvals
   - Recent activity
3. **Approval Queue** → Review → Approve/Reject with feedback
4. **Analytics** → View question performance, student progress
5. **Export** → Backup all content as JSON

---

## 📊 Data Model Overview

### Content Hierarchy
```
Class (6, 7, 8)
  └─ Subject (Science, Maths, English, Social Science)
     └─ Chapter (e.g., "Photosynthesis")
        ├─ Flashcards (term + definition)
        ├─ Quiz Questions (from question bank)
        └─ Metadata (version, status, approval)
```

### Versioning System
- **Draft** → Contributor editing (not visible to students)
- **Submitted** → Waiting for admin review
- **Published (v1)** → Immutable snapshot (students use this)
- **Editing (v2 draft)** → Admin can edit published → creates new draft → new published v2
- **Never breaks** → Student on v1 stays on v1 until they manually advance

### Question Bank
- Questions stored once, reused across chapters
- Avoids duplication
- Tracks accuracy % across all uses
- Can be updated → updates everywhere used

---

## 💾 Data Storage

All data is stored in **browser localStorage** (offline-first):

| Key | Contains |
|-----|----------|
| `ss_chapters` | All chapters + versions |
| `ss_question_bank` | Reusable questions |
| `ss_flashcards` | Flashcard definitions |
| `ss_user_progress` | Student performance |
| `ss_analytics_events` | User interactions |
| `ss_users` | User accounts + roles |
| `ss_config` | System configuration |

**Export/Backup**: Admin can download entire platform as JSON.

---

## 🔐 Role-Based Access

### Student
- ✅ View published chapters
- ✅ Complete flashcards & quizzes
- ✅ Track own progress
- ❌ Cannot edit content

### Contributor
- ✅ All student features
- ✅ Create draft chapters
- ✅ Edit own drafts
- ✅ Submit for review
- ✅ Create questions
- ❌ Cannot approve own content
- ❌ Cannot edit published content (must create new draft)

### Admin
- ✅ All permissions
- ✅ Review & approve submissions
- ✅ Edit published chapters (creates new version)
- ✅ View analytics
- ✅ Manage question bank
- ✅ Export/backup all content

---

## 🎮 Gamification System

**Points Awarded**:
- Flashcard viewed: +5 pts
- Quiz answer (correct, no revision): +50 pts
- Quiz answer (correct, after revision): +40 pts
- Chapter completed: +100 bonus pts
- 5-chapter streak: +200 bonus pts

**Motivation Features**:
- Daily streak counter
- Milestone badges (500, 1000, 5000 pts)
- Subject mastery recognition
- Improvement % feedback

---

## 📈 Analytics Events Tracked

System automatically logs:
- `flashcard_viewed` → When student reviews a card
- `quiz_started` → When quiz attempt begins
- `question_answered` → With correctness, time taken, revision status
- `quiz_completed` → Final score + accuracy %
- `chapter_mastered` → All questions answered correctly

**Metrics Available**:
- Accuracy % per chapter
- Time spent per chapter
- Weak topics (questions with <60% accuracy)
- Student streak + total points
- Question effectiveness (used for content quality)

---

## 🛠️ Customization

### Add New Class/Subject
1. In `cms-editor.html`, form dropdowns reference:
   - `['6', '7', '8']` for classes
   - `['Science', 'Maths', 'English', 'Social Science']` for subjects

2. To add Class 9:
   ```javascript
   // In cms-editor.html, update select options:
   <option value="9">Class 9</option>
   ```

### Add New Chapter
1. Go to `cms-login.html` → Login as contributor
2. Click "Create New Chapter"
3. Fill form with:
   - Class: 6
   - Subject: Science
   - Title: "Photosynthesis"
   - Description: "Understanding plant nutrition"
4. Add flashcards (term + definition)
5. Add questions (MCQ with explanation)
6. Submit for review
7. Admin approves → Published (v1 created)

### Modify Question Bank
1. Go to `cms-question-bank.html` (admin only)
2. Add/edit reusable questions
3. Questions can be linked to any chapter
4. Updates automatically track usage

---

## 🔄 Content Lifecycle (Example)

**Timeline: Chapter "Photosynthesis"**

| Time | Action | Status | Visible to Students |
|------|--------|--------|-------------------|
| Jan 1 | Contributor creates chapter | Draft | ❌ No |
| Jan 2 | Contributor submits | Submitted | ❌ No |
| Jan 3 | Admin reviews, approves | Published v1 | ✅ Yes (v1) |
| Feb 1 | Contributor edits definition | Draft (v2) | ✅ Still v1 |
| Feb 2 | Re-submits | Submitted (v2) | ✅ Still v1 |
| Feb 3 | Admin approves | Published v2 | ✅ Yes (v2) |
| | | | *New students get v2, old ones keep v1* |

---

## 🚨 Important Rules

### For Contributors
❌ **Cannot**: Edit published chapters directly
✅ **Instead**: Create new draft → Submit → Wait for approval

❌ **Cannot**: Delete published content
✅ **Instead**: Create new version or request deprecation

❌ **Cannot**: Approve own content
✅ **Wait**: For admin review

### For Admins
✅ **Can**: Edit published → Creates new draft v2
✅ **Can**: Reject with feedback → Goes back to draft
✅ **Can**: View all submissions (all statuses)

### System Protection
✅ **Protects**: Live student sessions (versioning)
✅ **Protects**: Content integrity (hash checksums)
✅ **Protects**: Analytics accuracy (immutable versions)

---

## 🔗 Linking Questions to Chapters

### Method 1: Create Inline
While editing chapter, add questions directly → Creates chapter-specific questions

### Method 2: Use Question Bank
1. Go to `cms-question-bank.html`
2. Create reusable question (can be used in multiple chapters)
3. In chapter editor, link existing question

### Why Question Bank Matters
- Avoid duplicate Q's across chapters
- Update question once → Improves everywhere
- Track question accuracy globally
- Enable advanced analytics

---

## 📤 Export & Backup

### How to Backup
1. Login as admin
2. Go to `cms-export.html`
3. Click "Download Backup"
4. JSON file downloaded with entire platform

### Contents of Backup
- All chapters (all versions)
- All flashcards
- Complete question bank
- Metadata + timestamps
- But NOT: individual student progress

### Restore from Backup
1. In `cms-export.html`
2. Click "Choose File"
3. Select previously downloaded JSON
4. Entire content restored

### Why This Matters
✅ Prevents vendor lock-in
✅ Can migrate to other platform
✅ Disaster recovery
✅ Version control (keep old backups)

---

## 🚀 Phase 1 → Phase 2 Roadmap

### Phase 1 (Current)
✅ Learning app (flashcards + quizzes)
✅ CMS with versioning
✅ Question bank
✅ Basic analytics
✅ Role-based access

### Phase 2 (Ready to build)
□ Adaptive learning paths (based on weak topics)
□ Difficulty tagging + weighting
□ CBSE pattern recognition
□ Teacher assignment mode
□ Class-level analytics dashboard
□ Spaced repetition recommendations

### Phase 3 (Future)
□ Backend API (Firebase/Supabase)
□ Multi-device sync
□ Student-parent portal
□ Advanced predictive analytics
□ AI-powered weak topic detection

---

## 🐛 Troubleshooting

### "Blank page when I load the site"
- Check browser console (F12)
- Ensure all `.js` files are in same folder as `.html`
- Clear browser cache (Ctrl+Shift+Delete)

### "Data not saving"
- Check if localStorage is enabled (not in private mode)
- Check browser quota (usually 5-10MB available)
- Try different browser

### "Can't login"
- Make sure you registered account first
- Password is case-sensitive
- Check if caps lock is on

### "Published chapter shows old content"
- Likely on different version
- Check chapter version history
- Admin can view all versions

---

## 📞 Support

### For Students
- Access learning app: `index.html`
- All data saved locally (no login required)

### For Contributors
- CMS access: `cms-login.html`
- Create chapters: "Create New Chapter" button
- Submit for review when ready

### For Admins
- Full control: `cms-dashboard.html`
- Review pending: "Approval Queue"
- Export data: "Export & Backup"

---

## ✅ Next Steps

1. **Extract and upload** all files to GitHub Pages
2. **Test learning app** with existing demo content
3. **Create first chapter** via CMS as contributor
4. **Review & approve** as admin
5. **See it appear** in learning app for students
6. **Scale content** → Year → Subject → Chapter system

---

**Built with ❤️ for Indian students. Made to scale.**

*SmartSpark Platform v1.0 — MVP Ready*
