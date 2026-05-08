# Cypress Automation - TC-7.1 Quick Start Guide

## What is This?

This is an automated test for **TC-7.1: Full workflow Class 6 Math** created using Cypress. The test automates the entire learning workflow:

**Index Page → Year Selection → Subject Selection → Chapter Selection → Quiz → Score Display**

## File Structure Created

```
cypress/
├── e2e/
│   └── workflow-tc7-1.cy.js       ← Main test file (TC-7.1)
├── support/
│   ├── commands.js                 ← Helper functions for tests
│   └── e2e.js                      ← Test configuration
cypress.config.js                   ← Cypress settings
package.json                        ← NPM dependencies
CYPRESS-TESTS.md                    ← Detailed documentation
CYPRESS-QUICKSTART.md               ← This file
```

## Quick Setup (3 Steps)

### Step 1: Install Cypress
```bash
npm install
```

### Step 2: Start Your Server
Make sure SmartSpark UI is running on `http://localhost:5500`
```bash
# Example: Using Python http.server
python -m http.server 5500

# Or use Live Server extension in VS Code
```

### Step 3: Run the Test
```bash
# Interactive Test Runner (Recommended for first time)
npm run test:open

# OR

# Headless (CLI - no GUI)
npm run test:tc7-1
```

## What Does TC-7.1 Test?

The test automates these 5 steps:

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Select Year 6 from index page | Navigation to subjects page |
| 2 | Select Math subject | Navigation to chapters page |
| 3 | Select Chapter 1 (Numbers & Operations) | Navigation to quiz/learn page |
| 4 | Answer all 5 MCQ questions correctly | All answers recorded |
| 5 | Submit quiz | Score displayed and saved |

### Test Questions:
1. **25 + 35 = ?** → Answer: 55 (Option 2)
2. **100 ÷ 4 = ?** → Answer: 25 (Option 2)
3. **12 × 5 = ?** → Answer: 60 (Option 3)
4. **Which number is even?** → Answer: 22 (Option 3)
5. **7 + 8 = ?** → Answer: 15 (Option 2)

## Running Tests - Different Ways

### 1. Interactive GUI (Recommended for Learning)
```bash
npm run test:open
```
Opens browser with Cypress Test Runner where you can:
- Click test files to run
- Watch test execution in real-time
- See detailed logs
- Debug step-by-step
- Take screenshots

### 2. Run Specific Test (Headless)
```bash
npm run test:tc7-1
```
Runs TC-7.1 test in background without GUI.

### 3. Run All Tests
```bash
npm test
```
Runs all tests in `cypress/e2e/` folder.

### 4. Run with Different Browser
```bash
npm run test:chrome      # Chrome
npm run test:firefox     # Firefox
```

### 5. Watch Mode (Reload on File Change)
```bash
npm run test:watch
```

## Test Data Setup

The test automatically creates mock data:
- **5 Classes:** Class 6, 7, 8
- **5 Chapters:** Math, Science, English across classes
- **5 Questions:** Math Chapter 1 for Class 6
- **2 Flashcards:** For revision phase
- **Test User:** Automatically created

No manual data setup needed!

## Expected Output

### Success Output:
```
✓ TC-7.1: Full workflow Class 6 Math
  ✓ Should complete full workflow and display score
  ✓ Should handle question interaction and answer selection correctly
  ✓ Should navigate back from results screen

All tests passed!
```

### Test Report Shows:
- Step 1: Selecting Year 6 ✓
- Step 2: Selecting Math subject ✓
- Step 3: Selecting Chapter 1 ✓
- Step 4: Taking quiz and answering all MCQs ✓
- Step 5: Verifying quiz completion and score display ✓

## Test Execution Timeline

- **Setup:** ~1 second (clear data, setup test user)
- **Year Selection:** ~2 seconds
- **Subject Selection:** ~2 seconds
- **Chapter Selection:** ~2 seconds
- **Quiz Execution:** ~5 seconds (2 MCQs answered)
- **Verification:** ~2 seconds
- **Total:** ~15 seconds per test

## Debugging Tips

### If Test Fails:

1. **Check Server is Running**
   ```bash
   curl http://localhost:5500
   ```

2. **Check Browser Console for Errors**
   - In Cypress GUI, press F12 to open DevTools
   - Check Console tab for JavaScript errors

3. **View Detailed Logs**
   - In Cypress GUI, expand "Command Log" on left
   - Each command shows what it did

4. **Pause & Step Through**
   - Add to test: `cy.pause()`
   - Test will pause before that line
   - Click "Step" to execute one command at a time

5. **Take Screenshots**
   - Add to test: `cy.screenshot('my-screenshot')`
   - Screenshots saved in `cypress/screenshots/`

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Cannot connect to http://localhost:5500** | Start your server on port 5500 |
| **Element not found** | Check if page loaded fully (add wait time) |
| **State not persisting** | Verify sessionStorage is set correctly |
| **Quiz questions missing** | Check localStorage has test data (setupTestData() call) |
| **Tests timeout** | Increase timeout in cypress.config.js |

## Test Components Used

### Custom Commands (in `cypress/support/commands.js`):
- `cy.authenticateUser()` - Create test user
- `cy.setupTestData()` - Create mock chapters/questions
- `cy.clearTestData()` - Reset state between tests
- `cy.verifyScoreDisplayed()` - Verify score shown

### Selectors Used:
- `.year-card` - Year selection cards
- `.subject-card` - Subject cards
- `.chapter-card` - Chapter cards
- `.option` - MCQ options
- `.question-text` - Question text
- `#final-score` - Result score display

## What's Being Tested?

✅ **Navigation:**
- Index → Subjects → Chapters → Quiz ✓

✅ **Data Flow:**
- Year selection saved to sessionStorage ✓
- Subject selection saved to state ✓
- Chapter selection saved to state ✓

✅ **Quiz Interaction:**
- Questions displayed ✓
- Options clickable ✓
- Answers recorded ✓

✅ **Scoring:**
- Score calculated correctly ✓
- Score displayed ✓
- Score saved to localStorage ✓

## Integration with CI/CD

To run tests in GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Cypress Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Next Steps

1. **Run the test:** `npm run test:open`
2. **Watch it execute** in the browser
3. **Review the logs** to understand workflow
4. **Add more tests** using the same pattern
5. **Integrate with CI/CD** for automatic testing

## Reference Files

| File | Purpose |
|------|---------|
| [cypress/e2e/workflow-tc7-1.cy.js](cypress/e2e/workflow-tc7-1.cy.js) | Main test specification |
| [cypress/support/commands.js](cypress/support/commands.js) | Reusable test helpers |
| [cypress.config.js](cypress.config.js) | Cypress configuration |
| [CYPRESS-TESTS.md](CYPRESS-TESTS.md) | Detailed documentation |
| [package.json](package.json) | Dependencies and scripts |

## Example Custom Test

To create another test, follow this pattern:

```javascript
// cypress/e2e/my-test.cy.js
describe('My Custom Test', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.setupTestData();
    cy.authenticateUser();
    cy.visit('/index.html');
  });

  it('should do something', () => {
    cy.contains('.year-card', 'Class 6').click();
    cy.url().should('include', 'subjects.html');
    // Add your test steps here
  });
});
```

Then run with: `npx cypress run cypress/e2e/my-test.cy.js`

## Support & Documentation

- **Cypress Docs:** https://docs.cypress.io
- **Best Practices:** https://docs.cypress.io/guides/references/best-practices
- **Test Reports:** Open `cypress-reports/index.html` after running tests

---

**Happy Testing! 🚀**

For questions or issues, refer to [CYPRESS-TESTS.md](CYPRESS-TESTS.md) for detailed documentation.
