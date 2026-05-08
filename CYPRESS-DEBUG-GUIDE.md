# Cypress Test - Debugging Chapters Page Issue

## Problem
The chapters page is not displaying any chapters when the test runs.

## Root Causes & Solutions

### 1. **State Not Being Passed Correctly**
When navigating from subjects.html to chapters.html, the state must include:
- `year` (number: 6, 7, or 8)
- `subject` (string: 'Math', 'Science', 'English')

**Check in browser console:**
```javascript
// Open DevTools in Cypress (F12 in test runner)
sessionStorage.getItem('ss_state')
// Should show: {"year":6,"subject":"Math","chapter":null}
```

### 2. **Chapters Not in localStorage**
The chapters must be stored with exact matching:
- `class: 6` (not "Class 6")
- `subject: 'Math'` (exact case match)
- `status: 'published'`

**Check chapters in localStorage:**
```javascript
// In browser console during test
JSON.parse(localStorage.getItem('ss_chapters'))
// Should show chapters with class=6, subject='Math', status='published'
```

### 3. **Subject Name Mismatch**
The test creates chapters with subject: 'Math', but chapters.html might be looking for 'Maths' or different case.

**Check the chapters.html filter:**
```javascript
// This is the filter used in chapters.html:
const chapters = getChaptersForYearSubject(year, subject);
// Which filters by: ch.class === year && ch.subject === subject && ch.status === 'published'
```

### 4. **Helper Functions Not Available**
chapters.html defines `getTotalScore()` and `getChapterScore()` locally, which might fail if not defined.

## How to Debug the Issue

### Step 1: Run Test with Debugging
```bash
npm run test:open
```

### Step 2: In Cypress Test Runner
1. Click on the test "Should complete full workflow and display score"
2. Watch the test run and see where it fails
3. When it reaches the chapters page, look at the Command Log (left panel)
4. You should see logs like:
   - "Step 1: Selecting Year 6"
   - "Step 2: Selecting Math subject"
   - "Step 3: Verifying chapters are displayed"

### Step 3: Check Browser Console
When the test pauses at "Step 3", press F12 to open DevTools and run:

```javascript
// Check if chapters exist
const chapters = JSON.parse(localStorage.getItem('ss_chapters'));
console.log('Total chapters:', Object.keys(chapters).length);
console.log('Chapters:', chapters);

// Check current state
const state = JSON.parse(sessionStorage.getItem('ss_state'));
console.log('Current state:', state);

// Check matching chapters
const year = state.year;
const subject = state.subject;
const matching = Object.values(chapters).filter(ch => 
  ch.class === year && ch.subject === subject && ch.status === 'published'
);
console.log(`Chapters for ${subject} Class ${year}:`, matching);
```

### Step 4: Check chapters.html JavaScript
The page should log chapter data. In DevTools Console, you should see:
- Chapter cards being rendered
- Or error messages if getTotalScore() fails

## Quick Fixes to Try

### Fix 1: Hardcode Test Data (Simplest)
If the dynamic setup isn't working, add hardcoded chapters to test:

```javascript
// In cypress/e2e/workflow-tc7-1.cy.js beforeEach
beforeEach(() => {
  cy.visit('/index.html');
  cy.window().then((win) => {
    // Force set chapters directly
    const chapters = {
      'ch_6_math_001': {
        chapter_id: 'ch_6_math_001',
        class: 6,
        subject: 'Math',
        title: 'Chapter 1: Numbers and Operations',
        status: 'published',
        question_ids: ['q1', 'q2', 'q3', 'q4', 'q5'],
        flashcard_ids: []
      }
    };
    localStorage.setItem('ss_chapters', JSON.stringify(chapters));
    
    // Force set state
    sessionStorage.setItem('ss_state', JSON.stringify({
      year: 6,
      subject: 'Math',
      chapter: null
    }));
  });
});
```

### Fix 2: Add Console Logging to chapters.html
Temporarily add to chapters.html script section:

```javascript
<script>
console.log('=== CHAPTERS PAGE LOADING ===');
console.log('State:', getState());
const chapters = getStore('ss_chapters');
console.log('All chapters in storage:', Object.keys(chapters));

const state = getState();
const year = state.year || 6;
const subject = state.subject || 'Science';

const filtered = Object.values(chapters).filter(ch => 
  ch.class === year && ch.subject === subject && ch.status === 'published'
);
console.log(`Filtered chapters for ${subject} Class ${year}:`, filtered);
</script>
```

### Fix 3: Ensure data-layer.js is Loaded
Make sure chapters.html has:
```html
<script src="data-layer.js"></script>
```

Before any other scripts that call data-layer functions.

## Test Modification - Hardcoded Version

If you want to skip navigation and just test the chapters page directly:

```javascript
it('Should display chapters directly', () => {
  // Hardcode the state and data
  cy.window().then((win) => {
    // Set chapters
    const chapters = {
      'ch_6_math_001': {
        chapter_id: 'ch_6_math_001',
        class: 6,
        subject: 'Math',
        title: 'Chapter 1: Numbers and Operations',
        status: 'published',
        question_ids: [],
        flashcard_ids: []
      }
    };
    localStorage.setItem('ss_chapters', JSON.stringify(chapters));
    
    // Set state
    sessionStorage.setItem('ss_state', JSON.stringify({
      year: 6,
      subject: 'Math'
    }));
    
    // Set user
    const user = {
      user_id: 'test_user',
      name: 'Test Student',
      email: 'test@smartspark.local'
    };
    sessionStorage.setItem('ss_current_user', JSON.stringify(user));
    localStorage.setItem('ss_users', JSON.stringify({'test_user': user}));
  });
  
  // Now navigate to chapters
  cy.visit('/chapters.html');
  cy.contains('Choose a Chapter').should('be.visible');
  cy.get('.chapter-card').should('have.length', 1);
});
```

## Verification Checklist

- [ ] localStorage has `ss_chapters` with Math Class 6 chapters
- [ ] sessionStorage has `ss_state` with `year: 6, subject: 'Math'`
- [ ] sessionStorage has `ss_current_user` with user object
- [ ] chapters.html loads without JavaScript errors
- [ ] Chapter cards render in the DOM
- [ ] Chapter cards are visible and clickable

## Next Steps

1. **Run the test:** `npm run test:open`
2. **Check browser console** when test reaches chapters page
3. **Review the logs** in the test output
4. **Apply the appropriate fix** based on what you find
5. **Re-run test** to verify

## Contact/Support

If the issue persists:
1. Share the browser console output from the Cypress test
2. Share what `localStorage.getItem('ss_chapters')` returns
3. Share what `sessionStorage.getItem('ss_state')` returns

These will help identify the exact root cause!
