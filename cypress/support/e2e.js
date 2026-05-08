// cypress/support/e2e.js
// E2E test configuration and global setup

import './commands'

// Disable uncaught exception handling for specific errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Allow tests to proceed even if there are unhandled errors
  // (useful for legacy code without proper error handling)
  return false;
});
