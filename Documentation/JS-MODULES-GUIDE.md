# 🔧 JavaScript Modules Guide

## TWO APPROACHES: Which Should You Use?

### **APPROACH 1: Single File (RECOMMENDED)**

Use **`data-layer.js`** (21 KB)
- ✅ All functionality in ONE file
- ✅ Simpler to manage
- ✅ No dependency order issues
- ✅ Faster to load (fewer requests)

**Include in HTML:**
```html
<script src="data-layer.js"></script>
```

**Advantages:**
- Single source of truth
- No import order issues
- Easier to deploy
- Best for MVP/Phase 1

---

### **APPROACH 2: Modular Files (OPTIONAL)**

Use separate files:
- `state.js` — State management
- `router.js` — Navigation
- `chapters.js` — Chapter utilities
- `data-layer.js` — Core data operations

**Include in HTML (in order):**
```html
<script src="state.js"></script>
<script src="router.js"></script>
<script src="chapters.js"></script>
<script src="data-layer.js"></script>
```

**Advantages:**
- Better code organization
- Easier to maintain long-term
- Reusable modules
- Better for Phase 2+ scale

---

## 📚 MODULE DESCRIPTIONS

### **state.js** (State Management)
Manages app navigation state across pages.

**Key functions:**
```javascript
getState()              // Get current state: {year, subject, chapter}
setState(patch)         // Update state (merge)
clearState()            // Clear all state
getSelectedYear()       // Get selected year
getSelectedSubject()    // Get selected subject
getSelectedChapter()    // Get selected chapter
setYear(year)           // Set year
setSubject(subject)     // Set subject
setChapter(chapter)     // Set chapter
isReadyForLearning()    // Check if state complete
```

**Uses:** `sessionStorage`

---

### **router.js** (Navigation)
Handles navigation between pages with state validation.

**Key functions:**
```javascript
goHome()                // Go to index.html
goToSubjects(year)      // Go to subjects (requires year)
goToChapters(subject)   // Go to chapters (requires year + subject)
goToLearn(chapterId)    // Go to learn page (requires all)
goToProgress()          // Go to progress dashboard
goToCMS()               // Go to CMS login
goToCMSDashboard()      // Go to CMS dashboard
validateState(level)    // Validate state before navigation
ensureState(level)      // Redirect to home if invalid
goBack()                // Smart back button
logout()                // Logout + clear state
getCurrentApp()         // 'cms' or 'student'
```

**Uses:** `state.js`

---

### **chapters.js** (Chapter Utilities)
Chapter-specific logic and analytics.

**Key functions:**
```javascript
getChaptersForYearSubject(year, subject, onlyPublished)
getChapterById(chapterId)
getChapterProgress(userId, chapterId)
getChapterScore(userId, chapterId)
getChapterAccuracy(userId, chapterId)
isChapterCompleted(userId, chapterId)
getChaptersByStatus(year, subject, status)
getChapterFlashcards(chapterId)
getChapterQuestions(chapterId)
getChapterVersions(chapterId)
getChapterMetadata(chapterId)
getSubjectCompletionPercentage(userId, year, subject)
getSubjectAverageAccuracy(userId, year, subject)
getSubjectTotalPoints(userId, year, subject)
getWeakChapters(userId, year, subject, threshold)
getStrongChapters(userId, year, subject, threshold)
```

**Uses:** `data-layer.js`

---

### **data-layer.js** (Core Data Operations)
All data storage, versioning, and analytics.

**See: data-layer.js documentation for 50+ functions**

---

## 🎯 COMPARISON TABLE

| Aspect | Single File | Modular |
|--------|------------|---------|
| **Files to load** | 1 | 4 |
| **File size** | 21 KB | 25 KB total |
| **Complexity** | Simple | Organized |
| **Maintenance** | Harder (large file) | Easier (split by concern) |
| **Reusability** | Lower | Higher |
| **Best for** | MVP (Phase 1) | Scale (Phase 2+) |
| **Include order** | N/A | ✅ Critical |
| **Debugging** | Easier | Harder (need to trace) |

---

## 📋 HOW TO USE EACH APPROACH

### **Option A: Using Single data-layer.js**

```html
<!DOCTYPE html>
<html>
<head>
    <title>SmartSpark</title>
</head>
<body>
    <button onclick="goToChapters('Science')">Start Learning</button>

    <!-- SINGLE FILE - SIMPLEST -->
    <script src="data-layer.js"></script>
    
    <script>
        // All functions available: state, router, chapters, data-layer
        function goToChapters(subject) {
            setState({ subject });
            window.location.href = 'chapters.html';
        }
    </script>
</body>
</html>
```

---

### **Option B: Using Modular Files**

```html
<!DOCTYPE html>
<html>
<head>
    <title>SmartSpark</title>
</head>
<body>
    <button onclick="startSubject('Science')">Start Learning</button>

    <!-- MODULAR APPROACH - MUST BE IN ORDER -->
    <script src="state.js"></script>
    <script src="router.js"></script>
    <script src="chapters.js"></script>
    <script src="data-layer.js"></script>
    
    <script>
        function startSubject(subject) {
            goToChapters(subject);  // From router.js
        }
    </script>
</body>
</html>
```

**⚠️ CRITICAL: Include scripts in this order:**
1. state.js (no dependencies)
2. router.js (depends on state.js)
3. chapters.js (depends on data-layer.js)
4. data-layer.js (core system)

---

## 🚀 RECOMMENDED SETUP

### **For Phase 1 (MVP - Current):**
```
Use: data-layer.js ONLY
Reason: Simpler, faster, fewer files
Include:
<script src="data-layer.js"></script>
```

### **For Phase 2+ (Scale):**
```
Use: Modular files
Reason: Better organization, easier maintenance
Include:
<script src="state.js"></script>
<script src="router.js"></script>
<script src="chapters.js"></script>
<script src="data-layer.js"></script>
```

---

## 🔀 AVAILABLE FUNCTIONS BY MODULE

### **From state.js:**
- `getState()`
- `setState(patch)`
- `clearState()`
- `getSelectedYear()`
- `getSelectedSubject()`
- `getSelectedChapter()`
- `setYear(year)`
- `setSubject(subject)`
- `setChapter(chapter)`
- `isReadyForLearning()`

### **From router.js:**
- `goHome()`
- `goToSubjects(year)`
- `goToChapters(subject)`
- `goToLearn(chapterId)`
- `goToProgress()`
- `goToCMS()`
- `goToCMSDashboard()`
- `validateState(level)`
- `ensureState(level)`
- `goBack()`
- `logout()`
- `getCurrentApp()`

### **From chapters.js:**
- `getChaptersForYearSubject(year, subject)`
- `getChapterById(chapterId)`
- `getChapterProgress(userId, chapterId)`
- `getChapterScore(userId, chapterId)`
- `getChapterAccuracy(userId, chapterId)`
- `isChapterCompleted(userId, chapterId)`
- `getChaptersByStatus(year, subject, status)`
- `getChapterFlashcards(chapterId)`
- `getChapterQuestions(chapterId)`
- `getChapterVersions(chapterId)`
- `getChapterMetadata(chapterId)`
- `getSubjectCompletionPercentage(userId, year, subject)`
- `getSubjectAverageAccuracy(userId, year, subject)`
- `getSubjectTotalPoints(userId, year, subject)`
- `getWeakChapters(userId, year, subject, threshold)`
- `getStrongChapters(userId, year, subject, threshold)`

### **From data-layer.js:**
- All chapter, flashcard, question, user, analytics, CMS functions
- See data-layer.js file for complete list (50+ functions)

---

## ⚠️ COMMON MISTAKES

### **Mistake 1: Wrong Script Order**
```javascript
❌ WRONG:
<script src="data-layer.js"></script>
<script src="chapters.js"></script>     // chapters.js needs data-layer.js!
<script src="state.js"></script>
```

```javascript
✅ CORRECT:
<script src="state.js"></script>
<script src="router.js"></script>
<script src="chapters.js"></script>
<script src="data-layer.js"></script>
```

### **Mistake 2: Forgetting to include state.js**
```javascript
❌ WRONG:
<script src="chapters.js"></script>
<script src="data-layer.js"></script>
// router.js uses functions from state.js!
```

```javascript
✅ CORRECT:
<script src="state.js"></script>
<script src="chapters.js"></script>
<script src="data-layer.js"></script>
```

### **Mistake 3: Using functions before including file**
```javascript
❌ WRONG:
<script>
  goToChapters('Science');  // Function not loaded yet!
</script>
<script src="router.js"></script>  // Loaded after use
```

```javascript
✅ CORRECT:
<script src="router.js"></script>
<script>
  goToChapters('Science');  // Now function exists
</script>
```

---

## 🎯 QUICK DECISION

**Choose your approach:**

### ✅ If you're: Starting out (MVP, Phase 1, quick deployment)
```
→ Use: data-layer.js ONLY
→ Include: <script src="data-layer.js"></script>
→ Complexity: Low
→ Recommended: YES
```

### ✅ If you're: Building for production (long-term, Phase 2+, team)
```
→ Use: Modular files (state.js, router.js, chapters.js, data-layer.js)
→ Include: All 4 in order
→ Complexity: Medium
→ Recommended: For scaling
```

---

## 📦 WHICH APPROACH IS IN YOUR CURRENT FILES?

**Current downloaded files use: `data-layer.js` (single file)**

All HTML files include:
```html
<script src="data-layer.js"></script>
```

**If you want to switch to modular approach:**
1. Download state.js, router.js, chapters.js from above
2. Update all HTML files to include all 4 scripts
3. Keep the script order!

---

## 🧪 TEST YOUR SETUP

After including scripts, open browser console (F12) and test:

```javascript
// Test state.js
console.log(getState());              // Should return object
setState({year: 6});
console.log(getSelectedYear());        // Should return 6

// Test router.js
console.log(validateState('year'));   // Should return true

// Test chapters.js
const chapters = getChaptersForYearSubject(6, 'Science');
console.log(chapters.length);         // Should show chapter count

// Test data-layer.js
const user = getCurrentUser();
console.log(user);                    // Should return user or null
```

---

## 📚 ADDITIONAL NOTES

- All modules use localStorage/sessionStorage
- Modules are stateless (no global variables)
- Functions are pure (no side effects except storage)
- All error handling included
- Ready for production use

---

## 🚀 RECOMMENDATION

**For your current setup:** Use `data-layer.js` (simplest)

**Future upgrade to modular:** When you scale to Phase 2+

**Current approach is optimal for** MVP launch and fast deployment! ✅
