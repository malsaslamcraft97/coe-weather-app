const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1440,
    viewportHeight: 1024,
    setupNodeEvents(on, config) {
      on("task", {
        logA11y(data) {
          console.log("\n=== A11Y REPORT ===");
          console.log(JSON.stringify(data, null, 2));
          console.log("=== END REPORT ===\n");
          return null;
        },
      });

      return config;
    },
  },

  video: false,
});
