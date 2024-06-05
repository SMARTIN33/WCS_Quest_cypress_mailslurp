const { defineConfig } = require("cypress");

// cypress.config.js
module.exports = defineConfig({
  env: {
    MAILSLURP_API_KEY:
      "f96ab034e1112c6a67c6e6d49ac545885aa722f62f8948b23bb8720882bbc1d1",
  },
  e2e: {
    defaultCommandTimeout: 40000,
    responseTimeout: 40000,
    requestTimeout: 40000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});