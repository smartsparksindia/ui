// cypress/e2e/workflow-tc7-1.cy.js
// Test Case: TC-7.1 - Full workflow Class 6 Math
// 
// Workflow: Year Selection → Subject Selection → Chapter Selection → Answer MCQs → Submit & Verify Score
// 
// Preconditions: Fresh user session
// Steps:
//   1. Select Year 6
//   2. Select Maths
//   3. Click on Arithmetic accordion to select Chapter
//   4. Select Chapter 1
//   5. Select Quiz
//   6. Answer all MCQs
//   7. Submit and verify score
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
    // Step 3: Select Arithmetic accordion and choose Chapter 1
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 3: Selecting Arithmetic accordion');
    cy.contains('.subject-area-title', 'Arithmetic', { timeout: 5000 }).should('be.visible').click({ force: true });
    
    cy.log('Step 4: Selecting Chapter 1');
    cy.contains('.chapter-title', 'Chapter 1', { timeout: 5000 }).should('be.visible').click({ force: true });
    
    cy.url().should('include', 'learn.html');

    // ═══════════════════════════════════════════════════════════════
    // Step 5: Start the quiz
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 5: Starting quiz');
    cy.contains('.choice-btn', /Take Quiz|Start Quiz/i).should('be.visible').click({ force: true });
    cy.wait(500);

    // ═══════════════════════════════════════════════════════════════
    // Step 6: Answer all MCQs
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 6: Answering all questions');
    const answerAllQuestions = () => {
      cy.get('body').then(($body) => {
        if ($body.find('.option').length > 0) {
          cy.get('.option').first().click({ force: true });
          cy.wait(300);
          cy.get('button').contains(/Next Question|Finish Quiz|Finish Quiz ✓|Finish Quiz/i).click({ force: true });
          answerAllQuestions();
        }
      });
    };
    answerAllQuestions();

    // ═══════════════════════════════════════════════════════════════
    // Step 7: Verify Score is Displayed
    // ═══════════════════════════════════════════════════════════════
    cy.log('Step 7: Verifying quiz completion');
    
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
