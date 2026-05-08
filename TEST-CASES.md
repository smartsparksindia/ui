# SmartSpark Learning Workflow - Test Cases

## Overview
This document outlines comprehensive test cases for the SmartSpark learning workflow:
**Index (Year Selection) → Subject/Exam Prep → Chapters → Quiz → Score**

---

## Test Case Categories

### 1. INDEX PAGE - YEAR SELECTION
**Objective:** Verify user can select a year and navigate to subject selection

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-1.1 | Load index page | User opens application | Navigate to index.html | Year selection cards displayed (6, 7, 8) | HIGH |
| TC-1.2 | Select Year 6 | Index page loaded | Click on "Class 6" card | User navigated to subjects.html with year=6 in state | HIGH |
| TC-1.3 | Select Year 7 | Index page loaded | Click on "Class 7" card | User navigated to subjects.html with year=7 in state | HIGH |
| TC-1.4 | Select Year 8 | Index page loaded | Click on "Class 8" card | User navigated to subjects.html with year=8 in state | HIGH |
| TC-1.5 | Year state persists | Year selected | Open browser dev tools, check sessionStorage | ss_state contains selected year | MEDIUM |
| TC-1.6 | Index page responsive | Mobile device | Load index on mobile | Year cards stack vertically, all clickable | MEDIUM |
| TC-1.7 | View hero content | Index page loaded | Observe page header | Hero section displays with tagline and stats | LOW |
| TC-1.8 | Navigate to progress | Index page loaded | Click "Your Progress" if available | Progress page loads with user stats | MEDIUM |

---

### 2. SUBJECT SELECTION
**Objective:** Verify user can select subject or exam prep quiz after choosing year

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-2.1 | Load subjects page | Year selected (6, 7, or 8) | Navigate to subjects.html | Subject cards displayed for selected year | HIGH |
| TC-2.2 | Subjects filtered by year | Year 6 selected | Verify subjects shown for Class 6 | Only Class 6 subjects listed | HIGH |
| TC-2.3 | Subjects filtered by year | Year 7 selected | Switch year and load subjects.html | Only Class 7 subjects listed | HIGH |
| TC-2.4 | Subjects filtered by year | Year 8 selected | Switch year and load subjects.html | Only Class 8 subjects listed | HIGH |
| TC-2.5 | Select subject option | Subjects page loaded | Click on subject card (e.g., "Math") | Navigate to chapters.html with subject in state | HIGH |
| TC-2.6 | Select exam prep quiz | Subjects page loaded | Click "Exam Prep Quiz" button/card | Navigate to quiz page (if available) | HIGH |
| TC-2.7 | Subject state saved | Subject selected | Check sessionStorage after selection | ss_state contains year + subject | MEDIUM |
| TC-2.8 | Breadcrumb displays year | Subjects page loaded | View breadcrumb/header | Breadcrumb shows selected year | MEDIUM |
| TC-2.9 | Back button from subjects | Subjects page loaded | Click back button | Return to index.html | MEDIUM |
| TC-2.10 | Score pill visible | Subjects page loaded | Observe navigation | Score/points display in nav bar | LOW |

---

### 3. CHAPTERS PAGE
**Objective:** Verify chapters are displayed, filtered, and clickable

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-3.1 | Load chapters page | Subject selected | Navigate to chapters.html | All published chapters for subject displayed | HIGH |
| TC-3.2 | Only published chapters | Chapters page loaded | Verify chapter list | Only chapters with status='published' shown | HIGH |
| TC-3.3 | Chapters sorted by order | Chapters page loaded | Observe chapter list | Chapters in correct order (by created_at) | MEDIUM |
| TC-3.4 | Chapter card displays info | Chapters page loaded | View chapter card | Card shows: chapter number, title, metadata | HIGH |
| TC-3.5 | Select Chapter 1 | Chapters page loaded | Click Chapter 1 card | Navigate to quiz/learn page with chapter in state | HIGH |
| TC-3.6 | Select Chapter N | Chapters page loaded | Click any chapter card | Navigate to quiz page with correct chapter state | HIGH |
| TC-3.7 | Breadcrumb shows path | Chapters page loaded | View breadcrumb | Shows: Home > Year > Subject > Chapters | MEDIUM |
| TC-3.8 | Back button to subjects | Chapters page loaded | Click "← Subjects" button | Return to subjects.html | MEDIUM |
| TC-3.9 | No chapters message | Empty chapter list | Load chapters for subject with no published chapters | Display "No chapters available" message | MEDIUM |
| TC-3.10 | State validation | Direct URL access to chapters | Try opening chapters.html without year/subject selected | Redirect to index.html or show error | MEDIUM |
| TC-3.11 | Chapter metadata displayed | Chapter card visible | Check card for tags/difficulty/topics | Relevant metadata shown (if available) | LOW |
| TC-3.12 | Chapter progress indicator | User completed chapter | View chapter card | Show completion badge or score (if applicable) | LOW |

---

### 4. QUIZ PAGE - CHAPTER SELECTION
**Objective:** Verify quiz loads with correct MCQ content

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-4.1 | Load quiz page | Chapter selected | Chapter selected, navigate to quiz | Quiz page loads with MCQs displayed | HIGH |
| TC-4.2 | Quiz questions displayed | Quiz page loaded | Observe quiz section | All MCQs for chapter visible | HIGH |
| TC-4.3 | Question format correct | Quiz page loaded | View question | Question displays: number, text, 4 options | HIGH |
| TC-4.4 | Options clearly labeled | Quiz page loaded | View options | Options labeled A/B/C/D or numbered 1-4 | MEDIUM |
| TC-4.5 | Correct chapter content | Chapter selected | Load quiz for specific chapter | Only questions from selected chapter shown | HIGH |
| TC-4.6 | State validation | Direct URL access to quiz | Try opening quiz without chapter selected | Redirect to index.html or show error | MEDIUM |
| TC-4.7 | Breadcrumb shows path | Quiz page loaded | View breadcrumb | Shows: Home > Year > Subject > Chapter > Quiz | MEDIUM |
| TC-4.8 | Progress indicator | Quiz page loaded | Check navigation | Indicate user is on quiz step | LOW |
| TC-4.9 | All questions load | Quiz page loaded | Scroll through quiz | All questions visible and properly rendered | HIGH |

---

### 5. QUIZ INTERACTION - MCQ ANSWERING
**Objective:** Verify user can select answers and interact with quiz

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-5.1 | Select answer A | Quiz page loaded, Q1 visible | Click option A | Option A highlighted/selected | HIGH |
| TC-5.2 | Select answer B | Quiz page loaded, Q1 visible | Click option B | Option B highlighted/selected | HIGH |
| TC-5.3 | Select answer C | Quiz page loaded, Q1 visible | Click option C | Option C highlighted/selected | HIGH |
| TC-5.4 | Select answer D | Quiz page loaded, Q1 visible | Click option D | Option D highlighted/selected | HIGH |
| TC-5.5 | Deselect answer | Answer selected | Click same option again | Answer deselected (if toggle) OR option changed | MEDIUM |
| TC-5.6 | Switch answer | Answer A selected | Click option B | Option B now selected, A deselected | MEDIUM |
| TC-5.7 | Answer persistence | Answer selected | Navigate away & back (if applicable) | Answer remains selected | MEDIUM |
| TC-5.8 | Multiple answers | Two questions | Select answer Q1, scroll, select answer Q2 | Both answers retained | HIGH |
| TC-5.9 | Unanswered question | Quiz loaded | Leave question blank | Question marked as unanswered | MEDIUM |
| TC-5.10 | Option styling | Answer selected | Observe selected option | Clear visual feedback (color, border, checkmark) | MEDIUM |
| TC-5.11 | Hover effects | Quiz page loaded | Hover over unselected option | Hover state visible | LOW |
| TC-5.12 | Touch interaction (mobile) | Mobile device | Tap option on mobile | Option selects correctly | MEDIUM |

---

### 6. QUIZ SUBMISSION & SCORING
**Objective:** Verify quiz submission, scoring logic, and score display

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-6.1 | Submit quiz | All answers provided | Click "Submit Quiz" button | Quiz submitted, score calculated | HIGH |
| TC-6.2 | Score calculation - Perfect | All answers correct | Submit quiz | Score = 100% | HIGH |
| TC-6.3 | Score calculation - Partial | 3 correct, 2 wrong (5 Q's) | Submit quiz | Score = 60% | HIGH |
| TC-6.4 | Score calculation - None | All answers wrong | Submit quiz | Score = 0% | HIGH |
| TC-6.5 | Points awarded | Perfect score | Check state/progress | Points added to total_points | HIGH |
| TC-6.6 | Partial points | Partial correct | Check points logic | Points = correct_answers / total_questions * max_points | HIGH |
| TC-6.7 | No points for failures | All wrong | Check total points | No points added | MEDIUM |
| TC-6.8 | Score displayed | Quiz submitted | View score section | Score shown prominently (e.g., "85%") | HIGH |
| TC-6.9 | Score persistence | Quiz submitted | Navigate away & check progress page | Score saved in user progress | MEDIUM |
| TC-6.10 | Retake allowed | Quiz completed | Click "Retake" or back button | Return to quiz with answers cleared | MEDIUM |
| TC-6.11 | Best score tracked | Take quiz twice (70%, then 90%) | Check progress page | Best score = 90% is stored | MEDIUM |
| TC-6.12 | Score animation | Quiz submitted | View score reveal | Score displays with animation/transition | LOW |
| TC-6.13 | Feedback provided | Quiz submitted | View after quiz | Show which answers were correct/wrong | MEDIUM |

---

### 7. END-TO-END WORKFLOW - HAPPY PATH
**Objective:** Complete walkthrough of entire workflow

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-7.1 | Full workflow Class 6 Math | Fresh user session | 1. Select Year 6 2. Select Math 3. Select Chapter 1 4. Answer all MCQs 5. Submit | Score displayed and saved | HIGH |
| TC-7.2 | Full workflow Class 7 Science | Fresh user session | 1. Select Year 7 2. Select Science 3. Select Chapter 2 4. Answer all MCQs 5. Submit | Score displayed and saved | HIGH |
| TC-7.3 | Full workflow Class 8 English | Fresh user session | 1. Select Year 8 2. Select English 3. Select Chapter 3 4. Answer all MCQs 5. Submit | Score displayed and saved | HIGH |
| TC-7.4 | Exam prep quiz path | Index page | 1. Select Year 2. Click Exam Prep Quiz | Exam quiz loads with mixed questions | MEDIUM |
| TC-7.5 | Multiple chapters same subject | Subject selected | 1. Complete Chapter 1 2. Return to chapters 3. Complete Chapter 2 4. Check progress | Both scores saved | MEDIUM |
| TC-7.6 | Multiple subjects same year | Year selected | 1. Complete Math Chapter 2. Return & select Science Chapter 3. Check both in progress | Both tracked separately | MEDIUM |

---

### 8. ERROR HANDLING & EDGE CASES
**Objective:** Verify application handles errors gracefully

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-8.1 | Invalid year parameter | Tampered URL | Access subjects.html with invalid year | Show error or redirect to index | MEDIUM |
| TC-8.2 | Missing year state | Direct URL access | Access subjects.html without going through index | Redirect to index.html | MEDIUM |
| TC-8.3 | Missing subject state | Direct URL access | Access chapters.html without selecting subject | Redirect to index.html or show error | MEDIUM |
| TC-8.4 | Missing chapter state | Direct URL access | Access quiz without selecting chapter | Redirect to index.html or show error | MEDIUM |
| TC-8.5 | Empty data set | Subject with no chapters | Try to load chapters for unpublished subject | Show "No chapters available" message | MEDIUM |
| TC-8.6 | Network error recovery | Network failure during quiz load | Attempt to reload | Show error message with retry option | MEDIUM |
| TC-8.7 | Session timeout | Long idle period | Check if state persists | State cleared or warning shown | LOW |
| TC-8.8 | Invalid quiz data | Corrupted question data | Load quiz | Gracefully handle missing fields | MEDIUM |
| TC-8.9 | No correct answer defined | MCQ without correct_option | Submit quiz | Score calculated correctly or handled | MEDIUM |

---

### 9. UI/UX VALIDATION
**Objective:** Verify UI elements are accessible and user-friendly

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-9.1 | Page loads under 3 seconds | Network good | Navigate between pages | Each page loads in < 3s | MEDIUM |
| TC-9.2 | Mobile responsiveness | Mobile device (320px) | Load all pages on mobile | All content visible, no horizontal scroll | HIGH |
| TC-9.3 | Tablet responsiveness | Tablet device (768px) | Load all pages on tablet | Layout adapts properly | MEDIUM |
| TC-9.4 | Color contrast | All pages | Check text contrast ratios | WCAG AA standard met (4.5:1) | MEDIUM |
| TC-9.5 | Button accessibility | Quiz page | Tab through buttons | All buttons reachable via keyboard | MEDIUM |
| TC-9.6 | Form accessibility | Quiz options | Use screen reader | Options announced correctly | LOW |
| TC-9.7 | Focus indicators | All pages | Tab through page | Clear focus indicators visible | MEDIUM |
| TC-9.8 | Score pill visibility | All pages with nav | View score display | Score visible and updated correctly | LOW |
| TC-9.9 | Breadcrumb navigation | Inner pages | Click breadcrumb links | Navigate to correct page | MEDIUM |
| TC-9.10 | Loading states | Page transitions | Check for loading indicators | Loading spinner or placeholder shown | LOW |

---

### 10. DATA PERSISTENCE & STATE MANAGEMENT
**Objective:** Verify user data and state are properly managed

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-10.1 | State saved to sessionStorage | Any navigation | Check sessionStorage | ss_state contains current year/subject/chapter | MEDIUM |
| TC-10.2 | Progress saved to localStorage | Quiz completed | Check localStorage for user progress | User progress updated | HIGH |
| TC-10.3 | Total points updated | Quiz with score | Check user's total_points | Points accumulated correctly | HIGH |
| TC-10.4 | Chapter progress tracked | Chapter completed | Check chapters_progress object | Chapter marked with status/score | HIGH |
| TC-10.5 | Multiple attempts tracked | Take quiz twice | Check progress history | Best score retained | MEDIUM |
| TC-10.6 | Progress page reflects changes | Quiz completed | Navigate to progress.html | New score visible in dashboard | HIGH |
| TC-10.7 | Data survives page refresh | Quiz submitted | Refresh page | User data still accessible | HIGH |
| TC-10.8 | State clears on logout/home | Click home/logout | Check sessionStorage | ss_state cleared | MEDIUM |
| TC-10.9 | Points persists across sessions | Complete quiz, close, reopen | Check user profile | Points still present | HIGH |

---

### 11. PERFORMANCE & LOAD TESTING
**Objective:** Verify application performance under load

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-11.1 | Large chapter list | 50+ chapters | Load chapters.html | All chapters load smoothly, no lag | MEDIUM |
| TC-11.2 | Large quiz | 100+ questions | Load quiz | Quiz loads and responds to interactions | MEDIUM |
| TC-11.3 | Rapid navigation | Switch between pages quickly | Navigate year→subject→chapter→quiz | No state corruption or errors | MEDIUM |
| TC-11.4 | Memory efficiency | Complete 10 quizzes in session | Monitor memory usage | No significant memory leaks | LOW |
| TC-11.5 | CSS/JS bundling | Page load | Check network tab | CSS/JS minified and optimized | LOW |

---

### 12. INTEGRATION TESTS
**Objective:** Verify components work together correctly

| TC# | Test Name | Preconditions | Steps | Expected Results | Priority |
|-----|-----------|---------------|-------|------------------|----------|
| TC-12.1 | Router functions properly | All pages | Test all navigation functions (goHome, goToSubjects, etc.) | Navigation works as expected | HIGH |
| TC-12.2 | State management functions | All pages | Test setState, getState, clearState | State updates correctly | HIGH |
| TC-12.3 | Data layer retrieval | Chapters page | Call getChaptersForYearSubject() | Returns correct filtered chapters | HIGH |
| TC-12.4 | Score calculation logic | Quiz page | Test score calculation with various answer patterns | Points calculated correctly | HIGH |
| TC-12.5 | User progress functions | Progress page | Test getUserProgress, getChapterScore | Progress data retrieved correctly | HIGH |

---

## Test Execution Notes

### Setup
- Clear browser cache and sessionStorage before each test session
- Use test data fixtures with known good data
- Test across browsers: Chrome, Firefox, Safari, Edge

### Test Data Required
- Test users for each year (Class 6, 7, 8)
- Sample subjects for each class
- Sample chapters with mix of published/draft status
- MCQs with known correct answers for validation

### Reporting
- Document pass/fail with screenshots for failures
- Note any performance issues or slow operations
- Track defects and link to test cases
- Update test cases based on product changes

---

## Priority Definitions
- **HIGH:** Critical functionality, blocks user workflow
- **MEDIUM:** Important features, affects user experience
- **LOW:** Nice-to-have, enhancement, minor UX improvement

---

## Regression Test Suite (Minimum)
For future regression testing, run these critical test cases:
- TC-1.2, TC-2.5, TC-3.5, TC-4.2, TC-5.1, TC-6.1, TC-6.2, TC-7.1, TC-10.3, TC-12.1

---

*Document Version: 1.0*  
*Last Updated: May 8, 2026*  
*Status: Ready for Testing*
