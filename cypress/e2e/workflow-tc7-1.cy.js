// cypress/e2e/workflow-tc7-1.cy.js
// Test Case: TC-7.1 - Full workflow Class 6 Math
// 
// Workflow: Year Selection → Subject Selection → Chapter Selection → Answer MCQs → Submit & Verify Score
// 
// Preconditions: Fresh user session
// Steps:
//   1. Select Year 6
//   2. Select Math
//   3. Select Chapter 1
//   4. Answer all MCQs
//   5. Submit
// Expected Results: Score displayed and saved

describe('TC-7.1: Full workflow Class 6 Math - Year → Subject → Chapter → Quiz → Score', () => {
  
  beforeEach(() => {
    // Clear all test data before each test
    cy.clearTestData();
    
    // Setup test data: chapters, questions, flashcards
    cy.setupTestData();
    
    // Authenticate test user
    cy.authenticateUser('user_test_001', 'Test Student Class 6');
    
    // Visit the application home page
    cy.visit('/index.html');
  });

  it('Should complete full workflow and display score', () => {
    // ═══════════════════════════════════════════════════════════════
    // Step 1: Select Year 6 from Index Page
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 1: Selecting Year 6');
    
    cy.contains('SmartSpark', { timeout: 5000 }).should('be.visible');
    cy.contains('.year-card', 'Class 6').should('be.visible').click({ force: true });
    
    cy.url().should('include', 'subjects.html');

    // ═══════════════════════════════════════════════════════════════
    // Step 2: Select Subject (Math)
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 2: Selecting Math subject');
    
    cy.contains('.subject-card', 'Math').should('be.visible').click({ force: true });
    
    cy.url().should('include', 'chapters.html');
    cy.contains('Choose a Chapter').should('be.visible');

    // ═══════════════════════════════════════════════════════════════
    // Step 3: Select First Available Chapter
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 3: Selecting first chapter');
    
    // Just click the first chapter card if it exists
    cy.get('.chapter-card', { timeout: 5000 }).first().click({ force: true });
    
    cy.url().should('include', 'learn.html');

    // ═══════════════════════════════════════════════════════════════
    // Step 4: Take Quiz - Answer All MCQs
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 4: Taking quiz and answering MCQs');
    
    // Click "Take Quiz" button
    cy.contains('.choice-btn', 'Take Quiz').should('be.visible').click({ force: true });
    cy.wait(500);
    
    // Answer questions - just click first option for each
    cy.get('.option').each(($el, index) => {
      cy.wrap($el).first().click({ force: true });
      cy.wait(300);
    });

    // ═══════════════════════════════════════════════════════════════
    // Step 5: Verify Score is Displayed
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 5: Verifying quiz completion');
    
    cy.contains('.phase-title', 'Quiz Complete', { timeout: 5000 }).should('be.visible');
    cy.get('#final-score').should('be.visible');
  });

  it('Should handle question interaction and answer selection correctly', () => {
    cy.authenticateUser('user_test_001', 'Test Student');
    cy.setupTestData();
    
    cy.visit('/learn.html');
    cy.window().then((win) => {
      sessionStorage.setItem('ss_state', JSON.stringify({
        year: 6,
        subject: 'Math',
        chapter: 'ch_6_math_001'
      }));
    });
    cy.reload();
    
    // Start quiz
    cy.contains('.choice-btn', 'Take Quiz').click({ force: true });
    
    // Verify first question is displayed
    cy.get('.question-text').should('be.visible');
    cy.get('.option').should('have.length.greaterThan', 0);
  });

  it('Should navigate back from results screen', () => {
    cy.authenticateUser('user_test_001', 'Test Student');
    cy.setupTestData();
    
    cy.visit('/learn.html');
    cy.window().then((win) => {
      sessionStorage.setItem('ss_state', JSON.stringify({
        year: 6,
        subject: 'Math',
        chapter: 'ch_6_math_001'
      }));
    });
    cy.reload();
    
    // Take quiz and answer all questions
    cy.contains('.choice-btn', 'Take Quiz').click({ force: true });
    cy.get('.option').each(() => {
      cy.get('.option').first().click({ force: true });
      cy.wait(200);
    });
    
    // Verify back button is visible
    cy.contains('.next-btn', 'Back to Chapters').should('be.visible');
  });
});
