module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run dev",
      startServerReadyPattern: "Local:",
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
    },

    assert: {
      assertions: {
        // STRICT (same as countries)
        "categories:accessibility": ["error", { minScore: 0.9 }],

        // Ignore for now
        "categories:performance": "off",

        // Informational
        "categories:best-practices": "warn",
        "categories:seo": "warn",
      },
    },

    upload: {
      target: "temporary-public-storage",
    },
  },
};
