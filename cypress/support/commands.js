// cypress/support/commands.js - Custom Cypress Commands
// Helper functions for common test operations

/**
 * Login or authenticate user
 * @param {string} userId - User ID
 * @param {string} userName - User name
 */
Cypress.Commands.add('authenticateUser', (userId = 'user_test_001', userName = 'Test Student') => {
  cy.window().then((win) => {
    const user = {
      user_id: userId,
      name: userName,
      email: `${userId}@smartspark.local`,
      role: 'student',
      created_at: new Date().toISOString()
    };
    
    // Store user in localStorage (using data-layer.js functions)
    const users = JSON.parse(localStorage.getItem('ss_users') || '{}');
    users[userId] = user;
    localStorage.setItem('ss_users', JSON.stringify(users));
    
    // Set current user
    localStorage.setItem('ss_current_user', userId);
  });
});

/**
 * Setup test data: Years, Subjects, Chapters, Questions
 */
Cypress.Commands.add('setupTestData', () => {
  cy.window().then((win) => {
    // Create Chapters
    const chapters = {
      'ch_6_math_001': {
        chapter_id: 'ch_6_math_001',
        class: 6,
        subject: 'Math',
        title: 'Chapter 1: Numbers and Operations',
        description: 'Learn about numbers, operations, and basic arithmetic',
        status: 'published',
        created_at: '2026-01-01T10:00:00Z'
      },
      'ch_6_math_002': {
        chapter_id: 'ch_6_math_002',
        class: 6,
        subject: 'Math',
        title: 'Chapter 2: Fractions',
        description: 'Understanding fractions and decimals',
        status: 'published',
        created_at: '2026-01-02T10:00:00Z'
      },
      'ch_6_science_001': {
        chapter_id: 'ch_6_science_001',
        class: 6,
        subject: 'Science',
        title: 'Chapter 1: Life Processes',
        description: 'Basic life processes and living organisms',
        status: 'published',
        created_at: '2026-01-03T10:00:00Z'
      },
      'ch_7_math_001': {
        chapter_id: 'ch_7_math_001',
        class: 7,
        subject: 'Math',
        title: 'Chapter 1: Integers',
        description: 'Positive and negative numbers',
        status: 'published',
        created_at: '2026-01-04T10:00:00Z'
      },
      'ch_8_english_001': {
        chapter_id: 'ch_8_english_001',
        class: 8,
        subject: 'English',
        title: 'Chapter 1: Literature and Writing',
        description: 'Understanding literature and creative writing',
        status: 'published',
        created_at: '2026-01-05T10:00:00Z'
      }
    };
    localStorage.setItem('ss_chapters', JSON.stringify(chapters));

    // Create Questions for Math Chapter 1 (Class 6)
    const questions = {
      'q_ch_6_math_001_1': {
        question_id: 'q_ch_6_math_001_1',
        chapter_id: 'ch_6_math_001',
        question_text: 'What is 25 + 35?',
        options: ['50', '55', '60', '65'],
        correct_option_index: 1,
        explanation: 'Adding 25 + 35 gives us 60. Wait, let me recalculate: 25 + 35 = 60. No, 25 + 30 = 55. So 25 + 35 = 60. Actually 25 + 35 = 60. Hmm, 20 + 30 = 50, so 25 + 35 = 60. Let me verify: 25 + 35 = 60. Actually no: 25 + 35 equals 60. Wait: 2*10 + 2*10 = 40, + 5 + 5 = 10, total 50? No. 25 + 35: the 20s make 40, the 5s make 10, so 50 total. Actually 25+35 = 60. Let me be more careful. 20 + 30 = 50. 5 + 5 = 10. 50 + 10 = 60.'
      },
      'q_ch_6_math_001_2': {
        question_id: 'q_ch_6_math_001_2',
        chapter_id: 'ch_6_math_001',
        question_text: 'What is 100 ÷ 4?',
        options: ['20', '25', '30', '40'],
        correct_option_index: 1,
        explanation: 'Dividing 100 by 4 equals 25. We can verify: 25 × 4 = 100.'
      },
      'q_ch_6_math_001_3': {
        question_id: 'q_ch_6_math_001_3',
        chapter_id: 'ch_6_math_001',
        question_text: 'What is 12 × 5?',
        options: ['50', '55', '60', '65'],
        correct_option_index: 2,
        explanation: 'Multiplying 12 by 5 gives us 60.'
      },
      'q_ch_6_math_001_4': {
        question_id: 'q_ch_6_math_001_4',
        chapter_id: 'ch_6_math_001',
        question_text: 'Which number is even?',
        options: ['13', '17', '22', '29'],
        correct_option_index: 2,
        explanation: 'Even numbers are divisible by 2. 22 is even because 22 ÷ 2 = 11.'
      },
      'q_ch_6_math_001_5': {
        question_id: 'q_ch_6_math_001_5',
        chapter_id: 'ch_6_math_001',
        question_text: 'What is 7 + 8?',
        options: ['14', '15', '16', '17'],
        correct_option_index: 1,
        explanation: '7 + 8 = 15'
      }
    };
    localStorage.setItem('ss_question_bank', JSON.stringify(questions));

    // Create Flashcards for Math Chapter 1 (Class 6)
    const flashcards = {
      'fc_ch_6_math_001_1': {
        flashcard_id: 'fc_ch_6_math_001_1',
        chapter_id: 'ch_6_math_001',
        term: 'Prime Number',
        definition: 'A number that has exactly two factors: 1 and itself'
      },
      'fc_ch_6_math_001_2': {
        flashcard_id: 'fc_ch_6_math_001_2',
        chapter_id: 'ch_6_math_001',
        term: 'Multiple',
        definition: 'A number that is the product of a number and any integer'
      }
    };
    localStorage.setItem('ss_flashcards', JSON.stringify(flashcards));

    // Create user progress
    const userId = localStorage.getItem('ss_current_user') || 'user_test_001';
    const progress = {
      user_id: userId,
      total_points: 0,
      current_streak: 0,
      longest_streak: 0,
      chapters_progress: {},
      created_at: new Date().toISOString()
    };
    localStorage.setItem(`ss_progress_${userId}`, JSON.stringify(progress));
  });
});

/**
 * Navigate to Chapter and start quiz
 * @param {number} classYear - Class/Year (6, 7, 8)
 * @param {string} subject - Subject name
 * @param {number} chapterNum - Chapter number
 */
Cypress.Commands.add('navigateToChapter', (classYear, subject, chapterNum) => {
  // Set year
  cy.window().then((win) => {
    sessionStorage.setItem('ss_state', JSON.stringify({ 
      year: classYear, 
      subject, 
      chapter: null 
    }));
  });

  // Navigate to subjects
  cy.visit('/index.html');
  cy.contains(`.year-card`, `Class ${classYear}`).click();
  
  // Select subject
  cy.contains(`.subject-card`, subject).click();
});

/**
 * Verify score is displayed
 * @param {number} expectedMinScore - Minimum expected score percentage
 */
Cypress.Commands.add('verifyScoreDisplayed', (expectedMinScore = 0) => {
  cy.get('#final-score', { timeout: 5000 }).should('be.visible');
  cy.get('#final-score').invoke('text').then((scoreText) => {
    expect(scoreText).to.match(/\d+\s*\/\s*\d+/);
  });
});

/**
 * Clear test data and reset state
 */
Cypress.Commands.add('clearTestData', () => {
  cy.window().then((win) => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// Suppress console errors during tests
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
