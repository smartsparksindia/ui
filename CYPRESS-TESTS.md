# Cypress Test Automation - SmartSpark UI

## Overview
This directory contains automated Cypress tests for the SmartSpark learning platform. Currently includes TC-7.1: Full workflow test for Class 6 Math module.

## Project Structure
```
cypress/
├── e2e/
│   └── workflow-tc7-1.cy.js       # TC-7.1 test spec
├── support/
│   ├── commands.js                 # Custom Cypress commands
│   └── e2e.js                      # E2E configuration
cypress.config.js                   # Cypress configuration
CYPRESS-TESTS.md                    # This file
```

## Setup Instructions

### 1. Install Cypress
```bash
npm install cypress --save-dev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Base URL
The `cypress.config.js` is configured to use `http://localhost:5500` as base URL.
Update this if your server runs on a different port.

## Running Tests

### Open Cypress Test Runner (Interactive)
```bash
npx cypress open
```

This opens the Cypress GUI where you can:
- View all test files
- Run individual tests
- Watch test execution in real-time
- Debug with DevTools
- View detailed logs

### Run Tests Headless (CLI)
```bash
# Run all tests
npx cypress run

# Run specific test file
npx cypress run cypress/e2e/workflow-tc7-1.cy.js

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox

# Run with video recording
npx cypress run --record
```

## Test Files

### TC-7.1: Full Workflow - Class 6 Math
**File:** `cypress/e2e/workflow-tc7-1.cy.js`

**Description:** Tests the complete learning workflow from year selection through quiz completion.

**Workflow:**
1. User selects Year 6 from index page
2. User selects Math subject
3. User selects Chapter 1 (Numbers and Operations)
4. User takes quiz and answers all 5 MCQs
5. Quiz is submitted and score is displayed
6. Score is verified to be saved in user progress

**Test Cases:**
- `Should complete full workflow and display score` - Main workflow test
- `Should handle question interaction and answer selection correctly` - MCQ interaction test
- `Should navigate back from results screen` - Navigation test

**Expected Results:**
- All navigation works correctly
- Quiz questions are displayed
- Answer selection works
- Score calculation is correct
- Score is displayed and saved

## Custom Commands

The `cypress/support/commands.js` file provides helper commands:

### `cy.authenticateUser(userId, userName)`
Sets up a test user in localStorage.
```javascript
cy.authenticateUser('user_test_001', 'Test Student');
```

### `cy.setupTestData()`
Creates test data including:
- Chapters for Classes 6, 7, 8
- Multiple subjects (Math, Science, English)
- Questions for each chapter
- Flashcards for revision
```javascript
cy.setupTestData();
```

### `cy.navigateToChapter(classYear, subject, chapterNum)`
Navigates to a specific chapter.
```javascript
cy.navigateToChapter(6, 'Math', 1);
```

### `cy.clearTestData()`
Clears localStorage and sessionStorage between tests.
```javascript
cy.clearTestData();
```

## Test Data

The `setupTestData()` command creates:

### Chapters
- `ch_6_math_001` - Class 6 Math Chapter 1
- `ch_6_math_002` - Class 6 Math Chapter 2
- `ch_6_science_001` - Class 6 Science Chapter 1
- `ch_7_math_001` - Class 7 Math Chapter 1
- `ch_8_english_001` - Class 8 English Chapter 1

### Questions (5 MCQs per chapter)
Questions are stored in `ss_question_bank` localStorage with:
- Question text
- 4 options
- Correct option index
- Explanation

### Flashcards
2 flashcards per chapter for revision phase.

## Debugging Tests

### View Test Logs
In Cypress Test Runner, expand "Command Log" on the left panel to see detailed command execution.

### Use cy.log() for Custom Messages
```javascript
cy.log('This is a custom message');
```

### Debug with cy.debug()
```javascript
cy.get('.option').debug();
```

### Pause Execution
```javascript
cy.pause(); // Pauses test, allows step-by-step debugging
```

### Take Screenshots
```javascript
cy.screenshot('my-screenshot');
```

## Common Issues & Solutions

### Test Base URL Error
**Error:** `Cannot connect to http://localhost:5500`
**Solution:** 
1. Ensure your local server is running
2. Check port number in `cypress.config.js`
3. Update base URL if needed

### Timeout Errors
**Error:** `Timed out after waiting for element`
**Solution:**
1. Increase timeout: `cy.get('.selector', { timeout: 15000 })`
2. Verify element exists in the DOM
3. Check if page is fully loaded

### State Not Persisting
**Error:** State (year/subject) not carrying over to next page
**Solution:**
1. Check that sessionStorage is not being cleared
2. Verify state.js functions are working
3. Check router.js navigation logic

### Selector Issues
**Error:** Element selector not finding element
**Solution:**
1. Use `cy.contains()` for text-based selection
2. Use Firefox inspector to verify CSS selectors
3. Use more specific parent element context

## Browser Compatibility

Tests are configured for:
- Chrome (default)
- Firefox
- Edge
- Safari (macOS only)

Run with specific browser:
```bash
npx cypress run --browser firefox
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Cypress Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npx cypress run
```

## Test Reports

### Generate HTML Report
```bash
npx cypress run --reporter html --reporter-options reportDir=cypress-reports
```

Report will be generated in `cypress-reports/index.html`

## Future Test Cases to Automate

Based on TEST-CASES.md, the following should be automated:
- TC-1.2: Select different years
- TC-2.5: Subject selection
- TC-3.5: Chapter selection
- TC-5.1-5.12: MCQ interactions (select/deselect/switch answers)
- TC-6.1-6.13: Scoring and calculation
- TC-8.x: Error handling and edge cases
- TC-9.x: UI/UX validation
- TC-10.x: Data persistence tests

## Performance Testing

Monitor test execution performance:
```bash
npx cypress run --reporter json > cypress/results.json
```

## Accessibility Testing

For accessibility testing, consider adding:
- `cypress-axe` for automated accessibility checks
- Manual keyboard navigation tests
- Screen reader compatibility checks

## Contributing

When adding new tests:
1. Create new spec file in `cypress/e2e/`
2. Follow naming convention: `<test-category>-<test-name>.cy.js`
3. Use custom commands from `cypress/support/commands.js`
4. Add documentation in this README
5. Run tests locally before committing

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

## Support

For issues or questions:
1. Check Cypress documentation
2. Review test logs in Cypress GUI
3. Check browser DevTools (F12)
4. Review test implementation in spec file
5. Verify test data setup
